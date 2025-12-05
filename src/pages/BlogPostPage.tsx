import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { wordpressAPI, BlogPost } from '../api/wordpress'
import { MOCKUP_POSTS } from '../data/mockupPosts'

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {post.imageUrl && (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back Button */}
          <Link
            to="/blog"
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Volver</span>
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-10 lg:px-20 max-w-4xl mx-auto">
        <article className={post.imageUrl ? '-mt-32 relative z-10' : 'pt-12'}>
          {/* Card Header */}
          <div className={`bg-white rounded-t-2xl ${post.imageUrl ? 'p-8 md:p-12 shadow-xl' : ''}`}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
              <Link to="/" className="hover:text-black">Inicio</Link>
              <ChevronRight size={14} />
              <Link to="/blog" className="hover:text-black">Blog</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 line-clamp-1">{post.title}</span>
            </nav>

            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/blog?categoria=${cat.id}`}
                    className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full hover:bg-orange-200 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
              {/* Author */}
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="font-medium text-gray-900">{post.author.name}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime} min lectura
                </span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500 mr-2">Compartir:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Compartir en Facebook"
                >
                  <Facebook size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Compartir en Twitter"
                >
                  <Twitter size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Compartir en LinkedIn"
                >
                  <Linkedin size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copiar enlace"
                >
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className={`bg-white ${post.imageUrl ? 'px-8 md:px-12 pb-12 shadow-xl rounded-b-2xl' : 'pb-12'}`}>
            <div
              className="prose prose-lg max-w-none pt-8
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                prose-strong:text-gray-900
                prose-ul:text-gray-700 prose-ol:text-gray-700
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Artículos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 mb-4">
                    {relatedPost.imageUrl ? (
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(relatedPost.date)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-12 mb-12 bg-gray-100 rounded-2xl text-center px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Encuentra todo el equipamiento que necesitas para pesca con mosca en nuestra tienda.
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Ver productos
            <ChevronRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  )
}
