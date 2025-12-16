/**
 * Sistema de recomendaciones inteligentes "Completa tu Equipamiento"
 *
 * Reglas de asociación basadas en categorías de productos:
 * - Qué productos complementan a otros
 * - Mensajes personalizados según el contexto
 */

// IDs de categorías de WooCommerce
export const CATEGORY_IDS = {
  CANAS: 631,
  CARRETES: 636,
  LINEAS: 637,
  LEADERS: 635,
  MOSCAS: 633,
  SENUELOS: 632,
  WADERS: 638,
  BOTAS: 639,
  CHALECOS_BOLSOS: 230,
  CHAQUETAS: 231,
  CAJAS: 641,
  GORROS: 119,
  CHINGUILLOS: 123,
  ACCESORIOS: 133,
  FLOAT_TUBES: 499,
  NYLON: 417,
  POLERAS_UV: 413,
  ATADO_MOSCAS: 634,
  GAFAS_STRAPS: 473,
  TERMOS: 122,
  ZAPATOS: 511,
  VESTUARIO: 669,
} as const

// Slugs de categorías (para matching por slug)
export const CATEGORY_SLUGS = {
  CANAS: 'canas',
  CARRETES: 'carretes',
  LINEAS: 'lineas',
  LEADERS: 'leaders',
  MOSCAS: 'moscas',
  SENUELOS: 'senuelos',
  WADERS: 'waders',
  BOTAS: 'botas',
  CHALECOS_BOLSOS: 'chalecos-y-bolsos',
  CHAQUETAS: 'chaquetas',
  CAJAS: 'cajas',
  GORROS: 'gorros',
  CHINGUILLOS: 'chinguillos',
  ACCESORIOS: 'accesorios',
  FLOAT_TUBES: 'float-tubes',
  NYLON: 'nylon-y-multifilamento',
  POLERAS_UV: 'poleras-uv',
  ATADO_MOSCAS: 'atado-de-moscas',
  GAFAS_STRAPS: 'gafas-y-straps',
  TERMOS: 'termos-outdoors-inicio',
  ZAPATOS: 'zapatos',
  VESTUARIO: 'vestuario',
} as const

export interface RecommendationRule {
  // Categorías que complementan al producto actual
  complementaryCategories: number[]
  // Mensaje personalizado para mostrar
  message: string
  // Título de la sección
  title: string
  // Prioridad (mayor = más importante)
  priority: number
}

// Reglas de recomendación por categoría
export const recommendationRules: Record<number, RecommendationRule> = {
  // CAÑAS - Sugiere carretes, líneas, leaders, moscas, cajas
  [CATEGORY_IDS.CANAS]: {
    complementaryCategories: [
      CATEGORY_IDS.CARRETES,
      CATEGORY_IDS.LINEAS,
      CATEGORY_IDS.LEADERS,
      CATEGORY_IDS.MOSCAS,
      CATEGORY_IDS.CAJAS,
    ],
    message: 'Para completar tu setup de pesca con mosca',
    title: 'Completa tu Equipamiento',
    priority: 10,
  },

  // CARRETES - Sugiere cañas, líneas, leaders, backing
  [CATEGORY_IDS.CARRETES]: {
    complementaryCategories: [
      CATEGORY_IDS.CANAS,
      CATEGORY_IDS.LINEAS,
      CATEGORY_IDS.LEADERS,
      CATEGORY_IDS.NYLON,
    ],
    message: 'Combina tu carrete con el equipo ideal',
    title: 'Completa tu Equipamiento',
    priority: 10,
  },

  // WADERS - Sugiere botas, chalecos, chaquetas
  [CATEGORY_IDS.WADERS]: {
    complementaryCategories: [
      CATEGORY_IDS.BOTAS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
      CATEGORY_IDS.CHAQUETAS,
      CATEGORY_IDS.GORROS,
    ],
    message: 'Equípate completamente para entrar al agua',
    title: 'Completa tu Equipamiento de Vadeo',
    priority: 10,
  },

  // BOTAS - Sugiere waders, chalecos, calcetines
  [CATEGORY_IDS.BOTAS]: {
    complementaryCategories: [
      CATEGORY_IDS.WADERS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Combina tus botas con el equipo perfecto',
    title: 'Completa tu Equipamiento',
    priority: 9,
  },

  // LÍNEAS - Sugiere cañas, carretes, leaders
  [CATEGORY_IDS.LINEAS]: {
    complementaryCategories: [
      CATEGORY_IDS.CANAS,
      CATEGORY_IDS.CARRETES,
      CATEGORY_IDS.LEADERS,
      CATEGORY_IDS.MOSCAS,
    ],
    message: 'Arma el combo perfecto para tu línea',
    title: 'Completa tu Setup',
    priority: 8,
  },

  // MOSCAS - Sugiere cajas, leaders, chinguillos, cañas
  [CATEGORY_IDS.MOSCAS]: {
    complementaryCategories: [
      CATEGORY_IDS.CAJAS,
      CATEGORY_IDS.LEADERS,
      CATEGORY_IDS.CHINGUILLOS,
      CATEGORY_IDS.CANAS,
    ],
    message: 'Todo lo que necesitas para pescar con mosca',
    title: 'Complementa tu Selección',
    priority: 7,
  },

  // SEÑUELOS - Sugiere cañas, carretes, nylon, cajas
  [CATEGORY_IDS.SENUELOS]: {
    complementaryCategories: [
      CATEGORY_IDS.CANAS,
      CATEGORY_IDS.CARRETES,
      CATEGORY_IDS.NYLON,
      CATEGORY_IDS.CAJAS,
    ],
    message: 'Equipo ideal para pesca con señuelos',
    title: 'Completa tu Equipamiento',
    priority: 7,
  },

  // CHALECOS Y BOLSOS - Sugiere cajas, accesorios, gorros
  [CATEGORY_IDS.CHALECOS_BOLSOS]: {
    complementaryCategories: [
      CATEGORY_IDS.CAJAS,
      CATEGORY_IDS.ACCESORIOS,
      CATEGORY_IDS.GORROS,
      CATEGORY_IDS.GAFAS_STRAPS,
    ],
    message: 'Accesorios para llevar en tu chaleco',
    title: 'Complementos Esenciales',
    priority: 6,
  },

  // LEADERS - Sugiere moscas, líneas, cajas
  [CATEGORY_IDS.LEADERS]: {
    complementaryCategories: [
      CATEGORY_IDS.MOSCAS,
      CATEGORY_IDS.LINEAS,
      CATEGORY_IDS.CAJAS,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Complementa tus leaders',
    title: 'También vas a necesitar',
    priority: 6,
  },

  // CAJAS - Sugiere moscas, señuelos, accesorios
  [CATEGORY_IDS.CAJAS]: {
    complementaryCategories: [
      CATEGORY_IDS.MOSCAS,
      CATEGORY_IDS.SENUELOS,
      CATEGORY_IDS.ACCESORIOS,
      CATEGORY_IDS.LEADERS,
    ],
    message: 'Llena tu caja con lo mejor',
    title: 'Para Guardar en tu Caja',
    priority: 5,
  },

  // GORROS - Sugiere gafas, chalecos, poleras UV
  [CATEGORY_IDS.GORROS]: {
    complementaryCategories: [
      CATEGORY_IDS.GAFAS_STRAPS,
      CATEGORY_IDS.POLERAS_UV,
      CATEGORY_IDS.CHALECOS_BOLSOS,
    ],
    message: 'Protección completa para tu día de pesca',
    title: 'Protección Solar',
    priority: 4,
  },

  // CHAQUETAS - Sugiere waders, chalecos, gorros
  [CATEGORY_IDS.CHAQUETAS]: {
    complementaryCategories: [
      CATEGORY_IDS.WADERS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
      CATEGORY_IDS.GORROS,
      CATEGORY_IDS.BOTAS,
    ],
    message: 'Completa tu vestimenta técnica',
    title: 'Completa tu Outfit',
    priority: 5,
  },

  // FLOAT TUBES - Sugiere waders, chalecos, aletas
  [CATEGORY_IDS.FLOAT_TUBES]: {
    complementaryCategories: [
      CATEGORY_IDS.WADERS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Equipo esencial para float tube',
    title: 'Imprescindibles para Float Tube',
    priority: 8,
  },

  // ATADO DE MOSCAS - Sugiere cajas, materiales
  [CATEGORY_IDS.ATADO_MOSCAS]: {
    complementaryCategories: [
      CATEGORY_IDS.CAJAS,
      CATEGORY_IDS.MOSCAS,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Materiales para tus creaciones',
    title: 'Complementa tu Mesa de Atado',
    priority: 6,
  },

  // CHINGUILLOS - Sugiere waders, chalecos
  [CATEGORY_IDS.CHINGUILLOS]: {
    complementaryCategories: [
      CATEGORY_IDS.WADERS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Para una captura exitosa',
    title: 'Completa tu Equipo',
    priority: 5,
  },

  // GAFAS Y STRAPS - Sugiere gorros, poleras UV
  [CATEGORY_IDS.GAFAS_STRAPS]: {
    complementaryCategories: [
      CATEGORY_IDS.GORROS,
      CATEGORY_IDS.POLERAS_UV,
      CATEGORY_IDS.ACCESORIOS,
    ],
    message: 'Protección y comodidad',
    title: 'Protección Visual',
    priority: 4,
  },

  // POLERAS UV - Sugiere gorros, gafas
  [CATEGORY_IDS.POLERAS_UV]: {
    complementaryCategories: [
      CATEGORY_IDS.GORROS,
      CATEGORY_IDS.GAFAS_STRAPS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
    ],
    message: 'Protección solar completa',
    title: 'Protección UV',
    priority: 4,
  },

  // TERMOS - Sugiere coolers, accesorios outdoor
  [CATEGORY_IDS.TERMOS]: {
    complementaryCategories: [
      CATEGORY_IDS.ACCESORIOS,
      CATEGORY_IDS.CHALECOS_BOLSOS,
    ],
    message: 'Para tus aventuras outdoor',
    title: 'Complementos Outdoor',
    priority: 3,
  },
}

// Regla por defecto para categorías sin regla específica
export const defaultRule: RecommendationRule = {
  complementaryCategories: [
    CATEGORY_IDS.ACCESORIOS,
    CATEGORY_IDS.CAJAS,
    CATEGORY_IDS.MOSCAS,
  ],
  message: 'Productos que podrían interesarte',
  title: 'También te puede interesar',
  priority: 1,
}

/**
 * Obtiene las recomendaciones para un producto basado en sus categorías
 */
export function getRecommendationsForProduct(
  productCategories: { id: number; slug: string }[]
): RecommendationRule {
  // Buscar la regla con mayor prioridad entre las categorías del producto
  let bestRule: RecommendationRule | null = null

  for (const category of productCategories) {
    const rule = recommendationRules[category.id]
    if (rule && (!bestRule || rule.priority > bestRule.priority)) {
      bestRule = rule
    }
  }

  return bestRule || defaultRule
}

/**
 * Obtiene el slug de categoría por ID
 */
export function getCategorySlugById(categoryId: number): string | null {
  const entries = Object.entries(CATEGORY_IDS)
  for (const [key, id] of entries) {
    if (id === categoryId) {
      const slugKey = key as keyof typeof CATEGORY_SLUGS
      return CATEGORY_SLUGS[slugKey] || null
    }
  }
  return null
}

/**
 * Mapeo de productos específicos para recomendaciones cross-sell
 * (productos que van bien juntos independientemente de la categoría)
 */
export const specificProductPairings: Record<number, number[]> = {
  // Wader Expedition -> Botas específicas, chaqueta wading
  6715: [6704, 7056],
  // Wader Traverse -> Botas, chaqueta
  6181: [6704, 7056],
}
