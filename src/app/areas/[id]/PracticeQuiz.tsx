"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePendingResult, getLocalQuestionsByArea } from "@/lib/offline-db";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

interface Props {
  areaId: number;
  areaName: string;
  questions: Question[];
}

/** Baraja las opciones de una pregunta y devuelve la pregunta con las opciones en nuevo orden + el nuevo índice correcto */
function shuffleQuestionOptions(q: Question): Question {
  // Crear pares [opción, esCorrecta]
  const pairs = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
  // Barajar con Fisher-Yates
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  // Encontrar el nuevo índice correcto
  const newCorrectIndex = pairs.findIndex((p) => p.isCorrect);
  return {
    ...q,
    options: pairs.map((p) => p.text),
    correctIndex: newCorrectIndex,
  };
}

export function PracticeQuiz({ areaId, areaName, questions: serverQuestions }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(serverQuestions);
  const [loadingLocal, setLoadingLocal] = useState(serverQuestions.length === 0);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: number; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const buildQuiz = useCallback(() => {
    // 1. Seleccionar preguntas aleatorias
    const arr = [...questions].sort(() => Math.random() - 0.5);
    const selected = arr.slice(0, Math.min(questionCount, arr.length));
    // 2. Barajar opciones de cada pregunta
    return selected.map(shuffleQuestionOptions);
  }, [questions, questionCount]);

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  // If server returned no questions (offline), try IndexedDB
  useEffect(() => {
    if (serverQuestions.length > 0) {
      setQuestions(serverQuestions);
      setLoadingLocal(false);
      return;
    }
    getLocalQuestionsByArea(areaId)
      .then((local) => {
        setQuestions(local);
        setLoadingLocal(false);
      })
      .catch(() => setLoadingLocal(false));
  }, [areaId, serverQuestions]);

  const startQuiz = () => {
    setQuizQuestions(buildQuiz());
    setStarted(true);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
    setFinished(false);
    setSaving(false);
  };

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const q = quizQuestions[currentQ];
    const isCorrect = selected === q.correctIndex;
    setAnswers((prev) => [...prev, { questionId: q.id, selectedIndex: selected, isCorrect }]);
    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      // guardar sesión
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setFinished(true);
    setSaving(true);
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const payload = {
      areaId,
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
      // Offline: save locally for later sync
      await savePendingResult({
        id: crypto.randomUUID(),
        areaId,
        mode: "practice",
        totalQuestions: quizQuestions.length,
        correctAnswers,
        answers: payload.answers,
        timestamp: Date.now(),
      });
    }
    setSaving(false);
    router.refresh();
  };

  if (loadingLocal) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="mt-3 text-sm text-slate-500">Cargando preguntas desde almacenamiento local...</p>
      </div>
    );
  }

  if (!started) {
    if (questions.length === 0) {
      return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center">
          <p className="text-4xl">📡</p>
          <h2 className="mt-3 text-lg font-bold text-slate-800">Sin preguntas disponibles</h2>
          <p className="mt-1 text-sm text-slate-500">
            Conéctate a internet una vez para descargar todas las preguntas. Luego podrás usar la app sin conexión.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">🎯 Modo Práctica</h2>
        <p className="mt-1 text-sm text-slate-500">
          Responde preguntas una por una y recibe retroalimentación inmediata. {questions.length} disponibles.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Número de preguntas:</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={5}>5 preguntas</option>
            <option value={10}>10 preguntas</option>
            <option value={15}>15 preguntas</option>
            <option value={20}>20 preguntas</option>
            <option value={questions.length}>Todas ({questions.length})</option>
          </select>
        </div>
        <button
          onClick={startQuiz}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          🚀 Comenzar práctica
        </button>
      </div>
    );
  }

  if (finished) {
    const correct = answers.filter((a) => a.isCorrect).length;
    const pct = Math.round((correct / quizQuestions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚";
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 text-center">
        <p className="text-5xl">{emoji}</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-800">¡Práctica terminada!</h2>
        <p className="mt-1 text-slate-500">
          {areaName} — {quizQuestions.length} preguntas
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-6 py-2 text-3xl font-bold text-blue-700">
          {correct}/{quizQuestions.length} — {pct}%
        </div>
        {saving && <p className="mt-2 text-sm text-slate-400">Guardando progreso...</p>}
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={startQuiz}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow transition-all hover:bg-blue-700"
          >
            🔄 Intentar de nuevo
          </button>
          <button
            onClick={() => router.push("/areas")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            ← Otra área
          </button>
        </div>
      </div>
    );
  }

  const q = quizQuestions[currentQ];
  const isCorrectAnswer = selected === q.correctIndex;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>Pregunta {currentQ + 1} de {quizQuestions.length}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          q.difficulty === "fácil" ? "bg-green-100 text-green-700" :
          q.difficulty === "difícil" ? "bg-red-100 text-red-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {q.difficulty}
        </span>
      </div>
      <div className="mb-6 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${((currentQ + (showResult ? 1 : 0)) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="mb-6 text-lg font-semibold text-slate-800">{q.questionText}</h3>

      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          let btnStyle = "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50";
          if (showResult) {
            if (idx === q.correctIndex) {
              btnStyle = "border-green-400 bg-green-50 text-green-800 ring-1 ring-green-400";
            } else if (idx === selected && !isCorrectAnswer) {
              btnStyle = "border-red-400 bg-red-50 text-red-800 ring-1 ring-red-400";
            } else {
              btnStyle = "border-slate-100 bg-slate-50 text-slate-400";
            }
          } else if (idx === selected) {
            btnStyle = "border-blue-400 bg-blue-50 text-blue-800 ring-1 ring-blue-400";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${btnStyle}`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
              {showResult && idx === q.correctIndex && <span className="ml-2">✅</span>}
              {showResult && idx === selected && !isCorrectAnswer && <span className="ml-2">❌</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className={`mt-4 rounded-xl p-4 ${isCorrectAnswer ? "bg-green-50 ring-1 ring-green-200" : "bg-amber-50 ring-1 ring-amber-200"}`}>
          <p className="text-sm font-semibold text-slate-800">
            {isCorrectAnswer ? "✅ ¡Correcto!" : "❌ Incorrecto"}
          </p>
          <p className="mt-1 text-sm text-slate-600">{q.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-3">
        {!showResult ? (
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQ + 1 === quizQuestions.length ? "Finalizar →" : "Siguiente →"}
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow transition-all hover:bg-blue-700"
          >
            {currentQ + 1 === quizQuestions.length ? "Ver resultados →" : "Continuar →"}
          </button>
        )}
      </div>
    </div>
  );
}
