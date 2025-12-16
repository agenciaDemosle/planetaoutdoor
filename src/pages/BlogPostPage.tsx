import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronLeft, X, ZoomIn } from 'lucide-react'
import { wordpressAPI, BlogPost } from '../api/wordpress'
import { MOCKUP_POSTS } from '../data/mockupPosts'

// Componente para galería de imágenes scrolleable
function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  if (images.length === 0) return null

  // Si solo hay 1-2 imágenes, mostrar en grid simple
  if (images.length <= 2) {
    return (
      <div className={`my-8 grid gap-4 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {images.map((img, idx) => (
          <div key={idx} className="relative group cursor-pointer" onClick={() => openLightbox(idx)}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-auto rounded-xl shadow-lg object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </div>
          </div>
        ))}
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </div>
    )
  }

  return (
    <div className="my-8 -mx-4 md:-mx-8 lg:-mx-12">
      {/* Header con contador */}
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 mb-4">
        <span className="text-sm text-gray-500 font-medium">
          {images.length} imágenes
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carrusel scrolleable */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-8 lg:px-12 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-72 md:w-80 cursor-pointer group relative"
            onClick={() => openLightbox(idx)}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-52 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {idx + 1}/{images.length}
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de scroll en móvil */}
      <div className="flex justify-center gap-1 mt-2 md:hidden">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === 0 ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  )
}

// Componente Lightbox para ver imágenes a pantalla completa
function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: {
  images: { src: string; alt: string }[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Contador */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navegación izquierda */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Imagen */}
      <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>

      {/* Navegación derecha */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 bg-black/50 rounded-full">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                const diff = idx - currentIndex
                if (diff > 0) for (let i = 0; i < diff; i++) onNext()
                else for (let i = 0; i < -diff; i++) onPrev()
              }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Función para extraer imágenes del contenido HTML
function extractImagesFromContent(htmlContent: string): { src: string; alt: string }[] {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>|<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*>/g
  const images: { src: string; alt: string }[] = []
  let match

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const src = match[1] || match[4]
    const alt = match[2] || match[3] || ''
    if (src) {
      images.push({ src, alt })
    }
  }

  return images
}

// Componente que procesa el contenido y muestra galerías de forma ordenada
function BlogContentWithGallery({ content }: { content: string }) {
  // Extraer todas las imágenes del contenido
  const allImages = extractImagesFromContent(content)

  // Procesar el contenido para separar texto de imágenes
  const processContent = () => {
    // Si hay 3+ imágenes, las mostramos en una galería al final del contenido relevante
    if (allImages.length >= 3) {
      // Remover las imágenes del contenido original
      let cleanedContent = content
        // Remover párrafos que solo contienen imágenes
        .replace(/<p[^>]*>\s*(<img[^>]+>\s*)+<\/p>/g, '')
        // Remover imágenes sueltas
        .replace(/<img[^>]+class="[^"]*alignnone[^"]*"[^>]*>/g, '')
        // Limpiar párrafos vacíos
        .replace(/<p[^>]*>\s*<\/p>/g, '')
        .replace(/<p[^>]*>&nbsp;<\/p>/g, '')

      return { cleanedContent, galleryImages: allImages, showGallery: true }
    }

    return { cleanedContent: content, galleryImages: [], showGallery: false }
  }

  const { cleanedContent, galleryImages, showGallery } = processContent()

  return (
    <div className="pt-8">
      {/* Contenido de texto */}
      <div
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
          prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:my-6
          prose-strong:text-gray-900
          prose-ul:text-gray-700 prose-ol:text-gray-700
          prose-li:mb-2
        "
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />

      {/* Galería de imágenes */}
      {showGallery && galleryImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-orange-500"></span>
            Galería de imágenes
          </h3>
          <ImageGallery images={galleryImages} />
        </div>
      )}

      {/* Estilos adicionales para imágenes que no van en galería */}
      <style>{`
        .prose img {
          display: block;
          margin: 1.5rem auto;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          height: auto;
        }
        .prose img.alignnone {
          display: block;
          margin: 1.5rem auto;
        }
        .prose img.size-medium {
          max-width: 400px;
        }
        .prose img.size-large {
          max-width: 100%;
        }
        /* Ocultar scrollbar pero mantener funcionalidad */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      setLoading(true)
      try {
        const postData = await wordpressAPI.getPost(slug)

        // Si no se encuentra en WordPress, buscar en mockup
        if (!postData) {
          const mockupPost = MOCKUP_POSTS.find(p => p.slug === slug)
          if (mockupPost) {
            setPost(mockupPost)
            // Obtener posts relacionados del mockup
            const related = MOCKUP_POSTS
              .filter(p => p.id !== mockupPost.id)
              .slice(0, 3)
            setRelatedPosts(related)
          }
        } else {
          setPost(postData)
          if (postData.categories.length > 0) {
            const related = await wordpressAPI.getRelatedPosts(
              postData.id,
              postData.categories.map(c => c.id),
              3
            )
            setRelatedPosts(related)
          }
        }
      } catch (error) {
        console.error('Error fetching post, trying mockup:', error)
        // En caso de error, buscar en mockup
        const mockupPost = MOCKUP_POSTS.find(p => p.slug === slug)
        if (mockupPost) {
          setPost(mockupPost)
          const related = MOCKUP_POSTS.filter(p => p.id !== mockupPost.id).slice(0, 3)
          setRelatedPosts(related)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform: string) => {
    const title = post?.title || ''
    let url = ''

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        alert('Link copiado al portapapeles')
        return
    }

    window.open(url, '_blank', 'width=600,height=400')
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[400px] bg-gray-200 animate-pulse" />
        <div className="px-4 md:px-10 lg:px-20 max-w-4xl mx-auto py-12">
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-8 w-1/2" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Not Found
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-orange-600 hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  // SEO metadata for blog post
  const seoTitle = `${post.title} | Blog Planeta Outdoor`
  const seoDescription = post.excerpt
    ? post.excerpt.replace(/<[^>]*>/g, '').slice(0, 155)
    : `Lee ${post.title} en el blog de Planeta Outdoor. Consejos, técnicas y novedades sobre pesca con mosca y outdoor.`
  const canonicalUrl = `https://planetaoutdoor.cl/blog/${post.slug}`
  const postImage = post.imageUrl || 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp'

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={postImage} />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="Planeta Outdoor" />
        <meta property="article:published_time" content={post.date} />
        {post.categories[0] && (
          <meta property="article:section" content={post.categories[0].name} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={postImage} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": seoDescription,
            "image": postImage,
            "url": canonicalUrl,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "Planeta Outdoor"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Planeta Outdoor",
              "logo": {
                "@type": "ImageObject",
                "url": "https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp"
              }
            }
          })}
        </script>
      </Helmet>

    <div className="min-h-screen bg-white">
      {/* Hero - Estilo Patagonia */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Volver al blog</span>
          </Link>

          {/* Categories */}
          {post.categories.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FE6A00] mb-4">
              {post.categories[0].name}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime} min lectura
            </span>
            <span>Por {post.author.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {post.imageUrl && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 -mt-0">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content - Estilo Patagonia limpio */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <article>
          {/* Article Content */}
          <BlogContentWithGallery content={post.content} />

          {/* Share - Estilo Patagonia */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Compartir este artículo</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  title="Compartir en Facebook"
                >
                  <Facebook size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  title="Compartir en Twitter"
                >
                  <Twitter size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  title="Compartir en LinkedIn"
                >
                  <Linkedin size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  title="Copiar enlace"
                >
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts - Estilo Patagonia */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#FE6A00] mb-2">Seguir leyendo</h2>
            <p className="text-2xl font-light text-black mb-8">Artículos relacionados</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                    {relatedPost.imageUrl ? (
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-black group-hover:text-[#FE6A00] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    {formatDate(relatedPost.date)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA - Estilo Patagonia */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#FE6A00] mb-4">
              Equipamiento
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-white/70 mb-8">
              Encuentra todo el equipamiento que necesitas para pesca con mosca en nuestra tienda.
            </p>
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#FE6A00] text-white font-medium hover:bg-[#e55f00] transition-colors"
            >
              Ver productos
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
