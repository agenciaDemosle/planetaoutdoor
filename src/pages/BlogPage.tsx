import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { wordpressAPI, BlogPost, WPCategory } from '../api/wordpress'
import { MOCKUP_POSTS, MOCKUP_CATEGORIES } from '../data/mockupPosts'

export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<WPCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [, setUsingMockup] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1')
  const currentCategory = searchParams.get('categoria')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postsData, categoriesData] = await Promise.all([
          wordpressAPI.getPosts({
            page: currentPage,
            per_page: 12,
            categories: currentCategory ? parseInt(currentCategory) : undefined,
          }),
          wordpressAPI.getCategories(),
        ])

        if (postsData.posts.length === 0) {
          setUsingMockup(true)
          let filteredPosts = MOCKUP_POSTS
          if (currentCategory) {
            filteredPosts = MOCKUP_POSTS.filter(p =>
              p.categories.some(c => c.id.toString() === currentCategory)
            )
          }
          setPosts(filteredPosts)
          setTotalPages(1)
          setCategories(MOCKUP_CATEGORIES as WPCategory[])
        } else {
          setUsingMockup(false)
          setPosts(postsData.posts)
          setTotalPages(postsData.totalPages)
          setCategories(categoriesData.filter(cat => cat.count > 0))
        }
      } catch {
        setUsingMockup(true)
        setPosts(MOCKUP_POSTS)
        setTotalPages(1)
        setCategories(MOCKUP_CATEGORIES as WPCategory[])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, currentCategory])

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId) {
      setSearchParams({ categoria: categoryId.toString() })
    } else {
      setSearchParams({})
    }
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const selectedCategory = currentCategory
    ? categories.find(c => c.id.toString() === currentCategory)
    : null

  const seoTitle = selectedCategory
    ? `${selectedCategory.name} | Blog Planeta Outdoor`
    : 'Blog de Pesca con Mosca y Outdoor | Planeta Outdoor'

  const seoDescription = selectedCategory
    ? `Artículos sobre ${selectedCategory.name.toLowerCase()} en Planeta Outdoor. Tips, guías y consejos para pescadores.`
    : 'Blog sobre pesca con mosca, técnicas, destinos y equipamiento outdoor. Consejos de expertos, guías de ríos en Chile y novedades del mundo de la pesca.'

  // Separar el primer post destacado del resto
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://planetaoutdoor.cl/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://planetaoutdoor.cl/blog" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Equipo-de-Pesca.jpg" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="Planeta Outdoor" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

    <div className="min-h-screen bg-white">
      {/* Hero Section - Estilo Patagonia minimalista */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#FE6A00] mb-4">
            Historias del Río
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl font-light">
            Consejos, técnicas y aventuras de pesca con mosca en el sur de Chile
          </p>
        </div>
      </div>

      {/* Categories Filter - Estilo Patagonia */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                !currentCategory
                  ? 'text-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  currentCategory === category.id.toString()
                    ? 'text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        {/* Loading State */}
        {loading && (
          <div className="space-y-16">
            {/* Featured skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="flex flex-col justify-center space-y-4">
                <div className="h-4 bg-gray-100 animate-pulse w-1/4" />
                <div className="h-10 bg-gray-100 animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 animate-pulse w-2/3" />
              </div>
            </div>
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                  <div className="h-4 bg-gray-100 animate-pulse w-1/4" />
                  <div className="h-6 bg-gray-100 animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Post - Estilo Patagonia */}
        {!loading && featuredPost && (
          <div className="mb-16 pb-16 border-b border-gray-200">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                {featuredPost.imageUrl ? (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-300">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="lg:py-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FE6A00] mb-4">
                  {featuredPost.categories?.[0]?.name || 'Artículo destacado'}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-black mb-4 leading-tight group-hover:text-[#FE6A00] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {formatDate(featuredPost.date)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-black group-hover:text-[#FE6A00] transition-colors">
                    Leer artículo
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts Grid - Estilo Patagonia */}
        {!loading && remainingPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {remainingPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-5">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-300 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Category */}
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#FE6A00] mb-2">
                  {post.categories?.[0]?.name || 'Pesca'}
                </p>

                {/* Title */}
                <h2 className="text-lg font-medium text-black mb-3 leading-snug line-clamp-2 group-hover:text-[#FE6A00] transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                {/* Date & Read More */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {formatDate(post.date)}
                  </span>
                  <span className="font-medium text-black group-hover:text-[#FE6A00] transition-colors flex items-center gap-1">
                    Leer
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">No se encontraron artículos</p>
            <button
              onClick={() => setSearchParams({})}
              className="text-sm font-medium text-[#FE6A00] hover:text-black transition-colors"
            >
              Ver todos los artículos
            </button>
          </div>
        )}

        {/* Pagination - Estilo Patagonia */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-12 border-t border-gray-200">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
              >
                ← Anterior
              </button>
            )}

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'text-white bg-black'
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
              >
                Siguiente →
              </button>
            )}
          </div>
        )}
      </div>

    </div>
    </>
  )
}
