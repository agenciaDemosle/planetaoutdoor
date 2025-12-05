import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import { wordpressAPI, BlogPost } from '../../api/wordpress'
import { MOCKUP_POSTS } from '../../data/mockupPosts'

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await wordpressAPI.getPosts({ per_page: 3 })
        if (data.posts.length > 0) {
          setPosts(data.posts)
        } else {
          setPosts(MOCKUP_POSTS.slice(0, 3))
        }
      } catch {
        setPosts(MOCKUP_POSTS.slice(0, 3))
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Fallback: activar después de un breve delay
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <section className="relative">
        <div className="relative min-h-[800px]">
          <img src="/images/web/pesca-familia.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-8 w-64 bg-white/20 animate-pulse mx-auto mb-4 rounded" />
              <div className="h-4 w-48 bg-white/20 animate-pulse mx-auto mb-12 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-white/20 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-white/20 animate-pulse w-1/3 rounded" />
                      <div className="h-6 bg-white/20 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const displayPosts = posts.slice(0, 3)

  return (
    <section ref={sectionRef} className="relative">
      {/* Contenedor con imagen de fondo */}
      <div className="relative min-h-[900px] md:min-h-[950px] lg:min-h-[1000px]">
        {/* Imagen de fondo full */}
        <img
          src="/images/web/pesca-familia.jpg"
          alt="Padre pescando con su hijo en un lago"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-black/50" />

        {/* SVG diagonal en la parte superior de la foto */}
        <div className="absolute top-0 left-0 right-0 w-full z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            {/* Forma diagonal - de izquierda abajo a derecha arriba */}
            <path d="M0 0H1440V0L1440 20L0 120V0Z" fill="white" />
          </svg>
        </div>

        {/* Gradiente crema sutil abajo para mezclarse con el separador */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245, 243, 240, 0.6) 100%)'
          }}
        />

        {/* Contenido */}
        <div className="relative z-10 py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header centrado */}
            <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FE6A00] mb-3">
                Nuestro Blog
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Historias del Río
              </h2>
              <p className="mt-4 text-white/70 max-w-2xl mx-auto">
                Consejos, técnicas y aventuras de pesca con mosca en el sur de Chile
              </p>
            </div>

            {/* Grid de tarjetas - 3 columnas desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Badge de categoría */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                        {post.categories?.[0]?.name || 'Pesca'}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 md:p-6 relative">
                    {/* Icono decorativo */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#FE6A00] rounded-full flex items-center justify-center shadow-lg">
                      <BookOpen size={18} className="text-white" />
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 mt-3">
                      <span>{formatDate(post.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime} min
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#FE6A00] transition-colors duration-300">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-[#FE6A00] transition-colors duration-300">
                      Leer artículo
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Ver más */}
            <div className="mt-10 md:mt-14 pb-20 md:pb-28 lg:pb-32 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-[#FE6A00] hover:text-white transition-colors duration-300"
              >
                Ver todos los artículos
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
