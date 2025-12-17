import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { wooCommerceAPI } from '../../api/woocommerce'
import { useCartStore } from '../../store/useCartStore'
import { useUIStore } from '../../store/useUIStore'
import { trackAddToCart } from '../../hooks/useAnalytics'
import {
  getRecommendationsForProduct,
  getCategorySlugById,
  specificProductPairings,
  RecommendationRule,
} from '../../data/productRecommendations'

interface Product {
  id: number
  name: string
  slug: string
  price: string
  images: { src: string; alt: string }[]
  categories: { id: number; slug: string }[]
  stock_status: string
}

interface CompleteYourGearProps {
  currentProduct: {
    id: number
    categories: { id: number; slug: string }[]
  }
}

export function CompleteYourGear({ currentProduct }: CompleteYourGearProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [rule, setRule] = useState<RecommendationRule | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)

  const itemsPerView = 4

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId))
  }

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true)
      try {
        const recommendationRule = getRecommendationsForProduct(
          currentProduct.categories
        )
        setRule(recommendationRule)

        const allProducts: Product[] = []

        const specificIds = specificProductPairings[currentProduct.id]
        if (specificIds && specificIds.length > 0) {
          for (const id of specificIds) {
            try {
              const product = await wooCommerceAPI.getProduct(id)
              if (product && product.id !== currentProduct.id) {
                allProducts.push(product)
              }
            } catch {
              // Producto no encontrado
            }
          }
        }

        for (const categoryId of recommendationRule.complementaryCategories) {
          const categorySlug = getCategorySlugById(categoryId)
          if (!categorySlug) continue

          try {
            const products = await wooCommerceAPI.getProducts({
              category: categoryId,
              per_page: 6,
              orderby: 'popularity',
              stock_status: 'instock',
            })

            if (Array.isArray(products)) {
              for (const product of products) {
                if (
                  product.id !== currentProduct.id &&
                  !allProducts.some((p) => p.id === product.id)
                ) {
                  allProducts.push(product)
                }
              }
            }
          } catch {
            // Categoría sin productos
          }

          if (allProducts.length >= 12) break
        }

        const shuffled = allProducts
          .sort(() => Math.random() - 0.5)
          .slice(0, 12)

        setRecommendations(shuffled)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentProduct.categories.length > 0) {
      fetchRecommendations()
    }
  }, [currentProduct.id, currentProduct.categories])

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(recommendations.length - itemsPerView, prev + 1)
    )
  }

  const handleAddToCart = (product: Product) => {
    const price = parseFloat(product.price)

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      imageUrl: product.images[0]?.src || '',
      quantity: 1,
    })

    // Track add to cart
    trackAddToCart({
      product_id: product.id.toString(),
      product_name: product.name,
      product_category: product.categories?.[0]?.name || 'sin-categoria',
      product_price: price,
      quantity: 1,
      item_list_name: 'Completa tu Equipo',
      item_list_id: 'complete_your_gear',
    })

    openCart()
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    if (isNaN(num)) return ''
    return num.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-100 rounded w-48 mb-10"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-square bg-gray-100 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Header - Estilo Patagonia */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-lg md:text-xl font-medium tracking-wide uppercase text-black">
            {rule?.title || 'Completa tu Equipamiento'}
          </h2>

          {/* Navigation arrows */}
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 flex items-center justify-center text-black hover:opacity-60 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= recommendations.length - itemsPerView}
              className="w-10 h-10 flex items-center justify-center text-black hover:opacity-60 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Products Grid - Estilo Patagonia */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              gap: '24px',
            }}
          >
            {recommendations.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
              >
                <div className="group">
                  {/* Image */}
                  <Link
                    to={`/producto/${product.slug}`}
                    className="block relative aspect-square overflow-hidden bg-[#f5f5f5] mb-4"
                  >
                    {!imageErrors.has(product.id) && product.images[0]?.src ? (
                      <img
                        src={product.images[0].src}
                        alt={product.images[0]?.alt || product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff size={32} className="text-gray-300" />
                      </div>
                    )}
                    {/* Hover overlay con botón */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                      disabled={product.stock_status !== 'instock'}
                      className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 text-sm font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {product.stock_status === 'instock' ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                  </Link>

                  {/* Info */}
                  <Link to={`/producto/${product.slug}`} className="block">
                    <h3 className="text-sm text-black font-normal leading-snug mb-2 group-hover:underline underline-offset-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-black font-medium">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-1.5 mt-8 md:hidden">
          {Array.from({
            length: Math.ceil(recommendations.length / 2),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * 2)}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 2) === i
                  ? 'bg-black w-6'
                  : 'bg-gray-300 w-4'
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompleteYourGear
