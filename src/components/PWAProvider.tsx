"use client";

import { useEffect, useState, useCallback } from "react";
import {
  saveQuestionsLocally,
  saveAreasLocally,
  hasLocalQuestions,
  syncPendingResults,
} from "@/lib/offline-db";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Register service worker
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[PWA] Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
  }, []);

  // Detect online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingResults().then((count) => {
        if (count > 0) console.log(`[PWA] Synced ${count} pending results`);
      });
    };
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Detect if already installed
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  }, [deferredPrompt]);

  // Pre-cache questions and areas for offline use — AGGRESSIVE
  useEffect(() => {
    async function cacheData() {
      const alreadyCached = await hasLocalQuestions();
      if (alreadyCached) {
        console.log("[PWA] Data already cached offline ✅");
        return;
      }

      console.log("[PWA] Caching all questions and areas for offline use...");
      try {
        const [areasRes, questionsRes] = await Promise.all([
          fetch("/api/quiz"),
          fetch("/api/quiz?mode=exam"),
        ]);
        const areas = await areasRes.json();
        const { questions } = await questionsRes.json();

        await Promise.all([
          saveAreasLocally(areas),
          saveQuestionsLocally(questions),
        ]);
        console.log(`[PWA] ✅ Cached ${areas.length} areas + ${questions.length} questions`);
      } catch (err) {
        console.warn("[PWA] Failed to cache:", err);
      }
    }

    // Also pre-cache formulas page
    async function cacheFormulas() {
      try {
        const res = await fetch("/formulas");
        if (res.ok) {
          const html = await res.text();
          try {
            const { cacheFormulasPage } = await import("@/lib/offline-db");
            await cacheFormulasPage(html);
            console.log("[PWA] ✅ Formulas page cached");
          } catch {}
        }
      } catch {}
    }

    cacheData();
    cacheFormulas();
  }, []);

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg">
          📡 Sin conexión — Los datos se sincronizarán al volver
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📱</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">Instalar PrepUAG</p>
              <p className="text-xs text-slate-500">Úsala sin internet como una app nativa</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 transition-all hover:bg-slate-50"
            >
              Ahora no
            </button>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
