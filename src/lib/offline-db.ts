"use client";

// Simple IndexedDB wrapper for offline question bank storage
// This stores all questions locally so the app works fully offline

interface Question {
  id: number;
  areaId: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

interface Area {
  id: number;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
  color: string;
  section: number;
}

interface PendingResult {
  id: string;
  areaId: number | null;
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: { questionId: number; selectedIndex: number; isCorrect: boolean }[];
  timestamp: number;
}

const DB_NAME = "prepuag-offline";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("questions")) {
        db.createObjectStore("questions", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("areas")) {
        db.createObjectStore("areas", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("pendingResults")) {
        db.createObjectStore("pendingResults", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("formulasCache")) {
        db.createObjectStore("formulasCache", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============ QUESTIONS ============
export async function saveQuestionsLocally(questions: Question[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("questions", "readwrite");
  const store = tx.objectStore("questions");
  for (const q of questions) {
    store.put(q);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getLocalQuestions(): Promise<Question[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("questions", "readonly");
    const store = tx.objectStore("questions");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getLocalQuestionsByArea(areaId: number): Promise<Question[]> {
  const all = await getLocalQuestions();
  return all.filter((q) => q.areaId === areaId);
}

export async function hasLocalQuestions(): Promise<boolean> {
  const questions = await getLocalQuestions();
  return questions.length > 0;
}

// ============ AREAS ============
export async function saveAreasLocally(areas: Area[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("areas", "readwrite");
  const store = tx.objectStore("areas");
  for (const a of areas) {
    store.put(a);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getLocalAreas(): Promise<Area[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("areas", "readonly");
    const store = tx.objectStore("areas");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============ PENDING RESULTS (offline sync) ============
export async function savePendingResult(result: PendingResult): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pendingResults", "readwrite");
    const store = tx.objectStore("pendingResults");
    store.put(result);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingResults(): Promise<PendingResult[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pendingResults", "readonly");
    const store = tx.objectStore("pendingResults");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removePendingResult(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pendingResults", "readwrite");
    tx.objectStore("pendingResults").delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ============ SYNC ============
export async function syncPendingResults(): Promise<number> {
  const pending = await getPendingResults();
  if (pending.length === 0) return 0;

  let synced = 0;
  for (const result of pending) {
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: result.areaId,
          mode: result.mode,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          answers: result.answers,
        }),
      });
      if (response.ok) {
        await removePendingResult(result.id);
        synced++;
      }
    } catch {
      // Will retry later
      break;
    }
  }

    // Also register background sync if available
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if ("sync" in reg) {
          await (reg as any).sync.register("sync-quiz-results");
        }
      } catch {
        // Background sync not available
      }
    }

  return synced;
}

// ============ CACHE FORMULAS ============
export async function cacheFormulasPage(html: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("formulasCache", "readwrite");
    tx.objectStore("formulasCache").put({ key: "formulas-html", value: html, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCachedFormulas(): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("formulasCache", "readonly");
    const request = tx.objectStore("formulasCache").get("formulas-html");
    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => reject(request.error);
  });
}
