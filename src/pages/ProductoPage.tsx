import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, Minus, Plus, ShoppingCart, Truck, Phone, Shield, Check, CreditCard, Info, Ruler, Leaf } from 'lucide-react'
import { wooCommerceAPI } from '../api/woocommerce'
import {
  WooProduct,
  WooProductVariation,
  Product,
  ProductVariation,
  mapWooProductToProduct,
  mapWooVariationToVariation,
} from '../types/product'
import { useCartStore } from '../store/useCartStore'
import { useUIStore } from '../store/useUIStore'
import { SizeCalculator } from '../components/product/SizeCalculator'
import { ProductAdvisor } from '../components/product/ProductAdvisor'
import { CompleteYourGear } from '../components/product/CompleteYourGear'
import toast from 'react-hot-toast'
import { trackViewContent, trackAddToCart } from '../hooks/useAnalytics'

export function ProductoPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [variations, setVariations] = useState<ProductVariation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)

  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [mainImage, setMainImage] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [footLength, setFootLength] = useState('')
  const [fitPreference, setFitPreference] = useState<'ajustado' | 'normal' | 'holgado'>('normal')
  const [openAccordion, setOpenAccordion] = useState<string | null>('descripcion')

  // Fetch product and variations from WooCommerce
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return

      setLoading(true)
      setError(null)

      try {
        const data: WooProduct = await wooCommerceAPI.getProductBySlug(slug)
        if (data) {
          const mappedProduct = mapWooProductToProduct(data)
          setProduct(mappedProduct)

          // If product has variations, fetch them
          if (data.type === 'variable') {
            const variationsData: WooProductVariation[] = await wooCommerceAPI.getProductVariations(data.id)
            const mappedVariations = variationsData.map(mapWooVariationToVariation)
            setVariations(mappedVariations)
          }

          // Track product view
          trackViewContent({
            product_id: mappedProduct.id.toString(),
            product_name: mappedProduct.name,
            product_category: mappedProduct.categories?.[0]?.slug || 'sin-categoria',
            product_price: mappedProduct.price,
          })
        } else {
          setError('Producto no encontrado')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Find selected variation based on selected options
  const selectedVariation = useMemo(() => {
    if (!product?.hasVariations || variations.length === 0) return null
    if (Object.keys(selectedOptions).length !== product.attributes.length) return null

    return variations.find((variation) => {
      return Object.entries(selectedOptions).every(([name, value]) => {
        return variation.attributes[name] === value
      })
    })
  }, [product, variations, selectedOptions])

  // Current price and stock based on variation
  const currentPrice = selectedVariation?.price ?? product?.price ?? 0
  const currentRegularPrice = selectedVariation?.regularPrice ?? product?.regularPrice ?? 0
  const currentOnSale = selectedVariation?.onSale ?? product?.onSale ?? false
  const currentStockStatus = selectedVariation?.stockStatus ?? product?.stockStatus ?? 'instock'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return

    // For variable products, we need a selected variation
    if (product.hasVariations && !selectedVariation) {
      toast.error('Por favor selecciona todas las opciones')
      return
    }

    addItem({
      id: selectedVariation?.id ?? product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      imageUrl: selectedVariation?.image || product.imageUrl,
      quantity,
      options: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
    })

    // Track add to cart
    trackAddToCart({
      product_id: (selectedVariation?.id ?? product.id).toString(),
      product_name: product.name,
      product_category: product.categories?.[0]?.slug || 'sin-categoria',
      product_price: currentPrice,
      quantity,
    })

    toast.success(
      <div className="flex items-center gap-2">
        <Check size={16} />
        <span>Producto añadido al carrito</span>
      </div>,
      { duration: 2000 }
    )

    openCart()
  }

  // Loading state - mejorado con animación
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb skeleton */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
            <div className="h-4 bg-gray-200 w-48 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-8 md:py-12">
          {/* Loader central animado */}
          <div className="flex flex-col items-center justify-center py-12 mb-8">
            <div className="relative mb-6">
              {/* Icono de pez animado */}
              <svg
                viewBox="0 0 64 64"
                className="w-16 h-16 text-nature animate-pulse"
              >
                <path
                  fill="currentColor"
                  d="M48 32c0-8-12-16-24-16S4 24 4 32s8 16 20 16 24-8 24-16zm-28-4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                />
                <path
                  fill="currentColor"
                  d="M52 20c4 4 8 8 8 12s-4 8-8 12c0-4-2-8-4-12 2-4 4-8 4-12z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">Cargando producto</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-nature rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-nature rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-nature rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>

          {/* Skeleton del producto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 opacity-40">
            {/* Imagen */}
            <div>
              <div className="aspect-square bg-gray-200 animate-pulse rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 w-3/4 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-200 w-1/3 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-full animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-full animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-2/3 animate-pulse rounded"></div>
              <div className="flex gap-2 mt-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
              <div className="h-14 bg-gray-200 w-full animate-pulse rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Producto no encontrado'}</h1>
          <Link to="/tienda" className="text-black hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  // Check if can add to cart
  const canAddToCart = !product.hasVariations || selectedVariation !== null
  const isInStock = currentStockStatus === 'instock'

  // SEO metadata for product
  const seoTitle = `${product.name} | Planeta Outdoor Chile`
  const seoDescription = product.shortDescription
    ? product.shortDescription.replace(/<[^>]*>/g, '').slice(0, 155)
    : `Compra ${product.name} en Planeta Outdoor. ${product.categories[0]?.name || 'Equipamiento de pesca'} de calidad con envío a todo Chile.`
  const canonicalUrl = `https://planetaoutdoor.cl/producto/${product.slug}`
  const productImage = product.imageUrl || 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp'

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={productImage} />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="Planeta Outdoor" />

        {/* Product specific */}
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="CLP" />
        <meta property="product:availability" content={currentStockStatus === 'instock' ? 'in stock' : 'out of stock'} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={productImage} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": seoDescription,
            "image": productImage,
            "url": canonicalUrl,
            "brand": {
              "@type": "Brand",
              "name": "Planeta Outdoor"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "CLP",
              "availability": currentStockStatus === 'instock'
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Planeta Outdoor"
              }
            }
          })}
        </script>
      </Helmet>

    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-black">
              Inicio
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to="/tienda" className="text-gray-500 hover:text-black">
              Tienda
            </Link>
            {product.categories[0] && (
              <>
                <ChevronRight size={14} className="text-gray-400" />
                <Link
                  to={`/tienda?categoria=${product.categories[0].slug}`}
                  className="text-gray-500 hover:text-black"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-black font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
              <img
                src={selectedVariation?.image || product.images[mainImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                      mainImage === idx ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex gap-2 mb-3">
                {product.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-black text-white text-xs font-medium rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Sale Badge */}
            {currentOnSale && (
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold mb-3">
                OFERTA
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-black">
                {formatPrice(currentPrice)}
              </span>
              {currentOnSale && currentRegularPrice > currentPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(currentRegularPrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${
                isInStock ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                {isInStock ? 'En stock' : 'Sin stock'}
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div
                className="text-gray-600 mb-6 leading-relaxed [&>p]:mb-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Description */}
            {product.description && !product.shortDescription && (
              <div
                className="text-gray-600 mb-6 leading-relaxed [&>p]:mb-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: product.description.substring(0, 300) + (product.description.length > 300 ? '...' : '') }}
              />
            )}

            {/* Product Advisor */}
            <div className="mb-6">
              <ProductAdvisor
                productName={product.name}
                productCategory={product.categories[0]?.slug}
              />
            </div>

            {/* Size Calculator for footwear */}
            {product.hasVariations &&
              product.attributes.some(attr => attr.name.toLowerCase() === 'talla' || attr.name.toLowerCase() === 'size') &&
              (product.categories.some(cat =>
                ['botas', 'zapatos', 'calzado', 'waders'].includes(cat.slug.toLowerCase())
              ) || product.name.toLowerCase().includes('bota') || product.name.toLowerCase().includes('zapato') || product.name.toLowerCase().includes('wader') || product.name.toLowerCase().includes('suela')) && (
              <SizeCalculator
                footLength={footLength}
                setFootLength={setFootLength}
                fitPreference={fitPreference}
                setFitPreference={setFitPreference}
                showSizeGuide={showSizeGuide}
                setShowSizeGuide={setShowSizeGuide}
                availableSizes={product.attributes.find(a => a.name.toLowerCase() === 'talla')?.options || []}
                onSelectSize={(size) => {
                  const tallaAttr = product.attributes.find(a => a.name.toLowerCase() === 'talla')
                  if (tallaAttr) {
                    setSelectedOptions({
                      ...selectedOptions,
                      [tallaAttr.name]: size,
                    })
                  }
                }}
              />
            )}

            {/* Attributes/Variations */}
            {product.attributes.length > 0 && product.hasVariations && (
              <div className="space-y-5 mb-6">
                {product.attributes.map((attr) => {
                  const isSizeAttribute = attr.name.toLowerCase() === 'talla' || attr.name.toLowerCase() === 'size'

                  return (
                    <div key={attr.name}>
                      <label className="block text-sm font-semibold text-black mb-3">
                        {attr.name}
                        {selectedOptions[attr.name] && (
                          <span className="font-normal text-gray-600 ml-2">
                            {selectedOptions[attr.name]}
                          </span>
                        )}
                      </label>
                      <div className={`flex flex-wrap ${isSizeAttribute ? 'gap-2' : 'gap-3'}`}>
                        {attr.options.map((option) => {
                          // Check if this option is available in any variation
                          const isAvailable = variations.some(
                            (v) => v.attributes[attr.name] === option && v.stockStatus === 'instock'
                          )
                          const isSelected = selectedOptions[attr.name] === option

                          // Size buttons - compact square style
                          if (isSizeAttribute) {
                            return (
                              <button
                                key={option}
                                onClick={() => setSelectedOptions({
                                  ...selectedOptions,
                                  [attr.name]: option,
                                })}
                                disabled={!isAvailable}
                                className={`w-12 h-12 flex items-center justify-center text-sm font-medium border-2 transition-all ${
                                  isSelected
                                    ? 'border-black bg-black text-white'
                                    : isAvailable
                                      ? 'border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50'
                                      : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 relative'
                                }`}
                              >
                                {option}
                                {!isAvailable && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-full h-[1px] bg-gray-300 rotate-45 absolute"></span>
                                  </span>
                                )}
                              </button>
                            )
                          }

                          // Color/Other attributes - pill style
                          return (
                            <button
                              key={option}
                              onClick={() => setSelectedOptions({
                                ...selectedOptions,
                                [attr.name]: option,
                              })}
                              disabled={!isAvailable}
                              className={`px-5 py-2.5 text-sm font-medium rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-black bg-black text-white'
                                  : isAvailable
                                    ? 'border-gray-300 text-gray-700 hover:border-black'
                                    : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                              }`}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Variation selection message */}
            {product.hasVariations && !selectedVariation && (
              <p className="text-amber-600 text-sm mb-4">
                Por favor selecciona {product.attributes.map(a => a.name.toLowerCase()).join(' y ')}
              </p>
            )}

            {/* Outdoor Animation when variation is selected */}
            {product.hasVariations && selectedVariation && (
              <div className="mb-6 overflow-hidden">
                <div className="animate-fade-in-up flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                  {/* Mountain Icon Animation */}
                  <div className="relative flex-shrink-0">
                    <svg
                      className="w-12 h-12 text-emerald-600 animate-bounce-slow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      {/* Mountains */}
                      <path
                        className="animate-draw"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 20h18L15 8l-3 4-3-4-6 12z"
                      />
                      {/* Sun */}
                      <circle
                        className="animate-pulse"
                        cx="18"
                        cy="6"
                        r="2.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      {/* Birds */}
                      <path
                        className="animate-fly"
                        strokeLinecap="round"
                        d="M7 7c.5-.5 1-.5 1.5 0M9 6c.5-.5 1-.5 1.5 0"
                      />
                    </svg>
                    {/* Fish jumping (for fishing products) */}
                    <svg
                      className="absolute -top-1 -right-1 w-5 h-5 text-blue-500 animate-jump"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 20L3 12c0 0 2.5-2 4.5-2s3.5 1 4.5 1s2.5-1 4.5-1s4.5 2 4.5 2L12 20z M12 16c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2z"/>
                    </svg>
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <p className="text-emerald-800 font-semibold text-sm">
                      ¡Excelente elección!
                    </p>
                    <p className="text-emerald-600 text-xs mt-0.5">
                      {Object.entries(selectedOptions).map(([key, value]) => `${key}: ${value}`).join(' • ')} seleccionado
                    </p>
                  </div>

                  {/* Checkmark */}
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
                    <Check size={18} className="text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Cantidad
              </label>
              <div className="flex items-center border border-gray-300 rounded w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-3 text-center min-w-[60px] font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart || !isInStock}
              className={`w-full flex items-center justify-center gap-3 py-4 text-base font-medium rounded transition-colors ${
                canAddToCart && isInStock
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={20} />
              {!isInStock
                ? 'Sin stock'
                : canAddToCart
                  ? 'Añadir al carrito'
                  : 'Selecciona las opciones'}
            </button>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={20} className="text-black" />
                <span>Envío gratis en compras sobre $80.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={20} className="text-black" />
                <span>Asesoría: Eduardo +56 9 8361 0365 / Daniel +56 9 3256 3910</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield size={20} className="text-black" />
                <span>Garantía en todos nuestros productos</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-black" />
                <p className="text-sm font-semibold text-black">Métodos de pago</p>
              </div>

              {/* Payment Icons */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Webpay */}
                <div className="bg-white rounded border border-gray-200 px-3 py-2">
                  <img
                    src="https://www.webpay.cl/images/webpay_plus.png"
                    alt="WebPay Plus"
                    className="h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <span className="hidden text-xs font-medium text-blue-600">WebPay</span>
                </div>

                {/* Visa */}
                <div className="bg-white rounded border border-gray-200 p-2">
                  <svg viewBox="0 0 48 48" className="h-6 w-10">
                    <path fill="#1565C0" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z"/>
                    <path fill="#FFF" d="M15.2,29l1.7-10.6h2.8L18,29H15.2z M29.1,18.6c-0.6-0.2-1.4-0.4-2.5-0.4c-2.8,0-4.7,1.4-4.7,3.5 c0,1.5,1.4,2.4,2.5,2.9c1.1,0.5,1.5,0.9,1.5,1.3c0,0.7-0.9,1-1.7,1c-1.1,0-1.8-0.2-2.7-0.5l-0.4-0.2l-0.4,2.4 c0.7,0.3,1.9,0.6,3.2,0.6c2.9,0,4.9-1.4,4.9-3.6c0-1.2-0.8-2.1-2.4-2.9c-1-0.5-1.6-0.8-1.6-1.3c0-0.5,0.5-0.9,1.6-0.9 c0.9,0,1.6,0.2,2.1,0.4l0.3,0.1L29.1,18.6z M35.4,18.4h-2.2c-0.7,0-1.2,0.2-1.5,0.9l-4.1,9.7h2.9l0.6-1.6h3.5l0.3,1.6h2.6 L35.4,18.4z M32.8,25c0.2-0.6,1.1-2.8,1.1-2.8s0.2-0.6,0.4-1l0.2,0.9c0,0,0.5,2.5,0.6,3H32.8z M12.9,18.4l-2.7,7.2l-0.3-1.4 c-0.5-1.7-2.1-3.5-3.8-4.4l2.5,9.2h3l4.4-10.6H12.9z"/>
                    <path fill="#FFC107" d="M8.5,18.4H4.1l0,0.2c3.5,0.9,5.8,3,6.8,5.6l-1-4.9C9.7,18.7,9.2,18.5,8.5,18.4z"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white rounded border border-gray-200 p-2">
                  <svg viewBox="0 0 48 48" className="h-6 w-10">
                    <path fill="#3F51B5" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z"/>
                    <circle cx="19" cy="24" r="9" fill="#E53935"/>
                    <circle cx="29" cy="24" r="9" fill="#FF9800"/>
                    <path fill="#FF5722" d="M24,17c-2.2,1.8-3.6,4.5-3.6,7.5s1.4,5.7,3.6,7.5c2.2-1.8,3.6-4.5,3.6-7.5S26.2,18.8,24,17z"/>
                  </svg>
                </div>

                {/* American Express */}
                <div className="bg-white rounded border border-gray-200 p-2">
                  <svg viewBox="0 0 48 48" className="h-6 w-10">
                    <path fill="#1976D2" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z"/>
                    <path fill="#FFF" d="M10,22l1-2.5l1,2.5H10z M34,27v-1h4v-1h-4v-1h4.5l1.5-2l-1.5-2H34v6H34z M27,27v-6h4.5l1.5,2l1.5-2H40l-3,3 l3,3h-5.5l-1.5-2l-1.5,2H27z M22.5,27l-0.6-1.5h-3l-0.6,1.5H16l3-6h2.5l3,6H22.5z M17,27v-6h2.5l1.5,3l1.5-3H25v6h-2v-4l-1.5,3 h-1.5L18.5,23v4H17z"/>
                  </svg>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Paga en <strong>3, 6 o 12 cuotas</strong> sin interés</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transacción 100% segura con WebPay</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transferencia bancaria disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section - Patagonia Style */}
        <div className="mt-16 border-t border-gray-200">
          {/* Accordions */}
          <div className="divide-y divide-gray-200">
            {/* Descripción */}
            {product.description && (
              <div className="py-0">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'descripcion' ? null : 'descripcion')}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-gray-600" />
                    <span className="text-base font-semibold text-black uppercase tracking-wide">
                      Descripción
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-300 ${
                      openAccordion === 'descripcion' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'descripcion' ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className="text-gray-600 leading-relaxed text-[15px]
                      [&>p]:mb-4 [&>p:last-child]:mb-0
                      [&_strong]:font-semibold [&_strong]:text-gray-800
                      [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-4 [&>ul]:space-y-2
                      [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                      [&_li]:relative [&_li]:pl-5
                      [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[10px] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:bg-gray-400 [&_li]:before:rounded-full
                      [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2
                      [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>
            )}

            {/* Características / Atributos */}
            {product.attributes.length > 0 && !product.hasVariations && (
              <div className="py-0">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'caracteristicas' ? null : 'caracteristicas')}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Ruler size={20} className="text-gray-600" />
                    <span className="text-base font-semibold text-black uppercase tracking-wide">
                      Características
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-300 ${
                      openAccordion === 'caracteristicas' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'caracteristicas' ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.attributes.map((attr) => (
                      <div key={attr.name} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          {attr.name}
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          {attr.options.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Envío y Devoluciones */}
            <div className="py-0">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'envio' ? null : 'envio')}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-gray-600" />
                  <span className="text-base font-semibold text-black uppercase tracking-wide">
                    Envío y Devoluciones
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 ${
                    openAccordion === 'envio' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openAccordion === 'envio' ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-4 text-[15px] text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Envío gratis</p>
                      <p className="text-gray-500">En compras sobre $80.000 a todo Chile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Truck size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Despacho express</p>
                      <p className="text-gray-500">1-3 días hábiles en Región Metropolitana</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Devolución garantizada</p>
                      <p className="text-gray-500">30 días para cambios y devoluciones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compromiso Ambiental */}
            <div className="py-0">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'sustentabilidad' ? null : 'sustentabilidad')}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <Leaf size={20} className="text-gray-600" />
                  <span className="text-base font-semibold text-black uppercase tracking-wide">
                    Compromiso Ambiental
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 ${
                    openAccordion === 'sustentabilidad' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openAccordion === 'sustentabilidad' ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <p className="text-gray-700 leading-relaxed text-[15px] mb-4">
                    En Planeta Outdoor estamos comprometidos con el cuidado del medio ambiente.
                    Trabajamos con marcas que comparten nuestra visión de sustentabilidad y comercio justo.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-green-700 border border-green-200">
                      <Leaf size={12} />
                      Productos responsables
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-blue-700 border border-blue-200">
                      <Check size={12} />
                      Fair Trade Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completa tu Equipamiento - Recomendaciones inteligentes */}
      {product && product.categories.length > 0 && (
        <CompleteYourGear
          currentProduct={{
            id: product.id,
            categories: product.categories.map(cat => ({ id: cat.id, slug: cat.slug })),
          }}
        />
      )}
    </div>
    </>
  )
}
