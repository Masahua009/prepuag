import Link from "next/link";
import areasData from "@/data/areas.json";

const areaColors: Record<string, { bg: string; text: string; ring: string; progress: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", progress: "bg-blue-500" },
  green: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200", progress: "bg-green-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200", progress: "bg-purple-500" },
  red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", progress: "bg-red-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200", progress: "bg-teal-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", progress: "bg-orange-500" },
  slate: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-300", progress: "bg-slate-500" },
  yellow: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", progress: "bg-amber-500" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200", progress: "bg-pink-500" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200", progress: "bg-cyan-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200", progress: "bg-indigo-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", progress: "bg-rose-500" },
};

export default function AreasPage() {
  const section1 = areasData.filter((a: any) => a.section === 1);
  const section2 = areasData.filter((a: any) => a.section === 2);
  const section3 = areasData.filter((a: any) => a.section === 3);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-blue-600 no-underline hover:underline">← Volver al inicio</Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Áreas de Estudio</h1>
        <p className="text-sm text-slate-500">Examen UAG · Ing. Mecatrónica — 190 preguntas + refuerzo de fundamentos.</p>
      </div>

      {/* Sección 1 */}
      <SectionGrid title="📋 Primera Sección" subtitle="130 preguntas — Igual para todas las carreras" areas={section1} colors={areaColors} />

      {/* Sección 2 */}
      <SectionGrid title="⚙️ Segunda Sección · Área Ingeniería" subtitle="60 preguntas — Cálculo, Física y Química" areas={section2} colors={areaColors} />

      {/* Sección 3 */}
      {section3.length > 0 && (
        <SectionGrid title="🔧 Refuerzo de Fundamentos" subtitle="Aritmética, Álgebra, Trigonometría — Para fortalecer tu base" areas={section3} colors={areaColors} isExtra />
      )}
    </div>
  );
}

function SectionGrid({ title, subtitle, areas, colors, isExtra }: {
  title: string; subtitle: string; areas: any[]; colors: Record<string, any>; isExtra?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <h2 className="text-base font-bold text-slate-700">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isExtra ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
          {isExtra ? "Extra" : areas.reduce((s: number, a: any) => s + a.questionCount, 0) + " preguntas"}
        </span>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area: any) => {
          const c = colors[area.color] || colors.blue;
          return (
            <Link
              key={area.id}
              href={`/areas/${area.id}`}
              className={`rounded-2xl border p-6 no-underline transition-all hover:shadow-lg ${c.bg} ${c.ring} ring-1`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{area.icon}</span>
                <div className="flex-1">
                  <h2 className={`font-bold ${c.text}`}>{area.name.replace(/^[^\s]+\s/, "")}</h2>
                  <p className="text-xs text-slate-500">{area.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                  {area.questionCount > 0 ? `${area.questionCount} preguntas en el examen` : "Refuerzo de fundamentos"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
