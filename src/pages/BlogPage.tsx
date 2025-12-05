import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
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
      } catch (error) {
        console.error('Error fetching blog posts, using mockup:', error)
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section con imagen - Estilo Wild Lama */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/web/pescaconmosca.jpg"
          alt="Blog Planeta Outdoor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 lg:pb-20">
          <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-4 text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={14} />
              <span className="text-white">Blog</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Blog
            </h1>
          </div>
        </div>
      </div>

      {/* Categories Filter - Estilo Wild Lama */}
      <div className="border-b border-gray-100 bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`text-sm font-medium whitespace-nowrap transition-colors pb-1 border-b-2 ${
                !currentCategory
                  ? 'text-black border-black'
                  : 'text-gray-400 border-transparent hover:text-black'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`text-sm font-medium whitespace-nowrap transition-colors pb-1 border-b-2 ${
                  currentCategory === category.id.toString()
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-12 md:py-16">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 animate-pulse w-1/4" />
                <div className="h-6 bg-gray-100 animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Posts Grid - Estilo Wild Lama */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-5">
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

                {/* Date */}
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                  {formatDate(post.date)}
                </p>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-semibold text-black mb-3 leading-tight line-clamp-2 group-hover:text-[#f46d47] transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <span className="inline-block text-sm font-medium text-[#f46d47] border-b-2 border-[#f46d47] pb-0.5 group-hover:border-black group-hover:text-black transition-colors">
                  Leer más
                </span>
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
              className="text-sm font-medium text-[#f46d47] border-b-2 border-[#f46d47] pb-0.5 hover:text-black hover:border-black transition-colors"
            >
              Ver todos los artículos
            </button>
          </div>
        )}

        {/* Pagination - Estilo Wild Lama */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-100">
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
                      ? 'text-black border-b-2 border-black'
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
  )
}
