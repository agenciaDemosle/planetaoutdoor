// Datos de productos para el configurador de kits mosqueros

export interface KitProduct {
  id: number
  name: string
  slug: string
  price: number
  image: string
  variation?: string
}

export interface KitRecommendation {
  cana: KitProduct
  carrete: KitProduct
  linea: KitProduct
  lineaAlternativa?: KitProduct
  upgradeCarrete?: KitProduct
}

// Productos reales de WooCommerce
export const PRODUCTS = {
  // Cañas
  canas: {
    fario: {
      id: 3278,
      name: 'Caña Fario Tactical',
      slug: 'fario-cana-tactical-8',
      price: 84900,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2018/09/958-Cana-Mosquera-FARIO-Tactical.jpg',
    },
    lift: {
      id: 1498,
      name: 'Echo Lift',
      slug: 'cana-mosquera-echo-base',
      price: 199000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2017/10/41-VPsUV6cL._SS400_-1.jpg',
    },
    carbonXL: {
      id: 2720,
      name: 'Echo Carbon XL',
      slug: 'cana-mosquera-echo-carbon-xl',
      price: 299000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2017/10/IMG_0562.jpeg',
    },
    boostFresh: {
      id: 1506,
      name: 'Echo Boost Fresh',
      slug: 'cana-mosquera-echo-boost',
      price: 389000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2017/10/Echo-Boost-Fresh-Fly-Rod.png',
    },
    boostBlue: {
      id: 4643,
      name: 'Echo Boost Blue',
      slug: 'echo-boost-blue',
      price: 399000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2024/06/Echo-Boost-Blue-Fly-Rod.jpg',
    },
  },
  // Carretes
  carretes: {
    echoIon: {
      id: 1564,
      name: 'Carrete Echo Ion',
      slug: 'carrete-mosquero-echo-ion',
      price: 99900,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2017/10/129-Carrete-mosquero-Echo-Ion.jpg',
    },
    echoBravo: {
      id: 6099,
      name: 'Carrete Echo Bravo 7/9',
      slug: 'carrete-echo-bravo-7-9',
      price: 149000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/07/IMG_5333.jpeg',
    },
    redingtonRun: {
      id: 6560,
      name: 'Carrete Redington Run 5/6',
      slug: 'carrete-redington-run-5-6',
      price: 185000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/09/IMG_6920.jpeg',
    },
    behemoth: {
      id: 4292,
      name: 'Carrete Redington Behemoth',
      slug: 'carrete-redington-modelo-behemoth',
      price: 199000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2023/11/carrete_behemoth.webp',
    },
  },
  // Líneas
  lineas: {
    mpx: {
      id: 3417,
      name: 'SA Mastery MPX',
      slug: 'mastery-mpx-scientific-anglers',
      price: 95900,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2018/10/IMG_3043.jpeg',
    },
    titan: {
      id: 5774,
      name: 'SA Mastery Titan',
      slug: 'linea-sa-mastery-titan',
      price: 95900,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/01/IMG_2340.jpeg',
    },
    streamerAndino: {
      id: 6685,
      name: 'SA Streamer Andino 225gr',
      slug: 'linea-scientific-angler-streamer-andino-225gr',
      price: 89900,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/09/IMG_7327.jpeg',
    },
    tripleDensity: {
      id: 4290,
      name: 'Sonar Titan Triple Density',
      slug: 'linea-sonar-titan-triple-density-s3-s5-s7',
      price: 99700,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2023/11/linea_Sonar_Titan.webp',
    },
    coldHead: {
      id: 3714,
      name: 'SA Sonar 25 Cold 300G',
      slug: 'scientific-anglers-linea-sonar',
      price: 119000,
      image: 'https://planetaoutdoor.cl/wp-content/uploads/2020/06/540-1.webp',
    },
  },
}

// Opciones del configurador
export const SPECIES_OPTIONS = [
  { id: 'small', label: 'Truchas pequeñas a medianas', points: 0 },
  { id: 'large', label: 'Truchas grandes', points: 2 },
  { id: 'salmon', label: 'Salmones o salmonídeos de gran tamaño', points: 0, forceLine: 8 },
]

export const WATER_OPTIONS = [
  { id: 'small', label: 'Río pequeño (arroyos, esteros)', points: 0 },
  { id: 'medium', label: 'Río mediano', points: 1 },
  { id: 'large', label: 'Río grande / Lago', points: 2 },
]

export const TECHNIQUE_OPTIONS = [
  { id: 'dry', label: 'Moscas secas', points: 0, needsTitan: false },
  { id: 'nymph', label: 'Ninfas', points: 0, needsTitan: false },
  { id: 'mixed', label: '50/50 Ninfas y Streamers', points: 1, needsTitan: false },
  { id: 'streamer', label: 'Streamers principalmente', points: 2, needsTitan: false, needsSinking: true },
  { id: 'foam', label: 'Foam / Terrestres grandes', points: 2, needsTitan: true },
]

export const WIND_OPTIONS = [
  { id: 'low', label: 'Poco o nada de viento', points: 0 },
  { id: 'moderate', label: 'Viento moderado', points: 1 },
  { id: 'high', label: 'Mucho viento', points: 2 },
]

export const LEVEL_OPTIONS = [
  { id: 'entrada', label: 'Entrada', description: 'Estoy comenzando' },
  { id: 'intermedio', label: 'Intermedio', description: 'Ya tengo experiencia' },
  { id: 'avanzado', label: 'Avanzado', description: 'Busco rendimiento' },
  { id: 'tope', label: 'Tope de gama', description: 'Quiero lo mejor' },
]

export const LINE_TYPE_OPTIONS = [
  { id: 'mpx', label: 'Flotante para presentación (MPX)', description: 'Moscas de tamaño medio, viento moderado' },
  { id: 'titan', label: 'Flotante para potencia/foam (Titan)', description: 'Moscas grandes, foam, viento fuerte' },
  { id: 'sinking', label: 'Hundimiento para streamers', description: 'Streamer Andino para pozones profundos' },
]

// Tipos para el estado del configurador
export interface ConfiguratorState {
  step: number
  species: string | null
  water: string | null
  technique: string | null
  wind: string | null
  level: string | null
  lineType: string | null
  wantsUpgrade: boolean
}

// Función para calcular el número de línea recomendado
export function calculateLineNumber(state: ConfiguratorState): 4 | 5 | 6 | 8 {
  // Regla 1: Salmón siempre es #8
  const speciesOption = SPECIES_OPTIONS.find(s => s.id === state.species)
  if (speciesOption?.forceLine === 8) {
    return 8
  }

  // Regla 2: Río pequeño + técnica fina = #4
  const waterOption = WATER_OPTIONS.find(w => w.id === state.water)
  const techniqueOption = TECHNIQUE_OPTIONS.find(t => t.id === state.technique)
  const windOption = WIND_OPTIONS.find(w => w.id === state.wind)

  if (
    state.water === 'small' &&
    (state.technique === 'dry' || state.technique === 'nymph') &&
    state.species === 'small' &&
    (state.wind === 'low' || state.wind === 'moderate')
  ) {
    return 4
  }

  // Regla 3: Calcular puntaje para #5 vs #6
  let points = 0
  points += waterOption?.points || 0
  points += techniqueOption?.points || 0
  points += windOption?.points || 0
  points += speciesOption?.points || 0

  return points >= 3 ? 6 : 5
}

// Función para obtener la recomendación del kit
export function getKitRecommendation(
  lineNumber: 4 | 5 | 6 | 8,
  level: string,
  lineType: string | null,
  technique: string | null
): KitRecommendation {
  const { canas, carretes, lineas } = PRODUCTS

  // Kit #8 - Salmón (nunca flotante)
  if (lineNumber === 8) {
    const recommendation: KitRecommendation = {
      cana: { ...canas.lift, variation: '#8' },
      carrete: { ...carretes.echoBravo },
      linea: { ...lineas.tripleDensity },
      lineaAlternativa: { ...lineas.coldHead },
    }

    if (level === 'avanzado' || level === 'tope') {
      recommendation.carrete = { ...carretes.behemoth, variation: '7/8' }
    }
    if (level === 'tope') {
      recommendation.cana = { ...canas.boostBlue, variation: '#8' }
    }

    return recommendation
  }

  // Determinar la línea según el tipo seleccionado
  let lineaRecomendada: KitProduct
  if (lineNumber === 6) {
    if (lineType === 'sinking' || technique === 'streamer') {
      lineaRecomendada = { ...lineas.streamerAndino }
    } else if (lineType === 'titan' || technique === 'foam') {
      lineaRecomendada = { ...lineas.titan, variation: `#${lineNumber}` }
    } else {
      lineaRecomendada = { ...lineas.mpx, variation: `#${lineNumber}` }
    }
  } else {
    lineaRecomendada = { ...lineas.mpx, variation: `#${lineNumber}` }
  }

  // Determinar variación del carrete
  const carreteVariation = lineNumber <= 5 ? '4/5' : '6/7'

  // Kit base según nivel
  const recommendation: KitRecommendation = {
    cana: { ...canas.fario, variation: `#${lineNumber}` },
    carrete: { ...carretes.echoIon, variation: carreteVariation },
    linea: lineaRecomendada,
    upgradeCarrete: { ...carretes.redingtonRun },
  }

  // Ajustar caña según nivel
  switch (level) {
    case 'intermedio':
      recommendation.cana = { ...canas.lift, variation: `#${lineNumber}` }
      break
    case 'avanzado':
      recommendation.cana = { ...canas.carbonXL, variation: `#${lineNumber}` }
      break
    case 'tope':
      if (lineNumber === 6 && (lineType === 'titan' || technique === 'foam' || technique === 'streamer')) {
        recommendation.cana = { ...canas.boostBlue, variation: '#6' }
      } else {
        recommendation.cana = { ...canas.boostFresh, variation: `#${lineNumber}` }
      }
      break
  }

  // Para #6, ofrecer línea de hundimiento como alternativa si no está ya seleccionada
  if (lineNumber === 6 && lineType !== 'sinking') {
    recommendation.lineaAlternativa = { ...lineas.streamerAndino }
  }

  return recommendation
}

// Función para formatear precio
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}

// Función para calcular total del kit
export function calculateKitTotal(recommendation: KitRecommendation, includeUpgrade: boolean): number {
  let total = recommendation.cana.price + recommendation.carrete.price + recommendation.linea.price
  if (includeUpgrade && recommendation.upgradeCarrete) {
    total += recommendation.upgradeCarrete.price - recommendation.carrete.price
  }
  return total
}
