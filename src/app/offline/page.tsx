import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl">📡</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">Sin conexión a internet</h1>
      <p className="mt-2 max-w-md text-slate-500">
        PrepUAG funciona sin conexión. Puedes seguir practicando con las preguntas que ya se han cargado. Los resultados se sincronizarán cuando vuelvas a tener internet.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/areas"
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white no-underline shadow transition-all hover:bg-blue-700"
        >
          📋 Ir a Áreas
        </Link>
        <Link
          href="/formulas"
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 no-underline transition-all hover:bg-slate-50"
        >
          🧠 Ver Fórmulas
        </Link>
      </div>
    </div>
  );
}
