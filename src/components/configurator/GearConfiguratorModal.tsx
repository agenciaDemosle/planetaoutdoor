import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, ShoppingCart, Check, Sparkles, Plus, Loader2 } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useUIStore } from '../../store/useUIStore'
import { wooCommerceAPI } from '../../api/woocommerce'
import {
  quizQuestions,
  getKitConfiguration,
  formatPrice,
  QuizAnswers,
} from '../../data/gearConfigurator'

// Producto real de WooCommerce
interface WooProduct {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  images: { src: string; alt: string }[]
  stock_status: string
  short_description: string
}

// Producto recomendado con datos reales
interface RecommendedProduct {
  id: number
  name: string
  slug: string
  price: number
  image: string
  stock_status: string
  type: string
  priority: number
  reason: string
}

interface GearConfiguratorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GearConfiguratorModal({ isOpen, onClose }: GearConfiguratorModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [kitInfo, setKitInfo] = useState<{ profile: string; description: string } | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set())

  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)

  // Filter questions based on conditions
  const activeQuestions = quizQuestions.filter((q) => {
    if (!q.conditional) return true
    const condAnswer = answers[q.conditional.questionId as keyof QuizAnswers]
    if (Array.isArray(condAnswer)) {
      return q.conditional.answerIds.some((id) => condAnswer.includes(id))
    }
    return q.conditional.answerIds.includes(condAnswer as string)
  })

  const currentQuestion = activeQuestions[currentStep]
  const isLastQuestion = currentStep === activeQuestions.length - 1
  const progress = ((currentStep + 1) / activeQuestions.length) * 100

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Función para agregar un producto al carrito
  const handleAddSingleProduct = (product: RecommendedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.image,
      quantity: 1,
    })
    setAddedProducts(prev => new Set(prev).add(product.id))
  }

  const handleAnswer = (optionId: string) => {
    const questionId = currentQuestion.id as keyof QuizAnswers

    if (currentQuestion.multiSelect) {
      const currentAnswers = (answers[questionId] as string[]) || []
      let newAnswers: string[]

      if (optionId === 'nada') {
        newAnswers = ['nada']
      } else if (currentAnswers.includes(optionId)) {
        newAnswers = currentAnswers.filter((id) => id !== optionId && id !== 'nada')
      } else {
        newAnswers = [...currentAnswers.filter((id) => id !== 'nada'), optionId]
      }

      setAnswers({ ...answers, [questionId]: newAnswers })
    } else {
      setAnswers({ ...answers, [questionId]: optionId })

      // Auto-advance for single select
      setTimeout(() => {
        if (isLastQuestion) {
          fetchRealProducts()
        } else {
          setCurrentStep((prev) => prev + 1)
        }
      }, 300)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      fetchRealProducts()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Función para buscar productos REALES de WooCommerce
  const fetchRealProducts = async () => {
    setLoading(true)
    setShowResults(true)

    try {
      const config = getKitConfiguration(answers as QuizAnswers)
      setKitInfo({ profile: config.profile, description: config.description })

      const products: RecommendedProduct[] = []

      // Buscar un producto de cada categoría según el presupuesto
      for (const productType of config.products) {
        try {
          // Buscar productos de la categoría ordenados por popularidad
          const categoryProducts = await wooCommerceAPI.getProducts({
            category: productType.categoryId,
            per_page: 10,
            orderby: 'popularity',
            stock_status: 'instock',
          }) as WooProduct[]

          if (Array.isArray(categoryProducts) && categoryProducts.length > 0) {
            // Filtrar por rango de precio
            const filteredProducts = categoryProducts.filter(p => {
              const price = parseFloat(p.price)
              return price >= config.budgetRange.min && price <= config.budgetRange.max
            })

            // Si hay productos en el rango, tomar el primero
            // Si no hay, tomar el más cercano al rango
            let selectedProduct: WooProduct | null = null

            if (filteredProducts.length > 0) {
              selectedProduct = filteredProducts[0]
            } else {
              // Ordenar por cercanía al rango de precio
              const sorted = [...categoryProducts].sort((a, b) => {
                const priceA = parseFloat(a.price)
                const priceB = parseFloat(b.price)
                const distA = Math.min(
                  Math.abs(priceA - config.budgetRange.min),
                  Math.abs(priceA - config.budgetRange.max)
                )
                const distB = Math.min(
                  Math.abs(priceB - config.budgetRange.min),
                  Math.abs(priceB - config.budgetRange.max)
                )
                return distA - distB
              })
              selectedProduct = sorted[0]
            }

            if (selectedProduct) {
              products.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                slug: selectedProduct.slug,
                price: parseFloat(selectedProduct.price),
                image: selectedProduct.images[0]?.src || '',
                stock_status: selectedProduct.stock_status,
                type: productType.type,
                priority: productType.priority,
                reason: productType.reason,
              })
            }
          }
        } catch (err) {
          console.error(`Error fetching ${productType.type}:`, err)
        }
      }

      setRecommendedProducts(products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAllToCart = () => {
    if (recommendedProducts.length === 0) return

    recommendedProducts.forEach((product) => {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.image,
        quantity: 1,
      })
    })

    setAddedToCart(true)
    setTimeout(() => {
      onClose()
      openCart()
    }, 1500)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedProducts([])
    setKitInfo(null)
    setAddedToCart(false)
    setAddedProducts(new Set())
    setLoading(false)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  // Calcular total del kit
  const totalPrice = recommendedProducts.reduce((sum, p) => sum + p.price, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4 shadow-2xl">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#FE6A00]" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Configurador de Equipo
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        {!showResults && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showResults ? (
            // Quiz Questions
            <div className="p-6 md:p-8">
              {/* Question */}
              <div className="mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-3">
                  Pregunta {currentStep + 1} de {activeQuestions.length}
                </p>
                <h2 className="text-xl md:text-2xl font-light text-gray-900">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const questionId = currentQuestion.id as keyof QuizAnswers
                  const currentAnswer = answers[questionId]
                  const isSelected = currentQuestion.multiSelect
                    ? (currentAnswer as string[])?.includes(option.id)
                    : currentAnswer === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className={`w-full text-left p-4 border-2 transition-all duration-200 group ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {option.label}
                          </p>
                          {option.description && (
                            <p className={`text-sm mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          )}
                        </div>
                        {currentQuestion.multiSelect && (
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-white bg-white' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check size={14} className="text-black" />}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                  Anterior
                </button>

                {currentQuestion.multiSelect && (
                  <button
                    onClick={handleNext}
                    disabled={
                      !(answers[currentQuestion.id as keyof QuizAnswers] as string[])?.length
                    }
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLastQuestion ? 'Ver Resultados' : 'Siguiente'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Results
            <div className="p-6 md:p-8">
              {loading ? (
                // Loading state
                <div className="text-center py-16">
                  <Loader2 size={48} className="animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    Buscando el mejor equipo para ti...
                  </p>
                </div>
              ) : addedToCart ? (
                // Success state
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    ¡Kit agregado al carrito!
                  </h3>
                  <p className="text-gray-600">
                    Redirigiendo al carrito...
                  </p>
                </div>
              ) : recommendedProducts.length > 0 ? (
                <>
                  {/* Kit Header */}
                  <div className="bg-gray-50 -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 py-6 mb-6 border-b">
                    <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-2">
                      Tu Kit Perfecto
                    </p>
                    <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-2">
                      {kitInfo?.profile}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {kitInfo?.description}
                    </p>

                    {/* Price summary */}
                    <div className="flex items-baseline gap-4 mt-4">
                      <span className="text-2xl font-medium">
                        {formatPrice(totalPrice)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {recommendedProducts.length} productos
                      </span>
                    </div>
                  </div>

                  {/* Products list */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-900">
                      Equipo Recomendado
                    </h3>
                    {recommendedProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index + 1}
                        isAdded={addedProducts.has(product.id)}
                        onAdd={() => handleAddSingleProduct(product)}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddAllToCart}
                      className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Agregar Todo al Carrito ({formatPrice(totalPrice)})
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleReset}
                        className="py-3 border-2 border-gray-200 text-sm font-medium tracking-wide uppercase hover:border-gray-400 transition-colors"
                      >
                        Volver a Empezar
                      </button>
                      <a
                        href="https://wa.me/56983610365?text=Hola,%20quiero%20asesoría%20sobre%20el%20kit%20de%20pesca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 border-2 border-gray-200 text-sm font-medium tracking-wide uppercase hover:border-gray-400 transition-colors text-center"
                      >
                        Hablar con Experto
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                // No products found
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No encontramos productos disponibles para tu perfil.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-black text-white text-sm font-medium uppercase"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Product Card Component con imagen real
function ProductCard({
  product,
  index,
  isAdded,
  onAdd,
}: {
  product: RecommendedProduct
  index: number
  isAdded: boolean
  onAdd: () => void
}) {
  const priorityLabels = {
    1: 'Esencial',
    2: 'Recomendado',
    3: 'Opcional',
  }

  const typeLabels: Record<string, string> = {
    cana: 'Caña',
    carrete: 'Carrete',
    linea: 'Línea',
    leader: 'Leader',
    moscas: 'Moscas',
    accesorios: 'Accesorios',
  }

  return (
    <div className="flex gap-4 p-4 border border-gray-100 hover:border-gray-200 transition-colors">
      {/* Imagen del producto */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-2xl">{index}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {typeLabels[product.type] || product.type}
            </span>
            <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
              {product.name}
            </h4>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-medium text-sm">{formatPrice(product.price)}</p>
            <span
              className={`text-xs ${
                product.priority === 1
                  ? 'text-green-600'
                  : product.priority === 2
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              {priorityLabels[product.priority as keyof typeof priorityLabels]}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2">{product.reason}</p>

        {/* Add to cart button */}
        <button
          onClick={onAdd}
          disabled={isAdded || product.stock_status !== 'instock'}
          className={`w-full py-2 text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 ${
            isAdded
              ? 'bg-green-500 text-white cursor-default'
              : product.stock_status !== 'instock'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-black hover:text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={14} />
              Agregado
            </>
          ) : product.stock_status !== 'instock' ? (
            'Sin Stock'
          ) : (
            <>
              <Plus size={14} />
              Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default GearConfiguratorModal
