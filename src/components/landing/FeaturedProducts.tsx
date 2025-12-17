import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, ImageOff } from 'lucide-react'
import { wooCommerceAPI } from '../../api/woocommerce'
import { useCartStore } from '../../store/useCartStore'
import { useUIStore } from '../../store/useUIStore'
import { trackAddToCart } from '../../hooks/useAnalytics'

import 'swiper/css'
import 'swiper/css/navigation'

interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId))
  }

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await wooCommerceAPI.getProducts({
          per_page: 12,
          orderby: 'date',
          order: 'desc',
          status: 'publish',
        })
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const price = parseFloat(product.price)

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      imageUrl: product.images[0]?.src || '',
    })

    // Track add to cart
    trackAddToCart({
      product_id: product.id.toString(),
      product_name: product.name,
      product_category: product.categories?.[0]?.name || 'sin-categoria',
      product_price: price,
      quantity: 1,
      item_list_name: 'Productos Destacados',
      item_list_id: 'featured_products',
    })

    openCart()
  }

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Nuevos Productos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 sm:mb-6 md:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Nuevos Productos</h2>
          <Link
            to="/tienda"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {/* Products Carousel */}
        <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.products-prev',
              nextEl: '.products-next',
            }}
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <Link to={`/producto/${product.slug}`} className="block group">
                  <div className="relative overflow-hidden bg-gray-100 aspect-square mb-2 sm:mb-3">
                    {!imageErrors.has(product.id) && product.images[0]?.src ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff size={24} className="text-gray-300" />
                      </div>
                    )}
                    {product.on_sale && (
                      <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-600 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1">
                        OFERTA
                      </span>
                    )}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-0.5 sm:mb-1 line-clamp-2 group-hover:underline">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {product.on_sale && product.regular_price && (
                      <span className="text-[10px] sm:text-sm text-gray-500 line-through">
                        {formatPrice(product.regular_price)}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-black">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
          <button className="products-prev w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30">
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className="products-next w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30">
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Mobile Link */}
        <div className="md:hidden text-center mt-4 sm:mt-6">
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-black text-black text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  )
}
