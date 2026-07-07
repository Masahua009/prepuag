"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { savePendingResult } from "@/lib/offline-db";

interface Area {
  id: number;
  name: string;
  icon: string;
  questionCount: number;
}
interface Question {
  id: number;
  areaId: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}
interface QuizQuestion extends Question {
  areaName: string;
}

/** Baraja las opciones y actualiza correctIndex */
function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  const pairs = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const newCorrectIndex = pairs.findIndex((p) => p.isCorrect);
  return { ...q, options: pairs.map((p) => p.text), correctIndex: newCorrectIndex };
}

export default function ExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "ready" | "started" | "finished">("loading");
  const [areas, setAreas] = useState<Area[]>([]);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutos
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/quiz?mode=exam");
        const data = await res.json();
        setAreas(data.areas);
        setAllQuestions(data.questions);
        setPhase("ready");
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "started") return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    const t = setInterval(() => setTimeLeft((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const startExam = () => {
    // Estructura real: 6 áreas sección 1 (130) + 3 áreas sección 2 (60) = 190 preguntas
    // Simulacro: todas las preguntas disponibles de todas las áreas mezcladas
    const areaMap = new Map(areas.map((a) => [a.id, a.name]));
    const byArea = new Map<number, Question[]>();
    allQuestions.forEach((q) => {
      const arr = byArea.get(q.areaId) || [];
      arr.push(q);
      byArea.set(q.areaId, arr);
    });

    const selected: QuizQuestion[] = [];
    for (const [areaId, qs] of byArea.entries()) {
      const shuffled = [...qs].sort(() => Math.random() - 0.5);
      const areaName = areaMap.get(areaId) || "";
      // tomar todas las disponibles o máximo 15 por área
      const toTake = Math.min(shuffled.length, 15);
      selected.push(...shuffled.slice(0, toTake).map((q) => ({ ...q, areaName })));
    }

    // Barajar opciones de cada pregunta individualmente + orden de preguntas
    setQuizQuestions(selected.sort(() => Math.random() - 0.5).map(shuffleQuestionOptions));
    setPhase("started");
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(150 * 60); // 150 min para 190 preguntas
  };

  const handleSelect = (idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const q = quizQuestions[currentQ];
    setAnswers((prev) => [...prev, { questionId: q.id, selectedIndex: selected, isCorrect: selected === q.correctIndex }]);
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    } else {
      finishExam();
    }
  };

  const finishExam = async () => {
    setPhase("finished");
    setSaving(true);
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const payload = {
      areaId: null,
      mode: "exam",
      totalQuestions: quizQuestions.length,
      correctAnswers,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        isCorrect: a.isCorrect,
      })),
    };

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network error");
    } catch {
      await savePendingResult({
        id: crypto.randomUUID(),
        areaId: null,
        mode: "exam",
        totalQuestions: quizQuestions.length,
        correctAnswers,
        answers: payload.answers,
        timestamp: Date.now(),
      });
    }
    setSaving(false);
    router.refresh();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (phase === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-3 text-slate-500">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="space-y-6">
        <Link href="/" className="text-sm text-blue-600 no-underline hover:underline">← Volver al inicio</Link>
        <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">🎯 Simulacro de Examen</h1>
          <p className="mt-2 text-red-100">
            Simula el examen completo UAG para Ing. Mecatrónica con preguntas de las 9 áreas (1ra y 2da sección).
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {areas.map((a) => (
              <span key={a.id} className="rounded-full bg-white/20 px-3 py-1">{a.icon} {a.name}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-800">📋 Información del simulacro</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>⏰ <strong>Tiempo límite:</strong> 150 minutos</li>
            <li>📝 <strong>Preguntas:</strong> De las 9 áreas — Primera sección (Habilidades verbales, cuantitativas, español, matemáticas, ciencias naturales y sociales) + Segunda sección (Cálculo, Física, Química)</li>
            <li>📊 <strong>Formato:</strong> Opción múltiple con 4 opciones cada una</li>
            <li>💡 <strong>Consejo:</strong> Las preguntas de Cálculo, Física y Química requieren más tiempo. Adminístralo bien.</li>
          </ul>
          <button
            onClick={startExam}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl"
          >
            🎯 Iniciar Simulacro
          </button>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const correct = answers.filter((a) => a.isCorrect).length;
    const pct = Math.round((correct / quizQuestions.length) * 100);
    const emoji = pct >= 70 ? "🏆" : pct >= 50 ? "👍" : "📚";
    const resultsByArea = new Map<string, { correct: number; total: number }>();
    quizQuestions.forEach((q, i) => {
      const a = answers[i];
      if (!a) return;
      const entry = resultsByArea.get(q.areaName) || { correct: 0, total: 0 };
      entry.total++;
      if (a.isCorrect) entry.correct++;
      resultsByArea.set(q.areaName, entry);
    });

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-5xl">{emoji}</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-800">¡Simulacro Terminado!</h1>
          <p className="mt-1 text-slate-500">{quizQuestions.length} preguntas respondidas</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-6 py-2 text-3xl font-bold text-red-700">
            {correct}/{quizQuestions.length} — {pct}%
          </div>
          {saving && <p className="mt-2 text-sm text-slate-400">Guardando resultados...</p>}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-800">📊 Resultados por área</h2>
          <div className="mt-3 space-y-2">
            {Array.from(resultsByArea.entries()).map(([name, stats]) => {
              const areaPct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-slate-700">{name}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${areaPct >= 70 ? "bg-green-500" : areaPct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${areaPct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm font-semibold text-slate-700">{stats.correct}/{stats.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={startExam}
            className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow transition-all hover:bg-red-700"
          >
            🔄 Nuevo Simulacro
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Fase started
  const q = quizQuestions[currentQ];
  const progressPct = ((currentQ + 1) / quizQuestions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">Pregunta {currentQ + 1}/{quizQuestions.length}</span>
          <span className="text-xs text-slate-400">• {q.areaName}</span>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-bold ${timeLeft < 300 ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-100 text-slate-700"}`}>
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-6 text-lg font-semibold text-slate-800">{q.questionText}</h3>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                idx === selected
                  ? "border-red-400 bg-red-50 text-red-800 ring-1 ring-red-400"
                  : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white shadow transition-all hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQ + 1 === quizQuestions.length ? "Finalizar examen →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}
