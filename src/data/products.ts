import { Product } from '../types/product'

// Categorías de productos
export const categories = [
  { id: 1, name: 'Waders', slug: 'waders' },
  { id: 2, name: 'Botas Suela de Fieltro', slug: 'botas-fieltro' },
  { id: 3, name: 'Botas Suela de Goma', slug: 'botas-goma' },
  { id: 4, name: 'Gorros', slug: 'gorros' },
  { id: 5, name: 'Pesca Con Mosca', slug: 'pesca-mosca' },
  { id: 6, name: 'Atado de Moscas', slug: 'atado-moscas' },
  { id: 7, name: 'Pesca de Mar', slug: 'pesca-mar' },
  { id: 8, name: 'Pesca de Trolling', slug: 'pesca-trolling' },
  { id: 9, name: 'Vestuario', slug: 'vestuario' },
  { id: 10, name: 'Nuevos Productos', slug: 'nuevos' },
]

// Productos mockup - Waders
export const wadersProducts: Product[] = [
  {
    id: 1,
    name: 'Skwala RS Wader',
    slug: 'skwala-rs-wader',
    description: 'Wader premium de alto rendimiento con tecnología impermeable avanzada. Ideal para pesca en aguas frías y condiciones extremas. Costuras selladas y refuerzos en rodillas.',
    shortDescription: 'Wader premium Skwala con tecnología RS',
    price: 1125000,
    regularPrice: 1125000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 1, name: 'Waders', slug: 'waders' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 5,
    attributes: [],
    hasVariations: false,
  },
  {
    id: 2,
    name: 'Pantalón Hombre Swiftcurrent Wading Pants',
    slug: 'pantalon-swiftcurrent-wading',
    description: 'Pantalón de vadeo ligero y versátil para días cálidos. Construcción durable con tela resistente al agua y secado rápido.',
    shortDescription: 'Pantalón de vadeo Swiftcurrent para hombre',
    price: 309000,
    regularPrice: 309000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 1, name: 'Waders', slug: 'waders' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 12,
    attributes: [
      { name: 'Talla', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    hasVariations: true,
  },
  {
    id: 3,
    name: 'Wader Patagonia Swiftcurrent Mujer',
    slug: 'wader-patagonia-swiftcurrent-mujer',
    description: 'Wader diseñado específicamente para la anatomía femenina. Ajuste cómodo y libertad de movimiento para largas jornadas de pesca.',
    shortDescription: 'Wader Patagonia diseñado para mujer',
    price: 429000,
    regularPrice: 429000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 1, name: 'Waders', slug: 'waders' }],
    tags: [{ id: 2, name: 'Mujer', slug: 'mujer' }],
    stockStatus: 'instock',
    stockQuantity: 8,
    attributes: [
      { name: 'Talla', options: ['XS', 'S', 'M', 'L', 'XL'] }
    ],
    hasVariations: true,
  },
  {
    id: 4,
    name: 'WADER NEW SIMMS TRIBUTARY MAN',
    slug: 'wader-simms-tributary-man',
    description: 'Wader Simms Tributary con excelente relación calidad-precio. Perfecto para pescadores que buscan durabilidad y rendimiento.',
    shortDescription: 'Wader Simms Tributary para hombre',
    price: 299000,
    regularPrice: 299000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 1, name: 'Waders', slug: 'waders' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 15,
    attributes: [
      { name: 'Talla', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    hasVariations: true,
  },
  {
    id: 5,
    name: 'Traje de Pesca Hombre Swiftcurrent Expedition Zip-Front Waders',
    slug: 'swiftcurrent-expedition-zip-front',
    description: 'Wader premium con cierre frontal para máxima comodidad. Sistema de ventilación y bolsillos impermeables. El favorito de los guías profesionales.',
    shortDescription: 'Wader Expedition con cierre frontal',
    price: 629000,
    regularPrice: 629000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 1, name: 'Waders', slug: 'waders' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 6,
    attributes: [
      { name: 'Talla', options: ['S', 'M', 'L', 'XL'] }
    ],
    hasVariations: true,
  },
]

// Productos mockup - Botas Suela de Fieltro
export const botasFieltroProducts: Product[] = [
  {
    id: 6,
    name: 'Zapatos Korkers Greenback Suela de Felpa y Goma',
    slug: 'korkers-greenback-felpa-goma',
    description: 'Botas de vadeo versátiles con sistema de suela intercambiable. Incluye suela de fieltro y goma para adaptarse a diferentes condiciones.',
    shortDescription: 'Korkers Greenback con suelas intercambiables',
    price: 269900,
    regularPrice: 269900,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 2, name: 'Botas Suela de Fieltro', slug: 'botas-fieltro' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 10,
    attributes: [
      { name: 'Talla', options: ['38', '39', '40', '41', '42', '43', '44', '45'] }
    ],
    hasVariations: true,
  },
  {
    id: 7,
    name: 'Zapatos de Vadeo FFA',
    slug: 'zapatos-vadeo-ffa',
    description: 'Botas de vadeo económicas con suela de fieltro de alta calidad. Excelente tracción en rocas resbaladizas.',
    shortDescription: 'Botas de vadeo FFA con suela de fieltro',
    price: 124000,
    regularPrice: 124000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 2, name: 'Botas Suela de Fieltro', slug: 'botas-fieltro' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 20,
    attributes: [
      { name: 'Talla', options: ['38', '39', '40', '41', '42', '43', '44'] }
    ],
    hasVariations: true,
  },
  {
    id: 8,
    name: 'Korkers Greenback Wading Boot – Felt',
    slug: 'korkers-greenback-felt',
    description: 'Bota de vadeo clásica con suela de fieltro premium. Construcción robusta y soporte de tobillo superior.',
    shortDescription: 'Korkers Greenback con suela de fieltro',
    price: 219000,
    regularPrice: 219000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 2, name: 'Botas Suela de Fieltro', slug: 'botas-fieltro' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 8,
    attributes: [
      { name: 'Talla', options: ['39', '40', '41', '42', '43', '44', '45'] }
    ],
    hasVariations: true,
  },
  {
    id: 9,
    name: 'BOOT DARKHORSE FELT KLING-ON SOLES',
    slug: 'darkhorse-felt-kling-on',
    description: 'Botas profesionales con tecnología Kling-On para máxima adherencia. Preferidas por pescadores expertos en ríos de montaña.',
    shortDescription: 'Botas Darkhorse con suela Kling-On',
    price: 314000,
    regularPrice: 314000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 2, name: 'Botas Suela de Fieltro', slug: 'botas-fieltro' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 5,
    attributes: [
      { name: 'Talla', options: ['40', '41', '42', '43', '44', '45'] }
    ],
    hasVariations: true,
  },
]

// Productos mockup - Botas Suela de Goma
export const botasGomaProducts: Product[] = [
  {
    id: 10,
    name: 'Skwala Carbon Botas de Vadeo',
    slug: 'skwala-carbon-botas',
    description: 'Botas ultraligeras con construcción de fibra de carbono. Suela de goma de alto agarre para terrenos técnicos.',
    shortDescription: 'Botas Skwala Carbon ultraligeras',
    price: 383000,
    regularPrice: 383000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 3, name: 'Botas Suela de Goma', slug: 'botas-goma' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 7,
    attributes: [],
    hasVariations: false,
  },
  {
    id: 11,
    name: 'Skwala RS Botas de Vadeo',
    slug: 'skwala-rs-botas',
    description: 'Botas de la línea RS con tecnología de tracción avanzada. Diseñadas para condiciones extremas y uso intensivo.',
    shortDescription: 'Botas Skwala RS de alto rendimiento',
    price: 436000,
    regularPrice: 436000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 3, name: 'Botas Suela de Goma', slug: 'botas-goma' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 4,
    attributes: [],
    hasVariations: false,
  },
  {
    id: 12,
    name: 'Simms Freestone Rubber Sole Boot',
    slug: 'simms-freestone-rubber',
    description: 'Bota versátil Simms con suela de goma Vibram. Ideal para vadeo en ríos con regulaciones sobre fieltro.',
    shortDescription: 'Botas Simms Freestone suela goma',
    price: 289000,
    regularPrice: 289000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 3, name: 'Botas Suela de Goma', slug: 'botas-goma' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 12,
    attributes: [
      { name: 'Talla', options: ['39', '40', '41', '42', '43', '44', '45'] }
    ],
    hasVariations: true,
  },
]

// Productos mockup - Gorros
export const gorrosProducts: Product[] = [
  {
    id: 13,
    name: 'Gorro Patagonia Trucker',
    slug: 'gorro-patagonia-trucker',
    description: 'Gorro clásico trucker con logo bordado. Malla trasera transpirable y ajuste snapback.',
    shortDescription: 'Gorro trucker Patagonia clásico',
    price: 35000,
    regularPrice: 35000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 4, name: 'Gorros', slug: 'gorros' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 25,
    attributes: [
      { name: 'Color', options: ['Negro', 'Azul', 'Verde', 'Gris'] }
    ],
    hasVariations: true,
  },
  {
    id: 14,
    name: 'Gorro Sun Protección UV',
    slug: 'gorro-sun-uv',
    description: 'Gorro con protección UPF 50+ para largas jornadas de pesca. Ala ancha y tela de secado rápido.',
    shortDescription: 'Gorro con protección solar UV',
    price: 42000,
    regularPrice: 42000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 4, name: 'Gorros', slug: 'gorros' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 18,
    attributes: [
      { name: 'Color', options: ['Beige', 'Gris', 'Verde Oliva'] }
    ],
    hasVariations: true,
  },
]

// Productos mockup - Pesca con Mosca
export const pescaMoscaProducts: Product[] = [
  {
    id: 15,
    name: 'Caña Orvis Clearwater 9ft 5wt',
    slug: 'cana-orvis-clearwater',
    description: 'Caña de mosca versátil ideal para truchas. Acción media-rápida y construcción de grafito de alta calidad.',
    shortDescription: 'Caña Orvis Clearwater 9 pies 5wt',
    price: 285000,
    regularPrice: 285000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 5, name: 'Pesca Con Mosca', slug: 'pesca-mosca' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 6,
    attributes: [],
    hasVariations: false,
  },
  {
    id: 16,
    name: 'Carrete Lamson Liquid',
    slug: 'carrete-lamson-liquid',
    description: 'Carrete de mosca con sistema de arrastre sellado. Construcción de aluminio anodizado, ligero y duradero.',
    shortDescription: 'Carrete Lamson Liquid aluminio',
    price: 195000,
    regularPrice: 195000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 5, name: 'Pesca Con Mosca', slug: 'pesca-mosca' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 10,
    attributes: [
      { name: 'Tamaño', options: ['3/4', '5/6', '7/8'] }
    ],
    hasVariations: true,
  },
  {
    id: 17,
    name: 'Línea Scientific Anglers Amplitude',
    slug: 'linea-scientific-anglers',
    description: 'Línea de mosca premium con núcleo de bajo estiramiento. Excelente para lances precisos y control de la deriva.',
    shortDescription: 'Línea SA Amplitude flotante',
    price: 125000,
    regularPrice: 125000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 5, name: 'Pesca Con Mosca', slug: 'pesca-mosca' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 15,
    attributes: [
      { name: 'Peso', options: ['WF4F', 'WF5F', 'WF6F', 'WF7F'] }
    ],
    hasVariations: true,
  },
]

// Productos mockup - Vestuario
export const vestuarioProducts: Product[] = [
  {
    id: 18,
    name: 'Chaqueta Simms Guide Jacket',
    slug: 'chaqueta-simms-guide',
    description: 'Chaqueta impermeable y transpirable diseñada para guías de pesca. Múltiples bolsillos y capucha ajustable.',
    shortDescription: 'Chaqueta Simms Guide impermeable',
    price: 489000,
    regularPrice: 489000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 9, name: 'Vestuario', slug: 'vestuario' }],
    tags: [{ id: 1, name: 'Premium', slug: 'premium' }],
    stockStatus: 'instock',
    stockQuantity: 8,
    attributes: [
      { name: 'Talla', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Azul', 'Gris', 'Verde'] }
    ],
    hasVariations: true,
  },
  {
    id: 19,
    name: 'Polar Patagonia Better Sweater',
    slug: 'polar-patagonia-better-sweater',
    description: 'Polar clásico de Patagonia con interior afelpado. Perfecto como capa intermedia o uso casual.',
    shortDescription: 'Polar Patagonia Better Sweater',
    price: 159000,
    regularPrice: 159000,
    salePrice: null,
    onSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop'
    ],
    categories: [{ id: 9, name: 'Vestuario', slug: 'vestuario' }],
    tags: [],
    stockStatus: 'instock',
    stockQuantity: 20,
    attributes: [
      { name: 'Talla', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Azul Marino', 'Gris', 'Negro', 'Verde'] }
    ],
    hasVariations: true,
  },
]

// Todos los productos combinados
export const allProducts: Product[] = [
  ...wadersProducts,
  ...botasFieltroProducts,
  ...botasGomaProducts,
  ...gorrosProducts,
  ...pescaMoscaProducts,
  ...vestuarioProducts,
]

// Función para obtener productos por categoría
export function getProductsByCategory(categorySlug: string): Product[] {
  return allProducts.filter(product =>
    product.categories.some(cat => cat.slug === categorySlug)
  )
}

// Función para obtener un producto por slug
export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(product => product.slug === slug)
}

// Función para obtener un producto por ID
export function getProductById(id: number): Product | undefined {
  return allProducts.find(product => product.id === id)
}

// Función para formatear precio en CLP
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}
