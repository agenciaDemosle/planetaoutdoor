// Configurador de Equipo por Perfil
// Usa productos REALES de WooCommerce

export interface QuizOption {
  id: string
  label: string
  description?: string
}

export interface QuizQuestion {
  id: string
  question: string
  emoji: string
  options: QuizOption[]
  multiSelect?: boolean
  conditional?: {
    questionId: string
    answerIds: string[]
  }
}

export interface QuizAnswers {
  experience: string
  fishingType: string
  species: string
  budget: string
  priority: string
  existingGear?: string[]
}

// Categorías REALES de WooCommerce
export const WOO_CATEGORIES = {
  canas: 631,        // 55 productos
  carretes: 636,     // 33 productos
  lineas: 637,       // 30 productos
  leaders: 635,      // 24 productos
  moscas: 633,       // 48 productos
  accesorios: 133,   // 29 productos
  botas: 639,        // 16 productos
  waders: 638,       // 18 productos
  chalecos: 230,     // 16 productos
  cajas: 641,        // 11 productos
  chinguillos: 123,  // 7 productos
  infaltables: 232,  // 17 productos
}

// Rangos de precio por presupuesto (en CLP)
export const BUDGET_RANGES = {
  entry: { min: 0, max: 150000 },
  intermediate: { min: 100000, max: 350000 },
  advanced: { min: 250000, max: 600000 },
  premium: { min: 400000, max: 9999999 },
}

// Preguntas del Quiz
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: '¿Cuánta experiencia tienes en pesca con mosca?',
    emoji: '🎣',
    options: [
      {
        id: 'beginner_zero',
        label: 'Nunca he pescado con mosca',
        description: 'Voy a empezar desde cero',
      },
      {
        id: 'beginner',
        label: 'He ido 1-5 veces',
        description: 'Principiante con algo de práctica',
      },
      {
        id: 'intermediate',
        label: 'Pesco regularmente',
        description: 'Quiero mejorar mi equipo',
      },
      {
        id: 'advanced',
        label: 'Pesco hace años',
        description: 'Busco equipo específico',
      },
    ],
  },
  {
    id: 'fishingType',
    question: '¿Dónde vas a pescar principalmente?',
    emoji: '🏞️',
    options: [
      {
        id: 'small_rivers',
        label: 'Ríos pequeños con arbustos',
        description: 'Precisión, cañas cortas',
      },
      {
        id: 'medium_rivers',
        label: 'Ríos medianos a grandes',
        description: 'Versatilidad general',
      },
      {
        id: 'lakes',
        label: 'Lagos y lagunas',
        description: 'Distancia de lanzamiento',
      },
      {
        id: 'versatile',
        label: 'Todavía no sé',
        description: 'Quiero algo versátil',
      },
    ],
  },
  {
    id: 'species',
    question: '¿Qué peces te interesan?',
    emoji: '🐟',
    options: [
      {
        id: 'rainbow_brown',
        label: 'Truchas arcoíris y farios',
        description: 'Lo más común en Chile',
      },
      {
        id: 'big_brown',
        label: 'Truchas marrones grandes',
        description: 'Peces de mayor tamaño',
      },
      {
        id: 'salmon',
        label: 'Salmones',
        description: 'Pesca de salmónidos grandes',
      },
      {
        id: 'general',
        label: 'No estoy seguro',
        description: 'Quiero algo general',
      },
    ],
  },
  {
    id: 'budget',
    question: '¿Cuánto quieres invertir? (todo incluido)',
    emoji: '💰',
    options: [
      {
        id: 'entry',
        label: '$150.000 - $250.000',
        description: 'Equipo entrada confiable',
      },
      {
        id: 'intermediate',
        label: '$250.000 - $450.000',
        description: 'Equipo intermedio de calidad',
      },
      {
        id: 'advanced',
        label: '$450.000 - $750.000',
        description: 'Equipo avanzado',
      },
      {
        id: 'premium',
        label: '+$750.000',
        description: 'Sin compromiso, lo mejor',
      },
    ],
  },
  {
    id: 'priority',
    question: '¿Qué es más importante para ti?',
    emoji: '⚡',
    options: [
      {
        id: 'ease',
        label: 'Facilidad de uso',
        description: 'Quiero aprender sin frustración',
      },
      {
        id: 'durability',
        label: 'Durabilidad',
        description: 'Va a recibir golpes y uso rudo',
      },
      {
        id: 'sensitivity',
        label: 'Sensibilidad',
        description: 'Quiero sentir cada pique',
      },
      {
        id: 'lightness',
        label: 'Ligereza',
        description: 'Voy a pescar todo el día',
      },
    ],
  },
  {
    id: 'existingGear',
    question: '¿Tienes algo de este equipo?',
    emoji: '📦',
    multiSelect: true,
    conditional: {
      questionId: 'experience',
      answerIds: ['beginner_zero', 'beginner'],
    },
    options: [
      { id: 'cana', label: 'Caña' },
      { id: 'carrete', label: 'Carrete' },
      { id: 'linea', label: 'Línea' },
      { id: 'leader', label: 'Leader/Tippet' },
      { id: 'moscas', label: 'Moscas' },
      { id: 'nada', label: 'Nada, necesito todo' },
    ],
  },
]

// Tipo de producto para el kit
export interface KitProductType {
  type: 'cana' | 'carrete' | 'linea' | 'leader' | 'moscas' | 'accesorios'
  categoryId: number
  priority: 1 | 2 | 3  // 1=esencial, 2=recomendado, 3=opcional
  reason: string
}

// Configuración del kit basado en respuestas
export function getKitConfiguration(answers: QuizAnswers): {
  products: KitProductType[]
  budgetRange: { min: number; max: number }
  profile: string
  description: string
} {
  const { budget, existingGear } = answers
  const budgetRange = BUDGET_RANGES[budget as keyof typeof BUDGET_RANGES] || BUDGET_RANGES.entry

  // Productos base del kit
  let products: KitProductType[] = [
    { type: 'cana', categoryId: WOO_CATEGORIES.canas, priority: 1, reason: 'La base de tu equipo' },
    { type: 'carrete', categoryId: WOO_CATEGORIES.carretes, priority: 1, reason: 'Para almacenar y controlar la línea' },
    { type: 'linea', categoryId: WOO_CATEGORIES.lineas, priority: 1, reason: 'Esencial para lanzar' },
    { type: 'leader', categoryId: WOO_CATEGORIES.leaders, priority: 1, reason: 'Conexión con la mosca' },
    { type: 'moscas', categoryId: WOO_CATEGORIES.moscas, priority: 2, reason: 'Para empezar a pescar' },
    { type: 'accesorios', categoryId: WOO_CATEGORIES.infaltables, priority: 2, reason: 'Herramientas útiles' },
  ]

  // Filtrar por equipo existente
  if (existingGear && existingGear.length > 0 && !existingGear.includes('nada')) {
    products = products.filter(p => !existingGear.includes(p.type))
  }

  // Determinar perfil
  let profile = 'Kit Personalizado'
  let description = 'Equipo seleccionado según tus preferencias'

  if (budget === 'entry') {
    profile = 'Kit Principiante'
    description = 'Equipo confiable para comenzar en la pesca con mosca'
  } else if (budget === 'intermediate') {
    profile = 'Kit Intermedio'
    description = 'Equipo de calidad para mejorar tu experiencia'
  } else if (budget === 'advanced') {
    profile = 'Kit Avanzado'
    description = 'Equipo de alta gama para pescadores exigentes'
  } else if (budget === 'premium') {
    profile = 'Kit Premium'
    description = 'Lo mejor del mercado, sin compromisos'
  }

  return { products, budgetRange, profile, description }
}

// Función para formatear precio en CLP
export function formatPrice(price: number): string {
  return price.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  })
}
