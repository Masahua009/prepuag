import Link from "next/link";
import areasData from "@/data/areas.json";

export default function StatsPage() {
  const allAreas = areasData;
  const totalSessions = 0;
  const totalQuestions = 0;
  const totalCorrect = 0;
  const globalPct = 0;

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-blue-600 no-underline hover:underline">← Volver al inicio</Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">📊 Estadísticas</h1>
        <p className="text-sm text-slate-500">Tu progreso de estudio para el examen UAG</p>
      </div>

      {/* Global */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-4xl font-bold text-blue-700">{totalSessions}</p>
          <p className="text-sm text-slate-500">Sesiones completadas</p>
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-4xl font-bold text-green-700">{totalQuestions}</p>
          <p className="text-sm text-slate-500">Preguntas respondidas</p>
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className={`text-4xl font-bold ${globalPct >= 70 ? "text-green-700" : globalPct >= 50 ? "text-yellow-700" : "text-red-700"}`}>
            {globalPct}%
          </p>
          <p className="text-sm text-slate-500">Promedio general</p>
        </div>
      </div>

      {/* Por área */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">📋 Áreas de estudio</h2>
        <p className="text-sm text-slate-500 mt-1">
          Las estadísticas detalladas se guardan en tu dispositivo (IndexedDB). Conéctate para sincronizar.
        </p>
        <div className="mt-4 space-y-3">
          {allAreas.map((area: any) => (
            <div key={area.id} className="flex items-center gap-3">
              <span className="text-xl">{area.icon}</span>
              <span className="w-36 text-sm font-medium text-slate-700">{area.name.replace(/^[^\s]+\s/, "")}</span>
              <span className="text-xs text-slate-400">{area.questionCount > 0 ? `${area.questionCount} preguntas` : "Refuerzo"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-4xl">📊</p>
        <h2 className="mt-3 text-lg font-bold text-slate-800">Tus estadísticas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Los resultados de tus quizzes se guardan automáticamente en tu dispositivo.
          ¡Haz un quiz para empezar a registrar tu progreso!
        </p>
        <Link
          href="/areas"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white no-underline shadow transition-all hover:bg-blue-700"
        >
          📋 Ir a practicar
        </Link>
      </div>
    </div>
  );
}
