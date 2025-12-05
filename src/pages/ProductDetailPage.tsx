import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useProductBySlug } from '../hooks/useProducts'
import { FishingLoader } from '../components/common/FishingLoader'
import { Badge } from '../components/common/Badge'
import { env } from '../config/env'

// Decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Strip HTML tags for plain text
function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProductBySlug(slug || '')
  const [selectedImage, setSelectedImage] = useState(0)

  // Extract video URL and clean description
  const { videoUrl, cleanDescription } = useMemo(() => {
    if (!product?.description) return { videoUrl: null, cleanDescription: '' }

    const desc = product.description

    // Find video URL
    const videoMatch = desc.match(/src="(https?:\/\/[^"]+\.mp4[^"]*)"/i)
    const videoUrl = videoMatch ? videoMatch[1].replace(/\?_=\d+$/, '') : null

    // Clean description: remove video section but keep rest
    let cleanDesc = desc
      // Remove IE conditional comments
      .replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '')
      // Remove the section containing the video
      .replace(/<section[^>]*>[\s\S]*?<div[^>]*class="wp-video"[\s\S]*?<\/div>[\s\S]*?<\/section>/gi, '')
      // Remove standalone wp-video divs
      .replace(/<div[^>]*class="wp-video"[^>]*>[\s\S]*?<\/div>/gi, '')
      // Remove empty sections
      .replace(/<section[^>]*>\s*<\/section>/gi, '')
      // Remove stray <br> tags
      .replace(/<br\s*\/?>/gi, '')

    return { videoUrl, cleanDescription: cleanDesc }
  }, [product?.description])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FishingLoader message="Buscando producto..." size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-24 text-text-muted">
        Producto no encontrado
      </div>
    )
  }

  // Debug: log descriptions
  console.log('Short Description:', product.shortDescription?.substring(0, 200))
  console.log('Description:', product.description?.substring(0, 200))

  // Get plain text for meta description
  const metaDescription = stripHtml(product.shortDescription || product.description || '')

  return (
    <>
      <Helmet>
        <title>{decodeHtmlEntities(product.name)} | {env.site.name}</title>
        <meta name="description" content={metaDescription.slice(0, 160)} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {product.onSale && <Badge variant="success">Oferta</Badge>}
              {product.categories.map((cat) => (
                <Badge key={cat.id}>{cat.name}</Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
              {decodeHtmlEntities(product.name)}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.onSale && product.regularPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>

            {/* Short description - rendered as HTML */}
            {product.shortDescription && (
              <div
                className="text-gray-600 mb-6 [&>p]:mb-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Stock status */}
            <div className="mb-6">
              {product.stockStatus === 'instock' ? (
                <span className="text-green-600 font-medium">En stock</span>
              ) : (
                <span className="text-red-600 font-medium">Agotado</span>
              )}
            </div>

            {/* Add to cart button */}
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors font-medium"
              disabled={product.stockStatus !== 'instock'}
            >
              <ShoppingCart className="h-5 w-5" />
              Agregar al carrito
            </button>
          </div>
        </div>

        {/* Video section */}
        {videoUrl && (
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Video del producto</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-lg">
                <video
                  className="w-full h-full object-contain"
                  controls
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
              </div>
            </div>
          </div>
        )}

        {/* Full description */}
        {cleanDescription && cleanDescription.trim() && (
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Descripción del producto</h2>
            <div
              className="prose prose-lg max-w-none product-description"
              dangerouslySetInnerHTML={{ __html: cleanDescription }}
            />
          </div>
        )}
      </div>
    </>
  )
}
