import { notFound } from "next/navigation";
import Link from "next/link";
import { PracticeQuiz } from "./PracticeQuiz";
import areasData from "@/data/areas.json";
import questionsData from "@/data/questions.json";

const areaColors: Record<string, string> = {
  blue: "from-blue-500 to-blue-700",
  green: "from-green-500 to-green-700",
  purple: "from-purple-500 to-purple-700",
  red: "from-red-500 to-red-700",
  teal: "from-teal-500 to-teal-700",
  orange: "from-orange-500 to-orange-700",
  slate: "from-slate-500 to-slate-700",
  yellow: "from-amber-500 to-amber-700",
  pink: "from-pink-500 to-pink-700",
  cyan: "from-cyan-500 to-cyan-700",
  indigo: "from-indigo-500 to-indigo-700",
  rose: "from-rose-500 to-rose-700",
};

export default async function AreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const areaId = parseInt(id, 10);
  if (isNaN(areaId)) notFound();

  const area = areasData.find((a: any) => a.id === areaId);
  if (!area) notFound();

  const allQuestions = questionsData.filter((q: any) => q.areaId === areaId);

  if (allQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/areas" className="text-sm text-blue-600 no-underline hover:underline">
          ← Volver a áreas
        </Link>
        <div className="rounded-2xl bg-yellow-50 p-8 text-center ring-1 ring-yellow-200">
          <p className="text-4xl">📭</p>
          <h1 className="mt-3 text-xl font-bold text-yellow-800">Sin preguntas aún</h1>
          <p className="mt-2 text-yellow-700">Esta área no tiene preguntas cargadas todavía. Ejecuta el seed de la base de datos.</p>
        </div>
      </div>
    );
  }

  const gradient = areaColors[area.color] || areaColors.blue;

  return (
    <div className="space-y-6">
      <Link href="/areas" className="text-sm text-blue-600 no-underline hover:underline">
        ← Volver a áreas
      </Link>
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{area.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{area.name}</h1>
            <p className="text-sm opacity-90">{area.description}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-3 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">{allQuestions.length} preguntas disponibles</span>
          <span className="rounded-full bg-white/20 px-3 py-1">{area.questionCount} en el examen real</span>
        </div>
      </div>

      <PracticeQuiz areaId={areaId} areaName={area.name} questions={allQuestions} />
    </div>
  );
}
