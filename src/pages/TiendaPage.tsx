import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { wooCommerceAPI } from '../api/woocommerce'
import { WooProduct, Product, mapWooProductToProduct } from '../types/product'
import { ProductCard } from '../components/product/ProductCard/ProductCard'

// Categorías reales de WooCommerce (IDs verificados desde la API)
const CATEGORIES = [
  // Categorías principales
  { slug: 'equipo-de-pesca', name: 'Equipo de Pesca', id: 630, parent: null },
  { slug: 'accesorios-de-pesca', name: 'Accesorios de Pesca', id: 228, parent: null },
  { slug: 'outdoors-inicio', name: 'Outdoors', id: 96, parent: null },

  // Subcategorías de Equipo de Pesca (630)
  { slug: 'canas', name: 'Cañas', id: 631, parent: 'equipo-de-pesca' },
  { slug: 'carretes', name: 'Carretes', id: 636, parent: 'equipo-de-pesca' },
  { slug: 'lineas', name: 'Líneas', id: 637, parent: 'equipo-de-pesca' },
  { slug: 'leaders', name: 'Leaders', id: 635, parent: 'equipo-de-pesca' },
  { slug: 'moscas', name: 'Moscas', id: 633, parent: 'equipo-de-pesca' },
  { slug: 'atado-de-moscas', name: 'Atado de Moscas', id: 634, parent: 'equipo-de-pesca' },
  { slug: 'senuelos', name: 'Señuelos', id: 632, parent: 'equipo-de-pesca' },
  { slug: 'waders', name: 'Waders', id: 638, parent: 'equipo-de-pesca' },
  { slug: 'botas', name: 'Botas', id: 639, parent: 'equipo-de-pesca' },
  { slug: 'cajas', name: 'Cajas', id: 641, parent: 'equipo-de-pesca' },
  { slug: 'gorros', name: 'Gorros', id: 119, parent: 'equipo-de-pesca' },
  { slug: 'chaquetas', name: 'Chaquetas', id: 231, parent: 'equipo-de-pesca' },
  { slug: 'poleras-uv', name: 'Poleras UV y Camisas', id: 413, parent: 'equipo-de-pesca' },
  { slug: 'chalecos-y-bolsos', name: 'Chalecos y Bolsos', id: 230, parent: 'equipo-de-pesca' },
  { slug: 'chinguillos', name: 'Chinguillos', id: 123, parent: 'equipo-de-pesca' },
  { slug: 'accesorios', name: 'Accesorios', id: 133, parent: 'equipo-de-pesca' },
  { slug: 'nylon-y-multifilamento', name: 'Nylon y Multifilamento', id: 417, parent: 'equipo-de-pesca' },
  { slug: 'float-tubes', name: 'Float Tubes', id: 499, parent: 'equipo-de-pesca' },

  // Subcategorías de Accesorios de Pesca (228)
  { slug: 'infaltables', name: 'Infaltables', id: 232, parent: 'accesorios-de-pesca' },
  { slug: 'gafas-y-straps', name: 'Gafas y Straps', id: 473, parent: 'accesorios-de-pesca' },
  { slug: 'zapatos', name: 'Zapatos', id: 511, parent: 'accesorios-de-pesca' },
  { slug: 'flashers-y-parabans', name: 'Flashers y Parabans', id: 453, parent: 'accesorios-de-pesca' },
  { slug: 'vestuario', name: 'Vestuario', id: 669, parent: 'accesorios-de-pesca' },
  { slug: 'stickers', name: 'Stickers', id: 694, parent: 'accesorios-de-pesca' },
  { slug: 'gearaid', name: 'Gearaid', id: 379, parent: 'accesorios-de-pesca' },

  // Subcategorías de Outdoors (96)
  { slug: 'termos-outdoors-inicio', name: 'Termos', id: 122, parent: 'outdoors-inicio' },
  { slug: 'coolers', name: 'Coolers', id: 157, parent: 'outdoors-inicio' },
  { slug: 'calzado', name: 'Calzado', id: 221, parent: 'outdoors-inicio' },
  { slug: 'carpas-y-sacos', name: 'Carpas y Sacos', id: 501, parent: 'outdoors-inicio' },
  { slug: 'cocinillas', name: 'Cocinillas', id: 500, parent: 'outdoors-inicio' },
  { slug: 'actividades-acuaticas', name: 'Actividades Acuáticas', id: 698, parent: 'outdoors-inicio' },
]

// Categorías principales para mostrar en filtros
const MAIN_CATEGORIES = CATEGORIES.filter(c => c.parent === null)

export function TiendaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const productsPerPage = 24

  const categorySlug = searchParams.get('categoria')
  const searchQuery = searchParams.get('buscar')
  const currentCategory = CATEGORIES.find(c => c.slug === categorySlug)

  // Fetch products from WooCommerce
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
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

        const data: WooProduct[] = await wooCommerceAPI.getProducts(params)
        const mappedProducts = data.map(mapWooProductToProduct)
        setProducts(mappedProducts)

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
      }
    }

    fetchProducts()
  }, [categorySlug, searchQuery, currentPage, currentCategory])

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [categorySlug, searchQuery])

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
    setShowFilters(false)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-100 w-48 mb-4"></div>
            <div className="h-4 bg-gray-100 w-24 mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-gray-100 mb-4"></div>
                  <div className="h-3 bg-gray-100 w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 mb-2"></div>
                  <div className="h-4 bg-gray-100 w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filtrar subcategorías según la categoría principal seleccionada
  const getSubcategoriesForCategory = (parentSlug: string | null) => {
    return CATEGORIES.filter(c => c.parent === parentSlug)
  }

  const currentSubcategories = currentCategory
    ? getSubcategoriesForCategory(currentCategory.slug)
    : []

  return (
    <div className="min-h-screen bg-white">
      {/* Subcategorías como lista de texto - Estilo Wild Lama */}
      {currentCategory && currentSubcategories.length > 0 && (
        <div className="border-b border-gray-100 bg-white">
          <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                to={`/tienda?categoria=${currentCategory.slug}`}
                className="text-sm font-medium text-black hover:text-[#f46d47] transition-colors"
              >
                Ver todo
              </Link>
              <span className="text-gray-300">|</span>
              {currentSubcategories.map((subcat, index) => (
                <span key={subcat.slug} className="flex items-center gap-x-6">
                  <Link
                    to={`/tienda?categoria=${subcat.slug}`}
                    className={`text-sm transition-colors ${
                      categorySlug === subcat.slug
                        ? 'text-black font-medium'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {subcat.name}
                  </Link>
                  {index < currentSubcategories.length - 1 && (
                    <span className="text-gray-300 hidden md:inline">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Filters bar - Estilo Wild Lama */}
      <div className="border-b border-gray-100 bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            {/* Category filters */}
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`text-sm font-medium whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  !categorySlug
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-black'
                }`}
              >
                Todos
              </button>
              {MAIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`text-sm font-medium whitespace-nowrap pb-1 border-b-2 transition-colors ${
                    categorySlug === cat.slug
                      ? 'text-black border-black'
                      : 'text-gray-400 border-transparent hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              Filtrar
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Subcategorías</p>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.filter(c => c.parent === categorySlug || (!categorySlug && c.parent !== null)).slice(0, 12).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-10 md:py-12">
        {/* Product count */}
        <p className="text-sm text-gray-400 mb-8">
          {products.length} productos
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

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-6">No se encontraron productos</p>
            <Link
              to="/tienda"
              className="text-sm font-medium text-[#f46d47] border-b-2 border-[#f46d47] pb-0.5 hover:text-black hover:border-black transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        )}

        {/* Products Grid - Estilo Wild Lama */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
      </div>
    </div>
  )
}
