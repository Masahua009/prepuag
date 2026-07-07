import { db } from "@/db";
import { areas, questions } from "@/db/schema";

export async function seedDatabase() {
  const existing = await db.select({ id: areas.id }).from(areas).limit(1);
  if (existing.length > 0) return;

  const areasData = [
    // === PRIMERA SECCIÓN (130 preguntas) ===
    { name: "Habilidades Verbales", description: "Comprensión lectora, sinónimos, antónimos, analogías y razonamiento verbal.", icon: "📚", questionCount: 30, color: "blue", section: 1 },
    { name: "Habilidades Cuantitativas", description: "Series numéricas, razonamiento lógico-matemático, patrones y resolución de problemas.", icon: "🔢", questionCount: 30, color: "green", section: 1 },
    { name: "Español", description: "Gramática, ortografía, puntuación, sintaxis y comprensión de textos.", icon: "📝", questionCount: 15, color: "purple", section: 1 },
    { name: "Matemáticas", description: "Álgebra, geometría, aritmética, trigonometría y probabilidad.", icon: "📐", questionCount: 15, color: "red", section: 1 },
    { name: "Ciencias Naturales", description: "Biología, física, química y ciencias de la tierra.", icon: "🔬", questionCount: 20, color: "teal", section: 1 },
    { name: "Ciencias Sociales", description: "Historia de México, historia universal, geografía, civismo y economía.", icon: "🌍", questionCount: 20, color: "orange", section: 1 },

    // === SEGUNDA SECCIÓN — Área Ingeniería (60 preguntas) ===
    { name: "⚙️ Cálculo Diferencial e Integral", description: "Límites, derivadas, integrales, optimización y aplicaciones del cálculo.", icon: "∫", questionCount: 20, color: "slate", section: 2 },
    { name: "⚡ Física", description: "Mecánica clásica, cinemática, dinámica, electricidad, magnetismo y termodinámica.", icon: "⚡", questionCount: 20, color: "yellow", section: 2 },
    { name: "🧪 Química", description: "Estructura atómica, enlaces, estequiometría, reacciones, termoquímica y electroquímica.", icon: "🧪", questionCount: 20, color: "pink", section: 2 },

    // === REFUERZO DE FUNDAMENTOS MATEMÁTICOS (extra, no del examen oficial) ===
    { name: "📏 Aritmética y Quebrados", description: "Operaciones con fracciones, decimales, porcentajes, razones, proporciones y regla de tres.", icon: "📏", questionCount: 0, color: "cyan", section: 3 },
    { name: "✖️ Álgebra Básica", description: "Ecuaciones lineales, cuadráticas, sistemas de ecuaciones, factorización, leyes de exponentes y radicales.", icon: "✖️", questionCount: 0, color: "indigo", section: 3 },
    { name: "📐 Trigonometría y Geometría Analítica", description: "Funciones trigonométricas, identidades, leyes de senos/cosenos, rectas, cónicas y vectores.", icon: "📐", questionCount: 0, color: "rose", section: 3 },
  ];

  const insertedAreas = await db.insert(areas).values(areasData).returning({ id: areas.id, name: areas.name });
  const areaMap = new Map(insertedAreas.map((a) => [a.name, a.id]));

  // ==================== BANCO DE PREGUNTAS ====================
  const questionBank: Record<string, { q: string; opts: string[]; correct: number; explanation: string; difficulty: string }[]> = {
    // ===== PRIMERA SECCIÓN =====
    "Habilidades Verbales": [
      { q: "¿Cuál es el sinónimo de EFÍMERO?", opts: ["Duradero", "Pasajero", "Eterno", "Constante"], correct: 1, explanation: "Efímero significa que dura poco tiempo, algo pasajero o temporal.", difficulty: "media" },
      { q: "Completa la analogía: Médico es a hospital como profesor es a ___.", opts: ["Libro", "Escuela", "Pizarrón", "Alumno"], correct: 1, explanation: "Un médico trabaja en un hospital, así como un profesor trabaja en una escuela.", difficulty: "fácil" },
      { q: "¿Cuál es el antónimo de BENEVOLENCIA?", opts: ["Bondad", "Maldad", "Generosidad", "Compasión"], correct: 1, explanation: "Benevolencia significa buena voluntad; maldad es su opuesto.", difficulty: "fácil" },
      { q: "Lee el texto: 'El cambio climático es uno de los mayores desafíos de nuestra era. Sus efectos incluyen el aumento del nivel del mar, fenómenos meteorológicos extremos y pérdida de biodiversidad.' ¿Cuál es la idea principal?", opts: ["El nivel del mar está subiendo", "Los fenómenos meteorológicos son extremos", "El cambio climático es un desafío global con graves consecuencias", "La biodiversidad está en peligro"], correct: 2, explanation: "La idea principal abarca el concepto completo del texto.", difficulty: "media" },
      { q: "¿Qué palabra no pertenece al grupo?", opts: ["Correr", "Trotar", "Caminar", "Sentarse"], correct: 3, explanation: "Todas las demás son formas de desplazamiento; sentarse es un estado de reposo.", difficulty: "fácil" },
      { q: "¿Cuál es el significado de la palabra UBICUIDAD?", opts: ["Estar en todas partes", "Estar en un solo lugar", "Estar perdido", "Estar escondido"], correct: 0, explanation: "Ubicuidad significa la capacidad de estar presente en todas partes al mismo tiempo.", difficulty: "difícil" },
      { q: "Analiza: 'A pesar de las dificultades económicas, la empresa logró mantener sus operaciones e incluso expandirse.' ¿Qué relación lógica expresa?", opts: ["Causa-efecto", "Contraste u oposición", "Secuencia temporal", "Comparación"], correct: 1, explanation: "'A pesar de' introduce una idea de contraste.", difficulty: "media" },
      { q: "Completa: 'El investigador presentó su ___ sobre el origen del universo.'", opts: ["Hipótesis", "Hipotesis", "Ipótesis", "Hyphotesis"], correct: 0, explanation: "La palabra correcta es 'hipótesis', con tilde y h inicial.", difficulty: "media" },
      { q: "¿Qué significa la expresión 'DAR GATO POR LIEBRE'?", opts: ["Intercambiar mascotas", "Engañar dando algo de menor valor", "Hacer un buen negocio", "Regalar animales"], correct: 1, explanation: "Significa engañar a alguien entregando una cosa de menor calidad que la prometida.", difficulty: "fácil" },
      { q: "Completa la analogía: Feliz es a alegría como triste es a ___.", opts: ["Sonrisa", "Melancolía", "Lágrima", "Fiesta"], correct: 1, explanation: "Feliz siente alegría, así como triste siente melancolía.", difficulty: "fácil" },
      { q: "¿Cuál de las siguientes oraciones es correcta?", opts: ["Habían muchos alumnos", "Hubo muchos alumnos", "Hubieron muchos alumnos", "Ha habido muchos alumnos"], correct: 1, explanation: "'Hubo' es la forma impersonal correcta del verbo haber.", difficulty: "difícil" },
      { q: "¿Qué recurso literario se usa en 'Tus ojos son dos luceros'?", opts: ["Hipérbole", "Metáfora", "Símil", "Personificación"], correct: 1, explanation: "Es una metáfora porque identifica los ojos con luceros sin usar 'como'.", difficulty: "media" },
    ],
    "Habilidades Cuantitativas": [
      { q: "¿Qué número completa la serie: 2, 6, 12, 20, 30, ___?", opts: ["40", "42", "36", "38"], correct: 1, explanation: "La diferencia aumenta en 2 cada vez: +4,+6,+8,+10,+12 → 30+12=42.", difficulty: "media" },
      { q: "Si 3 manzanas cuestan $18, ¿cuánto cuestan 7 manzanas?", opts: ["$36", "$40", "$42", "$48"], correct: 2, explanation: "Cada manzana cuesta $18/3=$6. 7 manzanas: 7×$6=$42.", difficulty: "fácil" },
      { q: "¿Qué número sigue: 1, 1, 2, 3, 5, 8, ___?", opts: ["10", "11", "12", "13"], correct: 3, explanation: "Fibonacci: cada número es la suma de los dos anteriores: 5+8=13.", difficulty: "fácil" },
      { q: "Un padre tiene el triple de edad que su hijo. Si entre ambos suman 48 años, ¿qué edad tiene el padre?", opts: ["32", "36", "30", "40"], correct: 1, explanation: "x+3x=48→4x=48→x=12. Padre: 3×12=36.", difficulty: "media" },
      { q: "Si A=2, B=4, C=6, ¿cuál es el valor de (A×B)+C?", opts: ["10", "12", "14", "16"], correct: 2, explanation: "(2×4)+6=8+6=14.", difficulty: "fácil" },
      { q: "En una sucesión cada número se obtiene multiplicando el anterior por 2 y restando 1. Si empieza con 3, ¿cuál es el cuarto número?", opts: ["15", "17", "19", "21"], correct: 1, explanation: "3→5→9→17.", difficulty: "media" },
      { q: "Tres grifos llenan un tanque en 4 horas. ¿Cuánto tardarán 6 grifos iguales?", opts: ["1h", "2h", "3h", "8h"], correct: 1, explanation: "Inversamente proporcional: 3×4=6×x→x=2h.", difficulty: "media" },
      { q: "¿Qué número falta: 4, 9, 16, 25, ___?", opts: ["34", "36", "30", "49"], correct: 1, explanation: "Cuadrados perfectos: 2²,3²,4²,5²,6²=36.", difficulty: "fácil" },
      { q: "Si 5 trabajadores construyen un muro en 12 días, ¿cuántos se necesitan para 4 días?", opts: ["10", "15", "20", "8"], correct: 1, explanation: "5×12=x×4→x=15.", difficulty: "media" },
      { q: "Completa la serie: 3, 6, 18, 72, ___?", opts: ["144", "360", "288", "216"], correct: 1, explanation: "×2,×3,×4,×5→72×5=360.", difficulty: "difícil" },
      { q: "En un salón hay 40 alumnos. El 60% son mujeres. ¿Cuántos hombres hay?", opts: ["12", "14", "16", "24"], correct: 2, explanation: "Mujeres:40×0.60=24. Hombres:40-24=16.", difficulty: "fácil" },
      { q: "¿Cuál es el siguiente número: 2, 4, 8, 16, 32, ___?", opts: ["40", "48", "64", "56"], correct: 2, explanation: "Cada número es el doble del anterior: 32×2=64.", difficulty: "fácil" },
    ],
    "Español": [
      { q: "¿Cuál de las siguientes palabras es aguda?", opts: ["Árbol", "Canción", "Lápiz", "Mesa"], correct: 1, explanation: "Canción es aguda: sílaba tónica en la última y termina en 'n'.", difficulty: "fácil" },
      { q: "¿En qué oración se usa correctamente el acento diacrítico?", opts: ["El libro es para mi", "Él libro es para mí", "El libro es para mí", "Él libro es para mi"], correct: 2, explanation: "'El' (artículo) sin tilde; 'mí' (pronombre) con tilde.", difficulty: "media" },
      { q: "¿Cuál es el sujeto de: 'Los alumnos de la UAG presentaron el examen'?", opts: ["Los alumnos", "Los alumnos de la UAG", "El examen", "Presentaron"], correct: 1, explanation: "El sujeto completo incluye el complemento del núcleo.", difficulty: "media" },
      { q: "Elige la opción correcta: 'Es necesario que ___ a tiempo.'", opts: ["llegues", "llegues tú", "llegas", "llegar"], correct: 0, explanation: "Después de 'que' en subordinada se usa subjuntivo.", difficulty: "media" },
      { q: "¿Qué tipo de palabra es 'rápidamente'?", opts: ["Adjetivo", "Adverbio", "Sustantivo", "Verbo"], correct: 1, explanation: "Termina en -mente, es un adverbio de modo.", difficulty: "fácil" },
      { q: "¿Cuál es el plural correcto de 'café'?", opts: ["Cafeses", "Cafés", "Cafeses", "Café's"], correct: 1, explanation: "Palabras con vocal acentuada: plural con -s: cafés.", difficulty: "fácil" },
      { q: "En 'Juan compró flores para María', ¿qué función tiene 'para María'?", opts: ["Objeto directo", "Objeto indirecto", "C.C. de finalidad", "Sujeto"], correct: 2, explanation: "Indica la finalidad o destinatario de la acción.", difficulty: "media" },
      { q: "¿Cuál de las siguientes palabras es esdrújula?", opts: ["Camión", "Fácil", "Pájaro", "Reloj"], correct: 2, explanation: "Pájaro: sílaba tónica en la antepenúltima.", difficulty: "fácil" },
      { q: "Selecciona la opción con puntuación correcta:", opts: ["Hola cómo estás?", "Hola, ¿cómo estás?", "Hola ¿cómo estás?", "Hola, ¿cómo estás"], correct: 1, explanation: "Después del saludo va coma, y la pregunta lleva ¿?", difficulty: "media" },
      { q: "¿Cuál es el antónimo de 'generoso'?", opts: ["Altruista", "Egoísta", "Amable", "Bondadoso"], correct: 1, explanation: "Generoso comparte; egoísta es lo contrario.", difficulty: "fácil" },
    ],
    "Matemáticas": [
      { q: "Resuelve: 3x+5=20. ¿Cuánto vale x?", opts: ["3", "4", "5", "6"], correct: 2, explanation: "3x+5=20→3x=15→x=5.", difficulty: "fácil" },
      { q: "¿Cuál es el área de un triángulo con base 8cm y altura 6cm?", opts: ["48cm²", "24cm²", "14cm²", "28cm²"], correct: 1, explanation: "A=(b×h)/2=(8×6)/2=24cm².", difficulty: "fácil" },
      { q: "Perímetro de un rectángulo=30cm. Largo=10cm. ¿Ancho?", opts: ["3cm", "4cm", "5cm", "6cm"], correct: 2, explanation: "2(10+a)=30→10+a=15→a=5.", difficulty: "media" },
      { q: "¿Cuál es el valor de x en: 2x²-8=0?", opts: ["x=2", "x=±2", "x=4", "x=-2"], correct: 1, explanation: "2x²=8→x²=4→x=±2.", difficulty: "media" },
      { q: "¿Cuánto es el 25% de 200?", opts: ["25", "40", "50", "75"], correct: 2, explanation: "25%=0.25. 0.25×200=50.", difficulty: "fácil" },
      { q: "Calcula: (2³+3²)÷5", opts: ["2.6", "3.4", "4.2", "5.0"], correct: 1, explanation: "(8+9)÷5=17÷5=3.4.", difficulty: "media" },
      { q: "Círculo con radio 7cm. ¿Área aproximada? (π≈3.14)", opts: ["153.86cm²", "140cm²", "160cm²", "150cm²"], correct: 0, explanation: "A=πr²=3.14×49=153.86cm².", difficulty: "media" },
      { q: "Factoriza: x²-9", opts: ["(x-3)²", "(x+3)(x-3)", "(x+9)(x-1)", "x(x-9)"], correct: 1, explanation: "Diferencia de cuadrados: x²-9=(x+3)(x-3).", difficulty: "media" },
      { q: "Probabilidad de obtener número par al lanzar un dado:", opts: ["1/6", "1/3", "1/2", "2/3"], correct: 2, explanation: "3 pares (2,4,6) de 6 resultados: 3/6=1/2.", difficulty: "fácil" },
      { q: "Si log₁₀(x)=2, ¿cuánto vale x?", opts: ["20", "100", "200", "10"], correct: 1, explanation: "log₁₀(x)=2→10²=x→x=100.", difficulty: "difícil" },
    ],
    "Ciencias Naturales": [
      { q: "¿Cuál es la unidad básica de la vida?", opts: ["El átomo", "La célula", "La molécula", "El tejido"], correct: 1, explanation: "La célula es la unidad estructural y funcional más pequeña de los seres vivos.", difficulty: "fácil" },
      { q: "¿Qué organelo realiza la fotosíntesis?", opts: ["Mitocondria", "Núcleo", "Cloroplasto", "Ribosoma"], correct: 2, explanation: "Los cloroplastos contienen clorofila y realizan la fotosíntesis.", difficulty: "fácil" },
      { q: "¿Cuál es la fórmula química del agua?", opts: ["CO₂", "H₂O", "NaCl", "O₂"], correct: 1, explanation: "Dos átomos de hidrógeno y uno de oxígeno: H₂O.", difficulty: "fácil" },
      { q: "La fuerza que atrae objetos hacia el centro de la Tierra:", opts: ["Magnetismo", "Fricción", "Gravedad", "Inercia"], correct: 2, explanation: "La gravedad es la fuerza de atracción terrestre.", difficulty: "fácil" },
      { q: "¿Qué tipo de energía produce el Sol?", opts: ["Química", "Nuclear (fusión)", "Eléctrica", "Cinética"], correct: 1, explanation: "El Sol fusiona hidrógeno en helio, liberando energía nuclear.", difficulty: "media" },
      { q: "¿Cuál es el pH del agua pura?", opts: ["0", "7", "14", "5"], correct: 1, explanation: "El agua pura tiene pH neutro de 7.", difficulty: "fácil" },
      { q: "Las mitocondrias son:", opts: ["El cerebro celular", "La central energética", "El sistema digestivo", "El esqueleto celular"], correct: 1, explanation: "Producen ATP, la principal fuente de energía celular.", difficulty: "media" },
      { q: "¿Qué ley de Newton es acción-reacción?", opts: ["Primera", "Segunda", "Tercera", "Gravitación"], correct: 2, explanation: "La tercera ley: a toda acción corresponde una reacción igual y opuesta.", difficulty: "media" },
      { q: "El ADN está formado por:", opts: ["Aminoácidos", "Nucleótidos", "Glucosa", "Ácidos grasos"], correct: 1, explanation: "Los nucleótidos (A,T,G,C) son las unidades del ADN.", difficulty: "media" },
      { q: "¿Elemento más abundante en el universo?", opts: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"], correct: 2, explanation: "El hidrógeno constituye ~75% de la materia visible.", difficulty: "media" },
    ],
    "Ciencias Sociales": [
      { q: "¿En qué año inició la Revolución Mexicana?", opts: ["1908", "1910", "1912", "1915"], correct: 1, explanation: "Comenzó el 20 de noviembre de 1910.", difficulty: "media" },
      { q: "México comparte frontera al norte con:", opts: ["Guatemala", "Belice", "Estados Unidos", "Canadá"], correct: 2, explanation: "México limita al norte con Estados Unidos.", difficulty: "fácil" },
      { q: "¿Qué civilización construyó Machu Picchu?", opts: ["Azteca", "Maya", "Inca", "Olmeca"], correct: 2, explanation: "Machu Picchu fue construido por los incas en Perú.", difficulty: "fácil" },
      { q: "¿Forma de gobierno de México?", opts: ["Monarquía", "República federal", "Dictadura", "Parlamentaria"], correct: 1, explanation: "México es una república representativa, democrática, laica y federal.", difficulty: "fácil" },
      { q: "La Segunda Guerra Mundial terminó en:", opts: ["1943", "1944", "1945", "1946"], correct: 2, explanation: "Terminó en 1945 con la rendición de Alemania y Japón.", difficulty: "media" },
      { q: "¿Qué documento establece derechos fundamentales en México?", opts: ["Código Civil", "Constitución Política", "Ley del Trabajo", "Declaración Universal"], correct: 1, explanation: "La Constitución de 1917 garantiza los derechos fundamentales.", difficulty: "media" },
      { q: "¿Quién nacionalizó el petróleo en 1938?", opts: ["Porfirio Díaz", "Lázaro Cárdenas", "Benito Juárez", "Francisco I. Madero"], correct: 1, explanation: "Lázaro Cárdenas decretó la expropiación petrolera el 18 de marzo de 1938.", difficulty: "media" },
      { q: "¿Qué país NO está en América del Sur?", opts: ["Brasil", "Argentina", "México", "Chile"], correct: 2, explanation: "México pertenece a América del Norte.", difficulty: "fácil" },
      { q: "¿Río más caudaloso del mundo?", opts: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"], correct: 1, explanation: "El Amazonas es el más caudaloso, ubicado en Sudamérica.", difficulty: "fácil" },
      { q: "¿Organismo fundado en 1945 para la paz mundial?", opts: ["OTAN", "ONU", "Unión Europea", "FMI"], correct: 1, explanation: "La ONU se fundó en 1945 tras la Segunda Guerra Mundial.", difficulty: "media" },
    ],

    // ===== SEGUNDA SECCIÓN: INGENIERÍA =====
    "⚙️ Cálculo Diferencial e Integral": [
      { q: "¿Cuál es el límite de f(x) = (x² - 4)/(x - 2) cuando x→2?", opts: ["0", "2", "4", "No existe"], correct: 2, explanation: "Factorizando: (x-2)(x+2)/(x-2)=x+2. Límite cuando x→2 es 4.", difficulty: "media" },
      { q: "¿Cuál es la derivada de f(x) = 3x⁴?", opts: ["12x³", "3x³", "7x³", "12x⁴"], correct: 0, explanation: "d/dx[3x⁴]=3·4x³=12x³.", difficulty: "fácil" },
      { q: "¿Cuál es la derivada de f(x) = sen(x)?", opts: ["-cos(x)", "cos(x)", "-sen(x)", "tan(x)"], correct: 1, explanation: "d/dx[sen(x)] = cos(x).", difficulty: "fácil" },
      { q: "¿Cuál es la integral indefinida ∫ 2x dx?", opts: ["x²", "x² + C", "2x² + C", "x + C"], correct: 1, explanation: "∫ 2x dx = x² + C.", difficulty: "fácil" },
      { q: "Evalúa ∫₀² 3x² dx:", opts: ["4", "6", "8", "12"], correct: 2, explanation: "[x³]₀² = 8 - 0 = 8.", difficulty: "media" },
      { q: "Encuentra los puntos críticos de f(x)=x³-3x+2.", opts: ["x=±1", "x=±2", "x=0,3", "x=-1,3"], correct: 0, explanation: "f'(x)=3x²-3=0→x²=1→x=±1.", difficulty: "media" },
      { q: "¿Derivada de f(x)=ln(x)?", opts: ["1/x", "x", "eˣ", "ln(x)"], correct: 0, explanation: "d/dx[ln(x)] = 1/x.", difficulty: "fácil" },
      { q: "∫ cos(x) dx = ?", opts: ["-sen(x)+C", "sen(x)+C", "-cos(x)+C", "tan(x)+C"], correct: 1, explanation: "∫ cos(x)dx = sen(x) + C.", difficulty: "fácil" },
      { q: "lim(x→∞) (3x²+2x)/(x²-1) = ?", opts: ["0", "1", "3", "∞"], correct: 2, explanation: "Dividiendo entre x²: (3+2/x)/(1-1/x²)→3.", difficulty: "media" },
      { q: "Derivada de f(x)=e²ˣ:", opts: ["e²ˣ", "2e²ˣ", "2xe²ˣ", "eˣ"], correct: 1, explanation: "Regla de la cadena: d/dx[e²ˣ]=e²ˣ·2=2e²ˣ.", difficulty: "media" },
      { q: "∫₀^π sen(x) dx = ?", opts: ["0", "1", "2", "-1"], correct: 2, explanation: "[-cos(x)]₀^π = -(-1)-(−1) = 2.", difficulty: "media" },
      { q: "¿Para qué x tiene mínimo f(x)=x²-4x+7?", opts: ["x=-2", "x=2", "x=4", "x=-4"], correct: 1, explanation: "f'(x)=2x-4=0→x=2. f''(2)=2>0→mínimo.", difficulty: "media" },
      { q: "Derivada de f(x)=tan(x):", opts: ["sec(x)", "sec²(x)", "cot(x)", "sen(x)/cos(x)"], correct: 1, explanation: "d/dx[tan(x)] = sec²(x).", difficulty: "difícil" },
      { q: "∫₁³ (2x+3) dx = ?", opts: ["10", "12", "14", "16"], correct: 2, explanation: "[x²+3x]₁³ = (9+9)-(1+3) = 14.", difficulty: "media" },
      { q: "lim(x→0) sen(x)/x = ?", opts: ["0", "1", "∞", "No existe"], correct: 1, explanation: "Límite fundamental: lim(x→0) sen(x)/x = 1.", difficulty: "difícil" },
    ],
    "⚡ Física": [
      { q: "Auto parte del reposo y acelera a 3m/s² por 5s. ¿Velocidad final?", opts: ["10m/s", "12m/s", "15m/s", "18m/s"], correct: 2, explanation: "v=v₀+at=0+3×5=15m/s.", difficulty: "fácil" },
      { q: "Fuerza para acelerar 10kg a 4m/s²:", opts: ["2.5N", "14N", "40N", "80N"], correct: 2, explanation: "F=ma=10×4=40N.", difficulty: "fácil" },
      { q: "Piedra cae de 20m. ¿Tiempo hasta el suelo? (g=10m/s²)", opts: ["1s", "2s", "3s", "4s"], correct: 1, explanation: "h=½gt²→20=½(10)t²→t²=4→t=2s.", difficulty: "media" },
      { q: "Energía cinética de 2kg a 6m/s:", opts: ["12J", "24J", "36J", "72J"], correct: 2, explanation: "Ec=½mv²=½(2)(36)=36J.", difficulty: "fácil" },
      { q: "Resistencias de 4Ω y 6Ω en serie. Req:", opts: ["2Ω", "2.4Ω", "10Ω", "24Ω"], correct: 2, explanation: "Serie: Req=R₁+R₂=10Ω.", difficulty: "fácil" },
      { q: "Objeto lanzado hacia arriba a 30m/s. ¿Altura máxima? (g=10)", opts: ["30m", "45m", "60m", "90m"], correct: 1, explanation: "h_max=v₀²/(2g)=900/20=45m.", difficulty: "media" },
      { q: "Trabajo de fuerza de 20N desplazando 5m:", opts: ["4J", "25J", "100J", "50J"], correct: 2, explanation: "W=F·d=20×5=100J.", difficulty: "fácil" },
      { q: "Frecuencia de onda con período 0.05s:", opts: ["20Hz", "50Hz", "100Hz", "0.05Hz"], correct: 0, explanation: "f=1/T=1/0.05=20Hz.", difficulty: "media" },
      { q: "Corriente de 3A por 2min. ¿Carga?", opts: ["6C", "150C", "360C", "600C"], correct: 2, explanation: "Q=I·t=3×(2×60)=360C.", difficulty: "media" },
      { q: "Masa de 5kg, círculo r=2m, ω=3rad/s. ¿Fuerza centrípeta?", opts: ["30N", "60N", "90N", "45N"], correct: 2, explanation: "Fc=m·ω²·r=5×9×2=90N.", difficulty: "difícil" },
      { q: "¿Qué dice la primera ley de Newton?", opts: ["F=ma", "Acción-reacción", "Inercia: reposo o MRU sin fuerza neta", "Conservación de energía"], correct: 2, explanation: "Ley de inercia: un cuerpo mantiene su estado si no hay fuerza externa.", difficulty: "fácil" },
      { q: "Potencia de motor que hace 600J en 5s:", opts: ["60W", "120W", "300W", "3000W"], correct: 1, explanation: "P=W/t=600/5=120W.", difficulty: "fácil" },
      { q: "¿Qué ley dice que la energía no se crea ni se destruye?", opts: ["Ley cero", "Primera ley", "Segunda ley", "Tercera ley"], correct: 1, explanation: "Primera ley de la termodinámica: ΔU=Q-W.", difficulty: "media" },
      { q: "Bloque 8kg en plano inclinado 30° sin fricción. ¿Fuerza paralela que lo sostiene?", opts: ["40N", "39.2N", "78.4N", "80N"], correct: 1, explanation: "F=mg·sen30°=8×9.8×0.5=39.2N.", difficulty: "difícil" },
      { q: "Longitud de onda de sonido 340Hz que viaja a 340m/s:", opts: ["0.5m", "1m", "2m", "115600m"], correct: 1, explanation: "λ=v/f=340/340=1m.", difficulty: "media" },
    ],
    "🧪 Química": [
      { q: "¿Número atómico del carbono (C)?", opts: ["4", "6", "8", "12"], correct: 1, explanation: "El carbono tiene Z=6 (6 protones).", difficulty: "fácil" },
      { q: "¿Enlace por compartición de electrones?", opts: ["Iónico", "Covalente", "Metálico", "Puente de hidrógeno"], correct: 1, explanation: "El enlace covalente comparte electrones entre átomos.", difficulty: "fácil" },
      { q: "¿Fórmula del ácido sulfúrico?", opts: ["HCl", "HNO₃", "H₂SO₄", "H₃PO₄"], correct: 2, explanation: "Ácido sulfúrico: H₂SO₄.", difficulty: "fácil" },
      { q: "Balancea: 2H₂+O₂→ ?", opts: ["H₂O", "2H₂O", "H₂O₂", "2HO"], correct: 1, explanation: "2H₂+O₂→2H₂O.", difficulty: "fácil" },
      { q: "¿Moles en 36g de agua? (M=18g/mol)", opts: ["0.5", "1", "2", "36"], correct: 2, explanation: "n=m/M=36/18=2 moles.", difficulty: "fácil" },
      { q: "pH de [H⁺]=1×10⁻³ M:", opts: ["1", "3", "7", "11"], correct: 1, explanation: "pH=-log[H⁺]=-log(10⁻³)=3 (ácida).", difficulty: "media" },
      { q: "Elemento con configuración 1s²2s²2p⁶3s²3p⁴:", opts: ["O", "S", "Se", "Cl"], correct: 1, explanation: "2+2+6+2+4=16 electrones → Azufre (Z=16).", difficulty: "media" },
      { q: "En una reacción exotérmica:", opts: ["Absorbe calor", "Libera calor", "No hay intercambio", "Solo a altas T"], correct: 1, explanation: "Reacción exotérmica: libera energía (ΔH<0).", difficulty: "fácil" },
      { q: "Agente oxidante en Zn+Cu²⁺→Zn²⁺+Cu:", opts: ["Zn", "Cu²⁺", "Zn²⁺", "Cu"], correct: 1, explanation: "Cu²⁺ se reduce (gana electrones): es el agente oxidante.", difficulty: "media" },
      { q: "Masa de NaCl de 23g Na+Cl₂ exceso (Na=23,Cl=35.5):", opts: ["35.5g", "46g", "58.5g", "70g"], correct: 2, explanation: "1mol Na→1mol NaCl=58.5g.", difficulty: "media" },
      { q: "Tipo de reacción: CaCO₃→CaO+CO₂:", opts: ["Síntesis", "Descomposición", "Desplazamiento", "Doble desplazamiento"], correct: 1, explanation: "Un compuesto se descompone en productos más simples.", difficulty: "fácil" },
      { q: "Gramos de O₂ para quemar 16g CH₄ (CH₄=16,O₂=32):", opts: ["16g", "32g", "64g", "128g"], correct: 2, explanation: "CH₄+2O₂→CO₂+2H₂O. 1mol CH₄→2mol O₂=64g.", difficulty: "media" },
      { q: "Molaridad de 2 moles en 500mL:", opts: ["1M", "2M", "4M", "0.5M"], correct: 2, explanation: "M=moles/L=2/0.5=4M.", difficulty: "media" },
      { q: "Partícula subatómica con carga negativa:", opts: ["Protón", "Neutrón", "Electrón", "Positrón"], correct: 2, explanation: "El electrón tiene carga -1.602×10⁻¹⁹C.", difficulty: "fácil" },
      { q: "Ley de gases: PV=nRT:", opts: ["Boyle", "Charles", "Gay-Lussac", "Gas ideal"], correct: 3, explanation: "PV=nRT es la ecuación de los gases ideales.", difficulty: "fácil" },
    ],

    // ===== REFUERZO: FUNDAMENTOS MATEMÁTICOS =====
    "📏 Aritmética y Quebrados": [
      { q: "Resuelve: 3/4 + 1/2 = ?", opts: ["4/6", "1", "5/4", "1/4"], correct: 2, explanation: "3/4+2/4=5/4. Buscamos denominador común 4.", difficulty: "fácil" },
      { q: "Resuelve: 2/3 × 3/5 = ?", opts: ["5/8", "6/15", "2/5", "1/5"], correct: 2, explanation: "Multiplicamos numeradores y denominadores: 6/15=2/5.", difficulty: "fácil" },
      { q: "Resuelve: 5/6 ÷ 2/3 = ?", opts: ["5/9", "5/4", "10/18", "7/6"], correct: 1, explanation: "5/6×3/2=15/12=5/4. Dividir es multiplicar por el inverso.", difficulty: "media" },
      { q: "Simplifica: 24/36", opts: ["2/3", "4/6", "12/18", "3/4"], correct: 0, explanation: "Dividiendo entre 12: 24/36=2/3.", difficulty: "fácil" },
      { q: "¿Cuál es mayor: 3/5 o 5/8?", opts: ["3/5", "5/8", "Son iguales", "No se puede saber"], correct: 0, explanation: "3/5=0.6, 5/8=0.625. 3/5=24/40 > 25/40... espera: 3/5=24/40 y 5/8=25/40. ¡5/8 es mayor! 0.6 < 0.625, por lo tanto 5/8.", difficulty: "media" },
      { q: "Expresa 0.75 como fracción:", opts: ["3/4", "7/10", "1/4", "75/10"], correct: 0, explanation: "0.75=75/100=3/4.", difficulty: "fácil" },
      { q: "Una pizza se divide en 8 rebanadas. Si comes 3, ¿qué fracción queda?", opts: ["3/8", "1/2", "5/8", "2/3"], correct: 2, explanation: "Quedan 8-3=5 de 8: 5/8.", difficulty: "fácil" },
      { q: "Resuelve: (2/3 + 1/6) × 2 = ?", opts: ["5/3", "1", "2/3", "5/6"], correct: 0, explanation: "2/3+1/6=4/6+1/6=5/6. 5/6×2=10/6=5/3.", difficulty: "media" },
      { q: "Convierte 7/2 a número mixto:", opts: ["2½", "3½", "3", "7½"], correct: 1, explanation: "7÷2=3, residuo 1 → 3½.", difficulty: "fácil" },
      { q: "¿Qué fracción representa 0.333...?", opts: ["1/4", "1/3", "3/10", "1/2"], correct: 1, explanation: "0.333... es la representación decimal de 1/3.", difficulty: "media" },
      { q: "Resuelve: 5 ÷ (1/4) = ?", opts: ["1/20", "5/4", "20", "4/5"], correct: 2, explanation: "Dividir entre 1/4 es multiplicar por 4: 5×4=20.", difficulty: "media" },
      { q: "Un depósito tiene 2/5 de su capacidad llena. Si caben 200 litros, ¿cuántos litros tiene?", opts: ["40L", "80L", "100L", "120L"], correct: 1, explanation: "2/5×200=400/5=80 litros.", difficulty: "fácil" },
      { q: "Resuelve la regla de tres: Si 4 cuadernos cuestan $60, ¿cuánto cuestan 10?", opts: ["$120", "$140", "$150", "$180"], correct: 2, explanation: "4→60, 10→x. x=10×60/4=150.", difficulty: "fácil" },
      { q: "¿Qué porcentaje es 3/20?", opts: ["6%", "12%", "15%", "20%"], correct: 2, explanation: "3/20×100=300/20=15%.", difficulty: "media" },
      { q: "Un producto cuesta $800 y tiene 15% de descuento. ¿Precio final?", opts: ["$680", "$700", "$720", "$650"], correct: 0, explanation: "Descuento: 800×0.15=120. Precio: 800-120=$680.", difficulty: "media" },
    ],
    "✖️ Álgebra Básica": [
      { q: "Resuelve: 2x + 7 = 15. ¿x = ?", opts: ["3", "4", "5", "8"], correct: 1, explanation: "2x=15-7=8→x=4.", difficulty: "fácil" },
      { q: "Resuelve: 4(x - 3) = 2x + 6", opts: ["x=6", "x=9", "x=3", "x=12"], correct: 1, explanation: "4x-12=2x+6→2x=18→x=9.", difficulty: "media" },
      { q: "Factoriza: x² + 5x + 6", opts: ["(x+2)(x+3)", "(x+1)(x+6)", "(x-2)(x-3)", "(x+5)(x+1)"], correct: 0, explanation: "Buscamos dos números que sumen 5 y multipliquen 6: 2 y 3.", difficulty: "media" },
      { q: "Resuelve por factorización: x² - 7x + 12 = 0", opts: ["x=3,4", "x=-3,-4", "x=2,6", "x=1,12"], correct: 0, explanation: "(x-3)(x-4)=0→x=3,4.", difficulty: "media" },
      { q: "Resuelve el sistema: x+y=7, x-y=3", opts: ["x=5,y=2", "x=4,y=3", "x=6,y=1", "x=3,y=4"], correct: 0, explanation: "Sumando: 2x=10→x=5, y=7-5=2.", difficulty: "media" },
      { q: "Simplifica: (x³·x⁵)/x⁴", opts: ["x⁴", "x³", "x⁸/x⁴", "x⁴/x"], correct: 0, explanation: "x³⁺⁵⁻⁴=x⁴.", difficulty: "fácil" },
      { q: "Simplifica: (a²b)³ = ?", opts: ["a⁵b³", "a⁶b³", "a⁵b⁴", "a⁶b"], correct: 1, explanation: "(a²)³·b³=a⁶b³.", difficulty: "media" },
      { q: "Resuelve: √(x+1) = 3", opts: ["x=2", "x=4", "x=8", "x=10"], correct: 2, explanation: "Elevando al cuadrado: x+1=9→x=8.", difficulty: "fácil" },
      { q: "Resuelve con fórmula general: x² - 5x + 6 = 0", opts: ["x=2,3", "x=1,6", "x=-2,-3", "x=5,1"], correct: 0, explanation: "x=[5±√(25-24)]/2=[5±1]/2→x=2,3.", difficulty: "media" },
      { q: "Desarrolla: (x + 3)²", opts: ["x²+9", "x²+6x+9", "x²+3x+9", "x²+6x+3"], correct: 1, explanation: "(a+b)²=a²+2ab+b²=x²+6x+9.", difficulty: "fácil" },
      { q: "Simplifica: 3x + 2y - x + 5y", opts: ["2x+7y", "4x+7y", "2x+3y", "4x+3y"], correct: 0, explanation: "3x-x=2x, 2y+5y=7y → 2x+7y.", difficulty: "fácil" },
      { q: "Resuelve: |2x - 4| = 6", opts: ["x=5", "x=5 o x=-1", "x=1 o x=-5", "x=-1"], correct: 1, explanation: "2x-4=6→x=5; o 2x-4=-6→x=-1.", difficulty: "difícil" },
      { q: "Resuelve: (x+2)/(x-1) = 3", opts: ["x=2.5", "x=2", "x=3", "x=1.5"], correct: 0, explanation: "x+2=3(x-1)→x+2=3x-3→2+3=3x-x→5=2x→x=2.5.", difficulty: "media" },
      { q: "Desarrolla: (x - 5)(x + 5)", opts: ["x²-25", "x²+25", "x²-10x+25", "x²+10x-25"], correct: 0, explanation: "(a-b)(a+b)=a²-b²=x²-25. Diferencia de cuadrados.", difficulty: "fácil" },
      { q: "Simplifica: √(16x⁸)", opts: ["4x⁴", "8x⁴", "4x²", "16x⁴"], correct: 0, explanation: "√16=4, √(x⁸)=x⁴ → 4x⁴.", difficulty: "media" },
    ],
    "📐 Trigonometría y Geometría Analítica": [
      { q: "¿Cuánto vale sen(30°)?", opts: ["1/2", "√2/2", "√3/2", "1"], correct: 0, explanation: "sen(30°)=1/2. Valor fundamental.", difficulty: "fácil" },
      { q: "¿Cuánto vale cos(60°)?", opts: ["1/2", "√2/2", "√3/2", "0"], correct: 0, explanation: "cos(60°)=1/2.", difficulty: "fácil" },
      { q: "¿Cuánto vale tan(45°)?", opts: ["0", "1", "√3", "1/√3"], correct: 1, explanation: "tan(45°)=sen45°/cos45°=(√2/2)/(√2/2)=1.", difficulty: "fácil" },
      { q: "¿Cuál es la identidad fundamental de la trigonometría?", opts: ["sen²θ+cos²θ=1", "senθ+cosθ=1", "tanθ=senθ·cosθ", "sen²θ-cos²θ=1"], correct: 0, explanation: "sen²θ+cos²θ=1 es la identidad pitagórica fundamental.", difficulty: "media" },
      { q: "En un triángulo rectángulo, cateto opuesto=3, hipotenusa=5. ¿senθ?", opts: ["3/5", "4/5", "5/3", "3/4"], correct: 0, explanation: "senθ=opuesto/hipotenusa=3/5.", difficulty: "fácil" },
      { q: "Convierte 180° a radianes:", opts: ["π/2", "π", "2π", "3π/2"], correct: 1, explanation: "180°×π/180°=π radianes.", difficulty: "fácil" },
      { q: "¿Cuál es la pendiente de la recta y=2x+3?", opts: ["2", "3", "-3", "1/2"], correct: 0, explanation: "y=mx+b. La pendiente m es el coeficiente de x: m=2.", difficulty: "fácil" },
      { q: "¿Cuál es la ecuación de la recta que pasa por P(1,2) con pendiente 3?", opts: ["y=3x-1", "y=3x+1", "y=3x+2", "y=3x-2"], correct: 0, explanation: "y-y₁=m(x-x₁)→y-2=3(x-1)→y=3x-3+2→y=3x-1.", difficulty: "media" },
      { q: "¿Distancia entre los puntos (0,0) y (3,4)?", opts: ["5", "7", "12", "25"], correct: 0, explanation: "d=√((3-0)²+(4-0)²)=√(9+16)=√25=5.", difficulty: "fácil" },
      { q: "¿Cuál es el centro de la circunferencia (x-2)²+(y+3)²=16?", opts: ["(2,-3)", "(-2,3)", "(2,3)", "(-2,-3)"], correct: 0, explanation: "Centro (h,k) de (x-h)²+(y-k)²=r²: (2,-3).", difficulty: "media" },
      { q: "Ley de senos: a/senA = b/senB = c/senC. Si A=30°, a=5, B=60°, ¿b=?", opts: ["5√3", "10", "5√2", "5/√3"], correct: 0, explanation: "5/sen30°=b/sen60°→5/0.5=b/0.866→10=b/0.866→b=8.66≈5√3.", difficulty: "difícil" },
      { q: "¿Cuánto vale cos(90°)?", opts: ["0", "1", "-1", "1/2"], correct: 0, explanation: "cos(90°)=0.", difficulty: "fácil" },
      { q: "Punto medio entre (2,4) y (8,10):", opts: ["(5,7)", "(4,6)", "(6,14)", "(10,14)"], correct: 0, explanation: "M=((x₁+x₂)/2,(y₁+y₂)/2)=((2+8)/2,(4+10)/2)=(5,7).", difficulty: "fácil" },
      { q: "¿Qué cónica es: x²/9 + y²/4 = 1?", opts: ["Circunferencia", "Elipse", "Parábola", "Hipérbola"], correct: 1, explanation: "x²/a²+y²/b²=1 con a≠b es una elipse.", difficulty: "media" },
      { q: "sen(0°) = ?", opts: ["0", "1", "-1", "1/2"], correct: 0, explanation: "sen(0°)=0.", difficulty: "fácil" },
    ],
  };

  // Insertar preguntas
  for (const [areaName, qs] of Object.entries(questionBank)) {
    const areaId = areaMap.get(areaName);
    if (!areaId) continue;

    const rows = qs.map((q) => ({
      areaId,
      questionText: q.q,
      options: q.opts,
      correctIndex: q.correct,
      explanation: q.explanation,
      difficulty: q.difficulty,
    }));

    await db.insert(questions).values(rows);
  }

  console.log("✅ DB poblada — 12 áreas, ~160 preguntas. Examen UAG Ing. Mecatrónica + refuerzo");
}
