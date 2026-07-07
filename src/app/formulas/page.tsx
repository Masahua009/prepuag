import Link from "next/link";

export default function FormulasPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-blue-600 no-underline hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">🧠 Fórmulas y Conceptos Clave</h1>
        <p className="text-sm text-slate-500">
          Repaso rápido de fórmulas esenciales para el examen de Ing. Mecatrónica.
        </p>
      </div>

      {/* Aritmética */}
      <Section title="📏 Aritmética y Quebrados" color="border-cyan-200 bg-cyan-50">
        <FormulaCard title="Operaciones con fracciones">
          <FormulaItem eq="a/b + c/d = (ad + bc) / bd" desc="Suma de fracciones: buscar denominador común" />
          <FormulaItem eq="a/b × c/d = ac / bd" desc="Multiplicación: numerador × numerador, denominador × denominador" />
          <FormulaItem eq="a/b ÷ c/d = a/b × d/c = ad / bc" desc="División: multiplicar por el inverso" />
        </FormulaCard>
        <FormulaCard title="Porcentajes">
          <FormulaItem eq="x% de N = (x/100) × N" desc="Para calcular el porcentaje de una cantidad" />
          <FormulaItem eq="% = (parte / total) × 100" desc="Para encontrar qué porcentaje es una parte del total" />
          <FormulaItem eq="Nuevo = Original × (1 ± %/100)" desc="Aumento (+) o descuento (−) porcentual" />
        </FormulaCard>
        <FormulaCard title="Regla de tres">
          <FormulaItem eq="a → b,  c → x  ⇒  x = (c × b) / a" desc="Proporción directa: si a más le corresponde más" />
          <FormulaItem eq="a → b,  c → x  ⇒  x = (a × b) / c" desc="Proporción inversa: si a más le corresponde menos" />
        </FormulaCard>
      </Section>

      {/* Álgebra */}
      <Section title="✖️ Álgebra Básica" color="border-indigo-200 bg-indigo-50">
        <FormulaCard title="Productos notables">
          <FormulaItem eq="(a + b)² = a² + 2ab + b²" desc="Binomio al cuadrado (suma)" />
          <FormulaItem eq="(a − b)² = a² − 2ab + b²" desc="Binomio al cuadrado (resta)" />
          <FormulaItem eq="(a + b)(a − b) = a² − b²" desc="Diferencia de cuadrados" />
        </FormulaCard>
        <FormulaCard title="Leyes de exponentes">
          <FormulaItem eq="aᵐ × aⁿ = aᵐ⁺ⁿ" desc="Producto: se suman los exponentes" />
          <FormulaItem eq="aᵐ / aⁿ = aᵐ⁻ⁿ" desc="División: se restan los exponentes" />
          <FormulaItem eq="(aᵐ)ⁿ = aᵐⁿ" desc="Potencia de potencia: se multiplican" />
          <FormulaItem eq="a⁰ = 1 (a ≠ 0)" desc="Todo número elevado a cero es 1" />
          <FormulaItem eq="a⁻ⁿ = 1 / aⁿ" desc="Exponente negativo = inverso" />
        </FormulaCard>
        <FormulaCard title="Ecuación cuadrática">
          <FormulaItem eq="ax² + bx + c = 0" desc="Forma general" />
          <FormulaItem eq="x = [−b ± √(b² − 4ac)] / 2a" desc="Fórmula general (discriminante D = b²−4ac)" />
          <FormulaItem eq="Si D > 0: 2 soluciones reales" desc="" />
          <FormulaItem eq="Si D = 0: 1 solución real (raíz doble)" desc="" />
          <FormulaItem eq="Si D < 0: no hay soluciones reales" desc="" />
        </FormulaCard>
      </Section>

      {/* Trigonometría */}
      <Section title="📐 Trigonometría y Geometría Analítica" color="border-rose-200 bg-rose-50">
        <FormulaCard title="Razones trigonométricas (triángulo rectángulo)">
          <FormulaItem eq="sen θ = opuesto / hipotenusa" desc="Seno" />
          <FormulaItem eq="cos θ = adyacente / hipotenusa" desc="Coseno" />
          <FormulaItem eq="tan θ = opuesto / adyacente = sen θ / cos θ" desc="Tangente" />
        </FormulaCard>
        <FormulaCard title="Valores fundamentales">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rose-200 text-left">
                <th className="py-1 pr-2">θ</th><th className="py-1 pr-2">0°</th><th className="py-1 pr-2">30°</th><th className="py-1 pr-2">45°</th><th className="py-1 pr-2">60°</th><th className="py-1">90°</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-rose-100"><td className="py-1 font-medium">sen</td><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr>
              <tr className="border-b border-rose-100"><td className="py-1 font-medium">cos</td><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr>
              <tr><td className="py-1 font-medium">tan</td><td>0</td><td>√3/3</td><td>1</td><td>√3</td><td>∄</td></tr>
            </tbody>
          </table>
        </FormulaCard>
        <FormulaCard title="Identidades fundamentales">
          <FormulaItem eq="sen²θ + cos²θ = 1" desc="Identidad pitagórica fundamental" />
          <FormulaItem eq="tan θ = sen θ / cos θ" desc="" />
          <FormulaItem eq="π rad = 180°" desc="Conversión grados ↔ radianes" />
        </FormulaCard>
        <FormulaCard title="Geometría analítica">
          <FormulaItem eq="d = √[(x₂−x₁)² + (y₂−y₁)²]" desc="Distancia entre dos puntos" />
          <FormulaItem eq="M = ((x₁+x₂)/2, (y₁+y₂)/2)" desc="Punto medio" />
          <FormulaItem eq="m = (y₂−y₁)/(x₂−x₁)" desc="Pendiente de una recta" />
          <FormulaItem eq="y − y₁ = m(x − x₁)" desc="Ecuación punto-pendiente" />
        </FormulaCard>
      </Section>

      {/* Cálculo */}
      <Section title="∫ Cálculo Diferencial e Integral" color="border-slate-200 bg-slate-50">
        <FormulaCard title="Derivadas básicas">
          <FormulaItem eq="d/dx[xⁿ] = nxⁿ⁻¹" desc="Regla de la potencia" />
          <FormulaItem eq="d/dx[sen x] = cos x" desc="" />
          <FormulaItem eq="d/dx[cos x] = −sen x" desc="" />
          <FormulaItem eq="d/dx[tan x] = sec² x" desc="" />
          <FormulaItem eq="d/dx[eˣ] = eˣ" desc="" />
          <FormulaItem eq="d/dx[ln x] = 1/x" desc="" />
        </FormulaCard>
        <FormulaCard title="Reglas de derivación">
          <FormulaItem eq="(f ± g)′ = f′ ± g′" desc="Derivada de suma/resta" />
          <FormulaItem eq="(f·g)′ = f′g + fg′" desc="Regla del producto" />
          <FormulaItem eq="(f/g)′ = (f′g − fg′)/g²" desc="Regla del cociente" />
          <FormulaItem eq="(f(g(x)))′ = f′(g(x))·g′(x)" desc="Regla de la cadena" />
        </FormulaCard>
        <FormulaCard title="Integrales básicas">
          <FormulaItem eq="∫ xⁿ dx = xⁿ⁺¹/(n+1) + C, n≠−1" desc="Regla de la potencia" />
          <FormulaItem eq="∫ sen x dx = −cos x + C" desc="" />
          <FormulaItem eq="∫ cos x dx = sen x + C" desc="" />
          <FormulaItem eq="∫ eˣ dx = eˣ + C" desc="" />
          <FormulaItem eq="∫ 1/x dx = ln|x| + C" desc="" />
          <FormulaItem eq="∫ₐᵇ f(x)dx = F(b) − F(a)" desc="Teorema fundamental del cálculo" />
        </FormulaCard>
        <FormulaCard title="Límites importantes">
          <FormulaItem eq="lim(x→0) sen x / x = 1" desc="Límite trigonométrico fundamental" />
          <FormulaItem eq="lim(x→∞) (1 + 1/x)ˣ = e" desc="Definición del número e" />
        </FormulaCard>
      </Section>

      {/* Física */}
      <Section title="⚡ Física (Mecánica)" color="border-amber-200 bg-amber-50">
        <FormulaCard title="Cinemática">
          <FormulaItem eq="v = v₀ + at" desc="Velocidad final (MRUA)" />
          <FormulaItem eq="d = v₀t + ½at²" desc="Distancia recorrida (MRUA)" />
          <FormulaItem eq="v² = v₀² + 2ad" desc="Velocidad sin tiempo" />
          <FormulaItem eq="v = d/t" desc="Velocidad constante (MRU)" />
        </FormulaCard>
        <FormulaCard title="Dinámica">
          <FormulaItem eq="F = ma" desc="Segunda ley de Newton" />
          <FormulaItem eq="F = G·m₁·m₂/r²" desc="Ley de gravitación universal" />
          <FormulaItem eq="Fc = mv²/r = mω²r" desc="Fuerza centrípeta" />
          <FormulaItem eq="f = μN" desc="Fuerza de fricción (μ = coeficiente)" />
        </FormulaCard>
        <FormulaCard title="Energía y trabajo">
          <FormulaItem eq="W = F·d·cos θ" desc="Trabajo mecánico" />
          <FormulaItem eq="Ec = ½mv²" desc="Energía cinética" />
          <FormulaItem eq="Ep = mgh" desc="Energía potencial gravitatoria" />
          <FormulaItem eq="P = W/t = F·v" desc="Potencia" />
        </FormulaCard>
        <FormulaCard title="Electricidad">
          <FormulaItem eq="V = IR" desc="Ley de Ohm" />
          <FormulaItem eq="P = VI = I²R" desc="Potencia eléctrica" />
          <FormulaItem eq="Req(serie) = R₁ + R₂ + ..." desc="Resistencia en serie" />
          <FormulaItem eq="1/Req(paralelo) = 1/R₁ + 1/R₂ + ..." desc="Resistencia en paralelo" />
        </FormulaCard>
      </Section>

      {/* Química */}
      <Section title="🧪 Química" color="border-pink-200 bg-pink-50">
        <FormulaCard title="Estequiometría">
          <FormulaItem eq="n = m / M" desc="Moles = masa / masa molar" />
          <FormulaItem eq="Molaridad (M) = moles soluto / litros solución" desc="Concentración molar" />
          <FormulaItem eq="n = V / 22.4 L" desc="Moles de gas en CNPT (por cada mol, 22.4 L)" />
        </FormulaCard>
        <FormulaCard title="Ácidos y bases">
          <FormulaItem eq="pH = −log[H⁺]" desc="Definición de pH" />
          <FormulaItem eq="pOH = −log[OH⁻]" desc="" />
          <FormulaItem eq="pH + pOH = 14" desc="A 25°C" />
          <FormulaItem eq="pH &lt; 7: ácido, pH = 7: neutro, pH &gt; 7: básico" desc="" />
        </FormulaCard>
        <FormulaCard title="Gases ideales">
          <FormulaItem eq="PV = nRT" desc="Ley del gas ideal (R=0.082 atm·L/mol·K)" />
          <FormulaItem eq="P₁V₁/T₁ = P₂V₂/T₂" desc="Ley combinada de los gases" />
        </FormulaCard>
        <FormulaCard title="Reacciones redox">
          <FormulaItem eq="Oxidación: pérdida de electrones (agente reductor)" desc="" />
          <FormulaItem eq="Reducción: ganancia de electrones (agente oxidante)" desc="" />
        </FormulaCard>
      </Section>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border p-6 ${color}`}>
      <h2 className="mb-4 text-lg font-bold text-slate-800">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FormulaCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h3 className="mb-2 text-sm font-bold text-slate-700">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FormulaItem({ eq, desc }: { eq: string; desc: string }) {
  return (
    <div>
      <p className="font-mono text-sm font-semibold text-slate-800">{eq}</p>
      {desc && <p className="text-xs text-slate-500">{desc}</p>}
    </div>
  );
}
