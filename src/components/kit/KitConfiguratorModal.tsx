import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useUIStore } from '../../store/useUIStore'
import {
  ConfiguratorState,
  SPECIES_OPTIONS,
  WATER_OPTIONS,
  TECHNIQUE_OPTIONS,
  WIND_OPTIONS,
  LEVEL_OPTIONS,
  LINE_TYPE_OPTIONS,
  calculateLineNumber,
  getKitRecommendation,
  formatPrice,
  calculateKitTotal,
  KitRecommendation,
  KitProduct,
} from './kitData'
import { trackConfiguratorComplete, trackConfiguratorAddKit } from '../../hooks/useAnalytics'

interface KitConfiguratorModalProps {
  isOpen: boolean
  onClose: () => void
}

const INITIAL_STATE: ConfiguratorState = {
  step: 1,
  species: null,
  water: null,
  technique: null,
  wind: null,
  level: null,
  lineType: null,
  wantsUpgrade: false,
}

const TOTAL_STEPS = 6

export function KitConfiguratorModal({ isOpen, onClose }: KitConfiguratorModalProps) {
  const [state, setState] = useState<ConfiguratorState>(INITIAL_STATE)
  const [lineNumber, setLineNumber] = useState<4 | 5 | 6 | 8 | null>(null)
  const [recommendation, setRecommendation] = useState<KitRecommendation | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const addItem = useCartStore(state => state.addItem)
  const openCart = useUIStore(state => state.openCart)

  useEffect(() => {
    if (isOpen) {
      setState(INITIAL_STATE)
      setLineNumber(null)
      setRecommendation(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (state.species && state.water && state.technique && state.wind) {
      const calculated = calculateLineNumber(state)
      setLineNumber(calculated)
    }
  }, [state.species, state.water, state.technique, state.wind])

  useEffect(() => {
    if (lineNumber && state.level) {
      const rec = getKitRecommendation(lineNumber, state.level, state.lineType, state.technique)
      setRecommendation(rec)

      // Track configurator complete when recommendation is shown
      if (rec && state.step > TOTAL_STEPS) {
        const profileName = `${state.species}_${state.water}_${state.technique}_L${lineNumber}`
        trackConfiguratorComplete({
          profile: profileName,
          num_products: 3,
          total_value: calculateKitTotal(rec, state.wantsUpgrade),
          product_ids: [
            rec.cana.id.toString(),
            (state.wantsUpgrade && rec.upgradeCarrete ? rec.upgradeCarrete.id : rec.carrete.id).toString(),
            rec.linea.id.toString(),
          ],
          product_names: [
            rec.cana.name,
            (state.wantsUpgrade && rec.upgradeCarrete ? rec.upgradeCarrete.name : rec.carrete.name),
            rec.linea.name,
          ],
        })
      }
    }
  }, [lineNumber, state.level, state.lineType, state.technique, state.step, state.species, state.water, state.wantsUpgrade])

  const handleSelect = (field: keyof ConfiguratorState, value: string | boolean) => {
    setState(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (state.step === 4 && lineNumber !== 6) {
      setState(prev => ({ ...prev, step: prev.step + 2 }))
    } else {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const prevStep = () => {
    if (state.step === 6 && lineNumber !== 6) {
      setState(prev => ({ ...prev, step: prev.step - 2 }))
    } else {
      setState(prev => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const canProceed = (): boolean => {
    switch (state.step) {
      case 1: return !!state.species
      case 2: return !!state.water
      case 3: return !!state.technique
      case 4: return !!state.wind
      case 5: return !!state.lineType || lineNumber !== 6
      case 6: return !!state.level
      default: return false
    }
  }

  const handleAddToCart = () => {
    if (!recommendation) return

    setIsAdding(true)

    const addProductToCart = (product: KitProduct) => {
      const options: Record<string, string> = {}
      if (product.variation) {
        if (product.name.includes('Carrete')) {
          options['Nº Carrete'] = product.variation
        } else {
          options['Numero'] = product.variation.replace('#', '')
        }
      }

      addItem({
        id: product.id,
        name: product.name + (product.variation ? ` ${product.variation}` : ''),
        slug: product.slug,
        price: product.price,
        imageUrl: product.image,
        options: Object.keys(options).length > 0 ? options : undefined,
      })
    }

    addProductToCart(recommendation.cana)

    if (state.wantsUpgrade && recommendation.upgradeCarrete) {
      addProductToCart(recommendation.upgradeCarrete)
    } else {
      addProductToCart(recommendation.carrete)
    }

    addProductToCart(recommendation.linea)

    // Track adding full kit to cart
    const profileName = `${state.species}_${state.water}_${state.technique}_L${lineNumber}`
    trackConfiguratorAddKit({
      profile: profileName,
      num_products: 3,
      total_value: calculateKitTotal(recommendation, state.wantsUpgrade),
      product_ids: [
        recommendation.cana.id.toString(),
        (state.wantsUpgrade && recommendation.upgradeCarrete ? recommendation.upgradeCarrete.id : recommendation.carrete.id).toString(),
        recommendation.linea.id.toString(),
      ],
      product_names: [
        recommendation.cana.name,
        (state.wantsUpgrade && recommendation.upgradeCarrete ? recommendation.upgradeCarrete.name : recommendation.carrete.name),
        recommendation.linea.name,
      ],
    })

    setTimeout(() => {
      setIsAdding(false)
      onClose()
      openCart()
    }, 500)
  }

  if (!isOpen) return null

  const isSalmon = state.species === 'salmon'
  const showResults = state.step > TOTAL_STEPS

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white flex flex-col">
        {/* Header minimalista */}
        <div className="px-6 py-5 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            {showResults ? 'Tu Kit Recomendado' : 'Arma tu Kit'}
          </h2>

          {!showResults && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Paso {state.step} de {TOTAL_STEPS}</span>
              </div>
              <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 transition-all duration-300"
                  style={{ width: `${(state.step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Species */}
          {state.step === 1 && (
            <StepContent
              title="¿Qué especie vas a pescar?"
            >
              <div className="space-y-2">
                {SPECIES_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.species === option.id}
                    onClick={() => handleSelect('species', option.id)}
                    label={option.label}
                    badge={option.forceLine === 8 ? '#8' : undefined}
                  />
                ))}
              </div>
            </StepContent>
          )}

          {/* Step 2: Water type */}
          {state.step === 2 && (
            <StepContent
              title="¿Dónde pescarás?"
            >
              <div className="space-y-2">
                {WATER_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.water === option.id}
                    onClick={() => handleSelect('water', option.id)}
                    label={option.label}
                    disabled={isSalmon}
                  />
                ))}
              </div>
              {isSalmon && (
                <p className="mt-4 text-sm text-gray-500">
                  Para salmón se recomienda equipo #8 independiente del caudal.
                </p>
              )}
            </StepContent>
          )}

          {/* Step 3: Technique */}
          {state.step === 3 && (
            <StepContent
              title="¿Qué técnica usarás?"
            >
              <div className="space-y-2">
                {TECHNIQUE_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.technique === option.id}
                    onClick={() => handleSelect('technique', option.id)}
                    label={option.label}
                    disabled={isSalmon && (option.id === 'dry' || option.id === 'nymph')}
                  />
                ))}
              </div>
            </StepContent>
          )}

          {/* Step 4: Wind */}
          {state.step === 4 && (
            <StepContent
              title="Condiciones de viento"
            >
              <div className="space-y-2">
                {WIND_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.wind === option.id}
                    onClick={() => handleSelect('wind', option.id)}
                    label={option.label}
                  />
                ))}
              </div>
              {lineNumber && (
                <p className="mt-4 text-sm text-gray-900">
                  Recomendación: <span className="font-semibold">Caña #{lineNumber}</span>
                </p>
              )}
            </StepContent>
          )}

          {/* Step 5: Line type (only for #6) */}
          {state.step === 5 && lineNumber === 6 && (
            <StepContent
              title="Tipo de línea"
            >
              <div className="space-y-2">
                {LINE_TYPE_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.lineType === option.id}
                    onClick={() => handleSelect('lineType', option.id)}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </StepContent>
          )}

          {/* Step 6: Level */}
          {state.step === 6 && (
            <StepContent
              title="Nivel de equipo"
            >
              <div className="space-y-2">
                {LEVEL_OPTIONS.map(option => (
                  <OptionCard
                    key={option.id}
                    selected={state.level === option.id}
                    onClick={() => handleSelect('level', option.id)}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </StepContent>
          )}

          {/* Results */}
          {showResults && recommendation && (
            <div className="space-y-6">
              {/* Kit badge */}
              <div className="text-center pb-4 border-b border-gray-100">
                <span className="text-sm text-gray-500">
                  Kit Caña #{lineNumber}{lineNumber === 8 && ' — Salmón'}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <ProductCard
                  label="Caña"
                  product={recommendation.cana}
                />
                <ProductCard
                  label="Carrete"
                  product={state.wantsUpgrade && recommendation.upgradeCarrete
                    ? recommendation.upgradeCarrete
                    : recommendation.carrete}
                />
                <ProductCard
                  label="Línea"
                  product={recommendation.linea}
                />
              </div>

              {/* Upgrade option */}
              {recommendation.upgradeCarrete && lineNumber !== 8 && (
                <label className="flex items-center gap-4 p-4 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={state.wantsUpgrade}
                    onChange={(e) => handleSelect('wantsUpgrade', e.target.checked)}
                    className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                  />
                  <div className="flex-1 flex items-center gap-4">
                    <img
                      src={recommendation.upgradeCarrete.image}
                      alt={recommendation.upgradeCarrete.name}
                      className="w-12 h-12 object-cover bg-gray-100"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Upgrade: {recommendation.upgradeCarrete.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        +{formatPrice(recommendation.upgradeCarrete.price - recommendation.carrete.price)}
                      </p>
                    </div>
                  </div>
                </label>
              )}

              {/* Alternative line info */}
              {recommendation.lineaAlternativa && (
                <p className="text-sm text-gray-500 py-3 border-t border-gray-100">
                  Alternativa: {recommendation.lineaAlternativa.name} ({formatPrice(recommendation.lineaAlternativa.price)})
                </p>
              )}

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total del Kit</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatPrice(calculateKitTotal(recommendation, state.wantsUpgrade))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-6 py-4">
          {showResults ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium py-3 px-6 transition-colors"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Agregar al carrito
                </>
              )}
            </button>
          ) : (
            <div className="flex justify-between items-center gap-4">
              {state.step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-1 px-5 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {state.step === TOTAL_STEPS ? 'Ver Kit' : 'Continuar'}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Subcomponentes minimalistas
function StepContent({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function OptionCard({
  selected,
  onClick,
  label,
  description,
  badge,
  disabled,
}: {
  selected: boolean
  onClick: () => void
  label: string
  description?: string
  badge?: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 border transition-colors ${
        selected
          ? 'border-gray-900 bg-gray-50'
          : disabled
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <span className={`text-sm ${selected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
            {label}
          </span>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {badge && (
          <span className="text-xs px-2 py-0.5 bg-gray-900 text-white">
            {badge}
          </span>
        )}
      </div>
    </button>
  )
}

function ProductCard({
  label,
  product,
}: {
  label: string
  product: KitProduct
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        <p className="text-sm font-medium text-gray-900 mt-0.5">
          {product.name}
          {product.variation && (
            <span className="ml-1 font-normal text-gray-500">{product.variation}</span>
          )}
        </p>
      </div>
      <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
    </div>
  )
}

export default KitConfiguratorModal
