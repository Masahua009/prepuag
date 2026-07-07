import Link from "next/link";
import { InstallInstructions } from "@/components/InstallInstructions";
import areasData from "@/data/areas.json";

const areaColors: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200" },
  red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
  slate: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-300" },
  yellow: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
};

export default function HomePage() {
  const allAreas = areasData;
  const totalSessions = 0;
  const totalCorrect = 0;
  const totalQuestions = 0;
  const avgScore = 0;

  const section1Areas = allAreas.filter((a) => a.section === 1);
  const section2Areas = allAreas.filter((a) => a.section === 2);
  const section3Areas = allAreas.filter((a) => a.section === 3);

  return (
    <div className="space-y-10">
      {/* Install instructions */}
      <InstallInstructions />

      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 text-white shadow-xl md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-blue-200">⚙️ Ing. Mecatrónica · UAG</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Prep<span className="text-blue-300">UAG</span>
            </h1>
            <p className="mt-3 max-w-lg text-blue-100">
              Repasa las <strong>2 secciones</strong> del examen de admisión UAG para Ingeniería Mecatrónica. Incluye <strong>refuerzo de fundamentos</strong> y <strong>fórmulas clave</strong>.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/examen"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 no-underline shadow-lg transition-transform hover:scale-105"
            >
              🎯 Simulacro
            </Link>
            <Link
              href="/formulas"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500/30 px-5 py-3 font-semibold text-white no-underline ring-1 ring-white/30 transition-transform hover:scale-105"
            >
              🧠 Fórmulas
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold">{allAreas.length}</p>
            <p className="text-xs text-blue-200">Áreas de estudio</p>
          </div>
          <div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold">{totalSessions}</p>
            <p className="text-xs text-blue-200">Sesiones completadas</p>
          </div>
          <div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold">{totalQuestions}</p>
            <p className="text-xs text-blue-200">Preguntas respondidas</p>
          </div>
          <div className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold">{avgScore}%</p>
            <p className="text-xs text-blue-200">Promedio general</p>
          </div>
        </div>
      </section>

      {/* Primera Sección */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">📋 Primera Sección</h2>
          <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">130 preguntas</span>
          <span className="text-xs text-slate-400">Igual para todas las carreras</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section1Areas.map((area) => {
            const c = areaColors[area.color] || areaColors.blue;
            return (
              <Link
                key={area.id}
                href={`/areas/${area.id}`}
                className={`flex items-center gap-4 rounded-xl border p-4 no-underline transition-shadow hover:shadow-md ${c.bg} ${c.ring} ring-1`}
              >
                <span className="text-3xl">{area.icon}</span>
                <div>
                  <p className={`font-semibold ${c.text}`}>{area.name}</p>
                  <p className="text-xs text-slate-500">{area.questionCount} preguntas</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Segunda Sección — Ingeniería */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">⚙️ Segunda Sección · Área Ingeniería</h2>
          <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">60 preguntas</span>
          <span className="text-xs text-slate-400">Cálculo, Física y Química</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {section2Areas.map((area) => {
            const c = areaColors[area.color] || areaColors.slate;
            return (
              <Link
                key={area.id}
                href={`/areas/${area.id}`}
                className={`flex items-center gap-4 rounded-xl border p-4 no-underline transition-shadow hover:shadow-md ${c.bg} ${c.ring} ring-1`}
              >
                <span className="text-3xl">{area.icon}</span>
                <div>
                  <p className={`font-semibold ${c.text}`}>{area.name}</p>
                  <p className="text-xs text-slate-500">{area.questionCount} preguntas</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección 3: Refuerzo */}
      {section3Areas.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">🔧 Refuerzo de Fundamentos</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">Extra</span>
            <span className="text-xs text-slate-400">Para fortalecer tu base matemática</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {section3Areas.map((area) => {
              const c = areaColors[area.color] || areaColors.blue;
              return (
                <Link
                  key={area.id}
                  href={`/areas/${area.id}`}
                  className={`flex items-center gap-4 rounded-xl border p-4 no-underline transition-shadow hover:shadow-md ${c.bg} ${c.ring} ring-1`}
                >
                  <span className="text-3xl">{area.icon}</span>
                  <div>
                    <p className={`font-semibold ${c.text}`}>{area.name.replace(/^[^\s]+\s/, "")}</p>
                    <p className="text-xs text-slate-500">{area.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Tips de estudio */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">💡 Tips para tu examen</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "⏰", title: "Administra tu tiempo", desc: "Son 190 preguntas en ~3 horas. Aprox 1 min por pregunta. No te atores." },
            { icon: "📖", title: "Estudia todos los días", desc: "Dedica al menos 30-45 minutos diarios. La constancia es clave." },
            { icon: "🧠", title: "Domina los fundamentos", desc: "Aritmética, álgebra y trigonometría son la base para cálculo y física." },
            { icon: "🎯", title: "Haz simulacros", desc: "El simulacro mezcla las 9 áreas para que practiques la experiencia real." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <p className="font-semibold text-slate-800">{tip.title}</p>
                <p className="text-sm text-slate-500">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/formulas" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white no-underline shadow transition-all hover:bg-blue-700">
            🧠 Ver fórmulas y conceptos clave
          </Link>
        </div>
      </section>
    </div>
  );
}
