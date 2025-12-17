import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { wooCommerceAPI } from '../api/woocommerce'
import { WooProduct, Product, mapWooProductToProduct } from '../types/product'
import { ProductCard } from '../components/product/ProductCard/ProductCard'
import { ProductFilters, CATEGORY_FILTERS, PARENT_CATEGORY_FILTERS } from '../components/shop/ProductFilters'
import { trackViewItemList } from '../hooks/useAnalytics'

interface FilterState {
  [attributeSlug: string]: string[]
}

// Categorías de WooCommerce (actualizado Dic 2025)
const CATEGORIES = [
  // === CATEGORÍAS PRINCIPALES ===
  { slug: 'pesca-con-mosca', name: 'Pesca con Mosca', id: 723, parent: null },
  { slug: 'atado-de-moscas', name: 'Atado de Moscas', id: 634, parent: null },
  { slug: 'pesca-tradicional', name: 'Pesca Tradicional', id: 724, parent: null },
  { slug: 'waders-botas', name: 'Waders & Botas', id: 725, parent: null },
  { slug: 'ropa-tecnica', name: 'Ropa Técnica', id: 726, parent: null },
  { slug: 'mochilas-equipamiento', name: 'Mochilas & Equipamiento', id: 727, parent: null },
  { slug: 'outdoor-camping', name: 'Outdoor & Camping', id: 728, parent: null },
  { slug: 'embarcaciones-flotacion', name: 'Embarcaciones', id: 729, parent: null },
  { slug: 'ofertas', name: 'Ofertas', id: 730, parent: null },

  // === PESCA CON MOSCA (723) ===
  { slug: 'canas-mosca', name: 'Cañas de Mosca', id: 731, parent: 'pesca-con-mosca' },
  { slug: 'carretes-mosca', name: 'Carretes de Mosca', id: 732, parent: 'pesca-con-mosca' },
  { slug: 'lineas-mosca', name: 'Líneas de Mosca', id: 733, parent: 'pesca-con-mosca' },
  { slug: 'leaders-tippets', name: 'Leaders y Tippets', id: 734, parent: 'pesca-con-mosca' },
  { slug: 'moscas-pesca', name: 'Moscas', id: 735, parent: 'pesca-con-mosca' },
  { slug: 'chalecos-packs-mosqueros', name: 'Chalecos y Packs', id: 736, parent: 'pesca-con-mosca' },
  { slug: 'chinguillos-sacaderas', name: 'Chinguillos', id: 737, parent: 'pesca-con-mosca' },
  { slug: 'accesorios-mosqueros', name: 'Accesorios Mosqueros', id: 738, parent: 'pesca-con-mosca' },
  { slug: 'combos-mosqueros', name: 'Combos Mosqueros', id: 739, parent: 'pesca-con-mosca' },
  { slug: 'lentes-polarizados', name: 'Lentes Polarizados', id: 740, parent: 'pesca-con-mosca' },
  // Sub-subcategorías de Cañas de Mosca (731)
  { slug: 'canas-euro-nymph', name: 'Euro Nymph', id: 851, parent: 'canas-mosca' },
  { slug: 'canas-2-manos', name: 'Cañas de 2 Manos', id: 852, parent: 'canas-mosca' },
  // Sub-subcategorías de Líneas de Mosca (733)
  { slug: 'lineas-flotante', name: 'Flotante', id: 853, parent: 'lineas-mosca' },
  { slug: 'lineas-punta-hundida', name: 'Punta Hundida', id: 854, parent: 'lineas-mosca' },
  { slug: 'lineas-hundimiento-completo', name: 'Hundimiento Completo', id: 855, parent: 'lineas-mosca' },
  { slug: 'lineas-fria', name: 'Líneas Fría', id: 856, parent: 'lineas-mosca' },
  { slug: 'lineas-templada', name: 'Líneas Templada', id: 857, parent: 'lineas-mosca' },
  { slug: 'lineas-tropical', name: 'Líneas Tropical', id: 858, parent: 'lineas-mosca' },
  { slug: 'lineas-secas', name: 'Líneas Secas', id: 859, parent: 'lineas-mosca' },
  { slug: 'lineas-ninfa', name: 'Líneas Ninfa', id: 860, parent: 'lineas-mosca' },
  { slug: 'lineas-streamer', name: 'Líneas Streamer', id: 861, parent: 'lineas-mosca' },
  // Sub-subcategorías de Leaders y Tippets (734)
  { slug: 'leaders-monofilamento', name: 'Monofilamento', id: 862, parent: 'leaders-tippets' },
  { slug: 'leaders-fluorocarbono', name: 'Fluorocarbono', id: 863, parent: 'leaders-tippets' },
  // Sub-subcategorías de Moscas (735)
  { slug: 'moscas-secas', name: 'Moscas Secas', id: 748, parent: 'moscas-pesca' },
  { slug: 'moscas-ninfas', name: 'Ninfas', id: 747, parent: 'moscas-pesca' },
  { slug: 'moscas-streamers', name: 'Streamers', id: 746, parent: 'moscas-pesca' },
  { slug: 'moscas-terrestres', name: 'Terrestres', id: 749, parent: 'moscas-pesca' },

  // === PESCA TRADICIONAL (724) ===
  { slug: 'canas-tradicional', name: 'Cañas', id: 761, parent: 'pesca-tradicional' },
  // Subcategorías de Cañas
  { slug: 'canas-ul', name: 'UL - Ultra Light', id: 872, parent: 'canas-tradicional' },
  { slug: 'canas-spinning', name: 'Spinning', id: 873, parent: 'canas-tradicional' },
  { slug: 'canas-baitcasting', name: 'Baitcasting', id: 919, parent: 'canas-tradicional' },
  { slug: 'canas-mar-costa', name: 'Mar / Costa', id: 920, parent: 'canas-tradicional' },
  { slug: 'canas-trolling', name: 'Trolling', id: 921, parent: 'canas-tradicional' },
  { slug: 'carretes-tradicional', name: 'Carretes', id: 762, parent: 'pesca-tradicional' },
  // Subcategorías de Carretes
  { slug: 'carretes-ul', name: 'UL - Ultra Light', id: 922, parent: 'carretes-tradicional' },
  { slug: 'carretes-spinning-frontal', name: 'Spinning', id: 926, parent: 'carretes-tradicional' },
  { slug: 'carretes-baitcasting', name: 'Baitcasting', id: 923, parent: 'carretes-tradicional' },
  { slug: 'carretes-mar-costa', name: 'Mar / Costa', id: 924, parent: 'carretes-tradicional' },
  { slug: 'carretes-trolling', name: 'Trolling', id: 925, parent: 'carretes-tradicional' },
  { slug: 'senuelos-tradicional', name: 'Señuelos', id: 763, parent: 'pesca-tradicional' },
  { slug: 'nylon-multifilamento', name: 'Nylon y Multifilamento', id: 764, parent: 'pesca-tradicional' },
  { slug: 'accesorios-tradicional', name: 'Accesorios', id: 765, parent: 'pesca-tradicional' },
  { slug: 'lentes-polarizados-tradicional', name: 'Lentes Polarizados', id: 766, parent: 'pesca-tradicional' },
  // Sub-subcategorías de Señuelos (763)
  { slug: 'senuelos-spoons-cucharas', name: 'Spoons y Cucharas', id: 769, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-spinners', name: 'Spinners', id: 770, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-crankbaits', name: 'Crankbaits', id: 767, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-minnows-jerkbaits', name: 'Minnows y Jerkbaits', id: 768, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-soft-baits', name: 'Soft Baits y Vinilos', id: 771, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-metal-jigs', name: 'Metal Jigs', id: 772, parent: 'senuelos-tradicional' },
  { slug: 'senuelos-topwater', name: 'Topwater', id: 773, parent: 'senuelos-tradicional' },

  // === WADERS & BOTAS (725) ===
  { slug: 'waders-hombre', name: 'Waders Hombre', id: 785, parent: 'waders-botas' },
  { slug: 'waders-mujer', name: 'Waders Mujer', id: 786, parent: 'waders-botas' },
  { slug: 'botas-vadeo-goma', name: 'Botas Suela Goma', id: 787, parent: 'waders-botas' },
  { slug: 'botas-vadeo-fieltro', name: 'Botas Suela Fieltro', id: 788, parent: 'waders-botas' },
  { slug: 'botas-intercambiables', name: 'Botas Suela Intercambiable', id: 789, parent: 'waders-botas' },
  { slug: 'accesorios-vadeo', name: 'Accesorios de Vadeo', id: 790, parent: 'waders-botas' },

  // === ROPA TÉCNICA (726) ===
  { slug: 'chaquetas-impermeables', name: 'Chaquetas Impermeables', id: 791, parent: 'ropa-tecnica' },
  { slug: 'capas-intermedias', name: 'Capas Intermedias', id: 792, parent: 'ropa-tecnica' },
  { slug: 'capas-base', name: 'Capas Base', id: 793, parent: 'ropa-tecnica' },
  { slug: 'ropa-uv', name: 'Ropa con Filtro UV', id: 794, parent: 'ropa-tecnica' },
  { slug: 'pantalones-shorts', name: 'Pantalones y Shorts', id: 795, parent: 'ropa-tecnica' },
  { slug: 'gorros-jockeys', name: 'Gorros y Jockeys', id: 796, parent: 'ropa-tecnica' },
  { slug: 'bandanas', name: 'Bandanas', id: 797, parent: 'ropa-tecnica' },
  { slug: 'lentes-polarizados-ropa', name: 'Lentes Polarizados', id: 798, parent: 'ropa-tecnica' },
  { slug: 'guantes', name: 'Guantes', id: 799, parent: 'ropa-tecnica' },
  { slug: 'calcetines-tecnicos', name: 'Calcetines Técnicos', id: 800, parent: 'ropa-tecnica' },

  // === MOCHILAS & EQUIPAMIENTO (727) ===
  { slug: 'mochilas-packs-pesca', name: 'Mochilas de Pesca', id: 801, parent: 'mochilas-equipamiento' },
  { slug: 'chest-sling-hip-packs', name: 'Chest/Sling/Hip Packs', id: 802, parent: 'mochilas-equipamiento' },
  { slug: 'bolsos-duffels', name: 'Bolsos y Duffels', id: 803, parent: 'mochilas-equipamiento' },

  // === OUTDOOR & CAMPING (728) ===
  { slug: 'hidratacion', name: 'Hidratación y Termos', id: 804, parent: 'outdoor-camping' },
  { slug: 'neveras-coolers', name: 'Neveras y Coolers', id: 805, parent: 'outdoor-camping' },
  { slug: 'iluminacion', name: 'Iluminación', id: 806, parent: 'outdoor-camping' },
  { slug: 'cocina-campamento', name: 'Cocina y Campamento', id: 807, parent: 'outdoor-camping' },
  { slug: 'descanso-sacos', name: 'Descanso y Sacos', id: 808, parent: 'outdoor-camping' },
  { slug: 'herramientas-cuchillos', name: 'Herramientas y Cuchillos', id: 809, parent: 'outdoor-camping' },
  { slug: 'calzado-outdoor', name: 'Calzado Outdoor', id: 810, parent: 'outdoor-camping' },

  // === EMBARCACIONES (729) ===
  { slug: 'float-tubes-embarcaciones-flotacion', name: 'Float Tubes', id: 814, parent: 'embarcaciones-flotacion' },
  { slug: 'tablas-sup-sub', name: 'SUP y Kayak', id: 815, parent: 'embarcaciones-flotacion' },

  // === ATADO DE MOSCAS (634) ===
  { slug: 'prensas-herramientas', name: 'Prensas y Herramientas', id: 774, parent: 'atado-de-moscas' },
  { slug: 'anzuelos-atado', name: 'Anzuelos', id: 775, parent: 'atado-de-moscas' },
  { slug: 'plumas-atado', name: 'Plumas', id: 776, parent: 'atado-de-moscas' },
  { slug: 'pelos-naturales-cueros', name: 'Pelos y Cueros', id: 777, parent: 'atado-de-moscas' },
  { slug: 'sinteticos-flash', name: 'Sintéticos y Flash', id: 778, parent: 'atado-de-moscas' },
  { slug: 'dubbings', name: 'Dubbings', id: 779, parent: 'atado-de-moscas' },
  { slug: 'cuerpos-ribbing-tinsel', name: 'Cuerpos, Ribbing y Tinsel', id: 780, parent: 'atado-de-moscas' },
  { slug: 'ojos-cabezas', name: 'Ojos y Cabezas', id: 781, parent: 'atado-de-moscas' },
  { slug: 'hilos-floss', name: 'Hilos y Floss', id: 782, parent: 'atado-de-moscas' },
  { slug: 'pegamentos-barnices-resinas', name: 'Pegamentos y Resinas', id: 783, parent: 'atado-de-moscas' },
  { slug: 'kits-packs-atado', name: 'Kits y Packs de Atado', id: 784, parent: 'atado-de-moscas' },

  // === OFERTAS (730) ===
  { slug: 'ofertas-temporada', name: 'Ofertas de Temporada', id: 816, parent: 'ofertas' },
  { slug: 'outlet', name: 'Outlet', id: 817, parent: 'ofertas' },
]

// Categorías principales para mostrar en filtros
const MAIN_CATEGORIES = CATEGORIES.filter(c => c.parent === null)

// Función para obtener subcategorías de una categoría
const getSubcategories = (parentSlug: string) => {
  return CATEGORIES.filter(c => c.parent === parentSlug)
}

export function TiendaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [activeFilters, setActiveFilters] = useState<FilterState>({})
  const productsPerPage = 24

  const categorySlug = searchParams.get('categoria')
  const searchQuery = searchParams.get('buscar')
  const currentCategory = CATEGORIES.find(c => c.slug === categorySlug)

  // Obtener categoría padre si estamos en una subcategoría
  const parentCategory = useMemo(() => {
    if (currentCategory && currentCategory.parent) {
      return CATEGORIES.find(c => c.slug === currentCategory.parent)
    }
    return null
  }, [currentCategory])

  // Verificar si hay filtros disponibles para esta categoría
  const hasFilters = useMemo(() => {
    if (currentCategory) {
      if (CATEGORY_FILTERS[currentCategory.id]) return true
      if (parentCategory && PARENT_CATEGORY_FILTERS[parentCategory.id]) return true
    }
    return false
  }, [currentCategory, parentCategory])

  // Determinar qué filtros mostrar
  const getContextualFilters = () => {
    // Si no hay categoría seleccionada, mostrar categorías principales
    if (!categorySlug) {
      return MAIN_CATEGORIES.map(c => ({ slug: c.slug, name: c.name }))
    }

    // Si estamos en una categoría principal, mostrar sus subcategorías
    if (currentCategory && currentCategory.parent === null) {
      const subcats = getSubcategories(currentCategory.slug)
      return [
        { slug: currentCategory.slug, name: 'Ver todo' },
        ...subcats.map(c => ({ slug: c.slug, name: c.name }))
      ]
    }

    // Si estamos en una subcategoría, mostrar:
    // 1. Link a la categoría padre
    // 2. Sus hermanas (otras subcategorías del mismo padre)
    // 3. Sus sub-subcategorías si las tiene
    if (currentCategory && currentCategory.parent !== null) {
      const parentCategory = CATEGORIES.find(c => c.slug === currentCategory.parent)
      const siblings = parentCategory ? getSubcategories(parentCategory.slug) : []
      const children = getSubcategories(currentCategory.slug)

      // Si tiene sub-subcategorías, mostrarlas
      if (children.length > 0) {
        return [
          { slug: currentCategory.slug, name: 'Ver todo' },
          ...children.map(c => ({ slug: c.slug, name: c.name }))
        ]
      }

      // Si no, mostrar las hermanas
      return [
        { slug: parentCategory?.slug || null, name: parentCategory?.name || 'Ver todo' },
        ...siblings.map(c => ({ slug: c.slug, name: c.name }))
      ]
    }

    return MAIN_CATEGORIES.map(c => ({ slug: c.slug, name: c.name }))
  }

  const contextualFilters = getContextualFilters()

  // Fetch products from WooCommerce
  useEffect(() => {
    const fetchProducts = async () => {
      // Solo mostrar loading completo si no hay productos
      if (products.length === 0) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }
      setError(null)

      try {
        const params: Record<string, unknown> = {
          per_page: productsPerPage,
          page: currentPage,
          orderby: 'date',
          order: 'desc',
          status: 'publish',
        }

        // Add category filter if selected
        if (currentCategory) {
          params.category = currentCategory.id
        }

        // Add search filter if provided
        if (searchQuery) {
          params.search = searchQuery
        }

        // Add attribute filters
        Object.entries(activeFilters).forEach(([attrSlug, values]) => {
          if (values.length > 0) {
            // WooCommerce usa el formato: attribute=pa_slug&attribute_term=term1,term2
            params[`attribute`] = attrSlug
            params[`attribute_term`] = values.join(',')
          }
        })

        const data: WooProduct[] = await wooCommerceAPI.getProducts(params)
        const mappedProducts = data.map(mapWooProductToProduct)
        setProducts(mappedProducts)

        // Track view item list
        if (mappedProducts.length > 0) {
          const listName = searchQuery
            ? `Búsqueda: ${searchQuery}`
            : currentCategory
            ? currentCategory.name
            : 'Todos los productos'

          trackViewItemList({
            item_list_name: listName,
            item_list_id: currentCategory?.slug || 'all',
            items: mappedProducts.map((product, index) => ({
              item_id: product.id.toString(),
              item_name: product.name,
              item_category: product.categories?.[0] || 'sin-categoria',
              price: product.price,
              index,
            })),
          })
        }

        // For total count, we need to make an additional request
        // WooCommerce returns total in headers, but we'll estimate for now
        if (data.length === productsPerPage) {
          setTotalProducts(productsPerPage * 10) // Estimate
        } else {
          setTotalProducts((currentPage - 1) * productsPerPage + data.length)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Error al cargar los productos. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    }

    fetchProducts()
  }, [categorySlug, searchQuery, currentPage, currentCategory, activeFilters])

  // Reset page and filters when category or search changes
  useEffect(() => {
    setCurrentPage(1)
    setActiveFilters({}) // Limpiar filtros al cambiar de categoría
  }, [categorySlug, searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters])

  // Handler para cambio de filtros
  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters)
  }

  // Contar filtros activos
  const activeFilterCount = Object.values(activeFilters).flat().length

  const totalPages = Math.ceil(totalProducts / productsPerPage)
  const title = searchQuery
    ? `Resultados para "${searchQuery}"`
    : currentCategory
      ? currentCategory.name
      : 'Todos los Productos'

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      setSearchParams({ categoria: slug })
    } else {
      setSearchParams({})
    }
  }

  // Loading con animación bonita
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-12">
          {/* Animación de carga central */}
          <div className="flex flex-col items-center justify-center py-20">
            {/* Icono de pez animado */}
            <div className="relative mb-6">
              <svg
                viewBox="0 0 64 64"
                className="w-20 h-20 text-[#FE6A00] animate-swim"
              >
                <path
                  fill="currentColor"
                  d="M48 32c0-8-12-16-24-16S4 24 4 32s8 16 20 16 24-8 24-16zm-28-4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                />
                <path
                  fill="currentColor"
                  d="M52 20c4 4 8 8 8 12s-4 8-8 12c0-4-2-8-4-12 2-4 4-8 4-12z"
                  className="animate-tail"
                />
              </svg>
              {/* Burbujas */}
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-200 rounded-full animate-bubble-1"></div>
              <div className="absolute top-0 -left-4 w-2 h-2 bg-blue-300 rounded-full animate-bubble-2"></div>
              <div className="absolute -top-4 left-0 w-2 h-2 bg-blue-200 rounded-full animate-bubble-3"></div>
            </div>

            <p className="text-gray-600 font-medium mb-2">Cargando productos</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#FE6A00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#FE6A00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#FE6A00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>

          {/* Skeleton grid debajo */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 opacity-30">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // SEO metadata
  const seoTitle = currentCategory
    ? `${currentCategory.name} | Tienda de Pesca | Planeta Outdoor`
    : searchQuery
    ? `Resultados de "${searchQuery}" | Planeta Outdoor`
    : 'Tienda de Pesca y Outdoor | Planeta Outdoor Chile'

  const seoDescription = currentCategory
    ? `Compra ${currentCategory.name} de las mejores marcas. Waders, cañas, carretes, moscas y más. Envíos a todo Chile. Asesoría experta desde Temuco.`
    : 'Tienda especializada en pesca con mosca y equipamiento outdoor. Waders Patagonia, cañas, carretes, moscas, accesorios. Envío gratis sobre $50.000.'

  const canonicalUrl = currentCategory
    ? `https://planetaoutdoor.cl/tienda?categoria=${currentCategory.slug}`
    : 'https://planetaoutdoor.cl/tienda'

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="Planeta Outdoor" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

    <div className="min-h-screen bg-white">
      {/* Header - Estilo Wild Lama */}
      <div className="bg-white pt-8 pb-6 md:pt-12 md:pb-8 border-b border-gray-100">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-400">
            <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link to="/tienda" className="hover:text-black transition-colors">Tienda</Link>
            {currentCategory && (
              <>
                <ChevronRight size={14} />
                <span className="text-black">{currentCategory.name}</span>
              </>
            )}
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Filtros contextuales - Subcategorías de la categoría actual */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
          {/* Horizontal scroll */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 md:gap-3 py-3 md:py-4 min-w-max md:min-w-0 md:flex-wrap">
              {/* Botón para volver: a categoría padre si es subcategoría, o a todas si es principal */}
              {categorySlug && (() => {
                // Determinar a dónde volver
                const backTarget = currentCategory?.parent
                  ? CATEGORIES.find(c => c.slug === currentCategory.parent)
                  : null
                const backLabel = backTarget ? backTarget.name : 'Todas'
                const backSlug = backTarget?.slug || null

                return (
                  <button
                    onClick={() => handleCategoryChange(backSlug)}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black flex items-center gap-1"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    {backLabel}
                  </button>
                )
              })()}
              {contextualFilters.map((filter) => (
                <button
                  key={filter.slug || 'all'}
                  onClick={() => handleCategoryChange(filter.slug)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                    categorySlug === filter.slug
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Banner para Neveras HOSH - Estilo Patagonia */}
      {categorySlug === 'neveras-coolers' && (
        <div className="bg-black py-10 md:py-16">
          <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Video */}
              <div className="relative overflow-hidden aspect-video">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  webkit-playsinline="true"
                  preload="metadata"
                  className="w-full h-full object-cover"
                  src="https://res.cloudinary.com/doudjiatu/video/upload/v1765714557/VID-20240718-WA0023_wlhvoj.mp4"
                />
              </div>
              {/* Contenido */}
              <div className="text-white">
                <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#FE6A00] font-medium mb-4">
                  Exclusivo en Planeta Outdoor
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight">
                  Neveras HOSH
                </h2>
                <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                  Mantén tus capturas y provisiones en perfectas condiciones. Neveras de alta resistencia diseñadas para las condiciones más exigentes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 border border-white/20 text-sm text-white/80">Aislamiento Premium</span>
                  <span className="px-4 py-2 border border-white/20 text-sm text-white/80">Ultra Resistentes</span>
                  <span className="px-4 py-2 border border-white/20 text-sm text-white/80">Hielo por días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-10 md:py-12">
        {/* Filtros activos (badges) y botón mobile */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Botón de filtros mobile - solo visible en pantallas pequeñas */}
          {hasFilters && (
            <div className="lg:hidden">
              <ProductFilters
                categoryId={currentCategory?.id || null}
                parentCategoryId={parentCategory?.id || null}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                variant="mobile"
              />
            </div>
          )}

          {/* Badges de filtros activos */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(activeFilters).map(([attrSlug, values]) =>
                values.map((value) => (
                  <span
                    key={`${attrSlug}-${value}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {value.replace(/-/g, ' ')}
                    <button
                      onClick={() => {
                        const newValues = activeFilters[attrSlug].filter(v => v !== value)
                        const newFilters = { ...activeFilters }
                        if (newValues.length === 0) {
                          delete newFilters[attrSlug]
                        } else {
                          newFilters[attrSlug] = newValues
                        }
                        handleFilterChange(newFilters)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
              <button
                onClick={() => handleFilterChange({})}
                className="text-xs text-[#FE6A00] hover:text-[#e55f00] font-medium"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* Layout con sidebar */}
        <div className={`flex gap-8 ${hasFilters ? 'lg:flex-row' : ''}`}>
          {/* Sidebar de filtros - Desktop */}
          {hasFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  categoryId={currentCategory?.id || null}
                  parentCategoryId={parentCategory?.id || null}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  variant="desktop"
                />
              </div>
            </aside>
          )}

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Product count */}
            <p className="text-sm text-gray-400 mb-8">
              {products.length} productos{activeFilterCount > 0 ? ` (${activeFilterCount} filtros activos)` : ''}
            </p>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-[#f46d47] border-b-2 border-[#f46d47] pb-0.5 hover:text-black hover:border-black transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* No Products State - Estilo Outdoor */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            {/* Icono de pesca/outdoor */}
            <div className="mb-8">
              <svg
                viewBox="0 0 120 120"
                className="w-32 h-32 mx-auto text-gray-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* Montaña */}
                <path d="M10 90 L40 40 L55 60 L70 35 L110 90 Z" fill="currentColor" opacity="0.3" />
                {/* Caña de pescar */}
                <path d="M85 25 Q95 30 100 50 L102 80" strokeLinecap="round" strokeWidth="2.5" />
                <circle cx="102" cy="85" r="3" fill="currentColor" />
                {/* Línea de pesca */}
                <path d="M100 50 Q90 60 85 75" strokeDasharray="3 3" strokeWidth="1.5" />
                {/* Sol */}
                <circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.4" />
                <path d="M25 12 L25 8 M25 42 L25 38 M12 25 L8 25 M42 25 L38 25 M16 16 L13 13 M37 37 L34 34 M16 34 L13 37 M37 16 L34 13" strokeWidth="2" opacity="0.4" />
                {/* Pez pequeño */}
                <ellipse cx="75" cy="95" rx="8" ry="4" fill="currentColor" opacity="0.2" />
                <path d="M83 95 L88 92 L88 98 Z" fill="currentColor" opacity="0.2" />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-gray-700 mb-3">
              {currentCategory ? `Sin productos en ${currentCategory.name}` : 'No hay productos'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {currentCategory
                ? 'Esta categoría aún no tiene productos disponibles. Pronto agregaremos más opciones para ti.'
                : 'No encontramos productos que coincidan con tu búsqueda.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tienda"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE6A00] text-white font-medium rounded-full hover:bg-[#e55f00] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 12h18M3 12l6-6M3 12l6 6" />
                </svg>
                Ver todos los productos
              </Link>
              <Link
                to="/contacto"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                ¿Necesitas ayuda? Contáctanos
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid - Estilo Wild Lama */}
        {products.length > 0 && (
          <div className={`relative transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
            {/* Loading overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 flex items-start justify-center pt-20 z-10">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Cargando...</span>
                </div>
              </div>
            )}
            <div className={`grid grid-cols-2 md:grid-cols-3 ${hasFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-x-6 gap-y-10 md:gap-y-12`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Pagination - Estilo Wild Lama */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-100">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
              >
                ← Anterior
              </button>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'text-black border-b-2 border-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
              >
                Siguiente →
              </button>
            )}
          </div>
        )}
          </div>{/* Cierre de flex-1 min-w-0 (contenido principal) */}
        </div>{/* Cierre de flex gap-8 (layout con sidebar) */}
      </div>
    </div>
    </>
  )
}
