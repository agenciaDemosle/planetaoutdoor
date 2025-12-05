import { useMemo } from 'react'
import { ChevronRight, Ruler, Check, AlertCircle, Footprints, ThumbsUp, Maximize2 } from 'lucide-react'

interface SizeCalculatorProps {
  footLength: string
  setFootLength: (value: string) => void
  fitPreference: 'ajustado' | 'normal' | 'holgado'
  setFitPreference: (value: 'ajustado' | 'normal' | 'holgado') => void
  showSizeGuide: boolean
  setShowSizeGuide: (value: boolean) => void
  availableSizes: string[]
  onSelectSize: (size: string) => void
}

// Size chart data: cm -> US size (solo tallas enteras US)
const SIZE_CHART = [
  { cm: 23.5, us: 5, eu: '37-38', uk: 4 },
  { cm: 24.5, us: 6, eu: '38-39', uk: 5 },
  { cm: 25.5, us: 7, eu: '39-40', uk: 6 },
  { cm: 26, us: 8, eu: '40-41', uk: 7 },
  { cm: 27, us: 9, eu: '41-42', uk: 8 },
  { cm: 28, us: 10, eu: '42-43', uk: 9 },
  { cm: 29, us: 11, eu: '43-44', uk: 10 },
  { cm: 30, us: 12, eu: '44-45', uk: 11 },
  { cm: 31, us: 13, eu: '45-46', uk: 12 },
  { cm: 32, us: 14, eu: '46-47', uk: 13 },
]

export function SizeCalculator({
  footLength,
  setFootLength,
  fitPreference,
  setFitPreference,
  showSizeGuide,
  setShowSizeGuide,
  availableSizes,
  onSelectSize,
}: SizeCalculatorProps) {
  // Calculate recommended size based on foot length and fit preference
  const recommendation = useMemo(() => {
    const cm = parseFloat(footLength)
    if (isNaN(cm) || cm < 23 || cm > 32) return null

    // Find the base size
    let baseSize = SIZE_CHART.find((s, i) => {
      const next = SIZE_CHART[i + 1]
      return cm >= s.cm && (!next || cm < next.cm)
    })

    if (!baseSize) {
      baseSize = SIZE_CHART[SIZE_CHART.length - 1]
    }

    // Adjust based on fit preference (solo tallas enteras)
    let adjustedUS = baseSize.us
    let fitNote = ''

    switch (fitPreference) {
      case 'ajustado':
        fitNote = 'Calce preciso, ideal si prefieres sentir el pie ajustado'
        break
      case 'normal':
        // Subir una talla para comodidad
        adjustedUS = baseSize.us + 1
        fitNote = 'Calce cómodo con espacio para calcetines normales'
        break
      case 'holgado':
        // Subir dos tallas para calce amplio
        adjustedUS = baseSize.us + 2
        fitNote = 'Calce amplio, ideal para calcetines gruesos de neopreno'
        break
    }

    // Find the adjusted size in chart
    const adjustedSize = SIZE_CHART.find(s => s.us === adjustedUS) || baseSize

    // Check if the recommended size is available in the product's real sizes
    const recommendedSizeStr = String(adjustedSize.us)
    const isAvailable = availableSizes.some(s => s === recommendedSizeStr)

    // Find closest available size if recommended is not available
    let closestAvailable: string | null = null
    let closestDiff = Infinity

    if (!isAvailable && availableSizes.length > 0) {
      availableSizes.forEach(s => {
        const num = parseFloat(s)
        if (!isNaN(num)) {
          const diff = Math.abs(num - adjustedSize.us)
          if (diff < closestDiff) {
            closestDiff = diff
            closestAvailable = s
          }
        }
      })
    }

    return {
      size: adjustedSize,
      sizeStr: recommendedSizeStr,
      fitNote,
      isAvailable,
      closestAvailable,
      baseCm: cm,
    }
  }, [footLength, fitPreference, availableSizes])

  return (
    <div className="mb-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setShowSizeGuide(!showSizeGuide)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FE6A00' }}>
            <Ruler size={20} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-orange-900 block">Calculador de Talla</span>
            <span className="text-xs" style={{ color: '#FE6A00' }}>Ingresa los cm de tu pie</span>
          </div>
        </div>
        <ChevronRight
          size={20}
          style={{ color: '#FE6A00' }}
          className={`transition-transform duration-300 ${showSizeGuide ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Calculator Content */}
      {showSizeGuide && (
        <div className="p-4 pt-0 animate-fade-in-up">
          {/* How to measure */}
          <div className="mb-4 p-3 bg-white/60 rounded-lg border border-orange-100">
            <p className="text-xs font-semibold text-orange-800 mb-2 flex items-center gap-1.5">
              <Ruler size={14} style={{ color: '#FE6A00' }} />
              ¿Cómo medir tu pie?
            </p>
            <ol className="text-xs text-orange-700 space-y-1 list-decimal list-inside">
              <li>Coloca tu pie sobre una hoja de papel contra la pared</li>
              <li>Marca el punto más largo de tu dedo</li>
              <li>Mide la distancia desde la pared hasta la marca</li>
            </ol>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Foot Length Input */}
            <div>
              <label className="block text-xs font-semibold text-orange-800 mb-2">
                Largo de tu pie (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="23"
                  max="32"
                  value={footLength}
                  onChange={(e) => setFootLength(e.target.value)}
                  placeholder="Ej: 26.5"
                  className="w-full px-4 py-3 pr-12 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-lg font-medium text-center"
                  style={{ '--tw-ring-color': '#FE6A00' } as React.CSSProperties}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-medium">
                  cm
                </span>
              </div>
            </div>

            {/* Fit Preference */}
            <div>
              <label className="block text-xs font-semibold text-orange-800 mb-2">
                ¿Cómo lo quieres usar?
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { value: 'ajustado', label: 'Ajustado', Icon: Footprints },
                  { value: 'normal', label: 'Normal', Icon: ThumbsUp },
                  { value: 'holgado', label: 'Holgado', Icon: Maximize2 },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFitPreference(option.value as typeof fitPreference)}
                    style={fitPreference === option.value ? { backgroundColor: '#FE6A00', borderColor: '#FE6A00' } : {}}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border-2 transition-all ${
                      fitPreference === option.value
                        ? 'text-white'
                        : 'border-orange-200 bg-white text-orange-700 hover:border-orange-300'
                    }`}
                  >
                    <option.Icon size={18} className="mx-auto mb-0.5" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation Result */}
          {recommendation && (
            <div className="animate-scale-in">
              <div className={`p-4 rounded-xl border-2 ${
                recommendation.isAvailable
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
              }`}>
                <div className="flex items-start gap-4">
                  {/* Size Badge */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                    style={{ backgroundColor: recommendation.isAvailable ? '#FE6A00' : '#9CA3AF' }}
                  >
                    <span className="text-white text-2xl font-bold leading-none">
                      {recommendation.size.us}
                    </span>
                    <span className="text-white/80 text-[10px] font-medium">US</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {recommendation.isAvailable ? (
                        <>
                          <Check size={16} style={{ color: '#FE6A00' }} />
                          <span className="text-sm font-bold text-orange-800">
                            ¡Talla {recommendation.size.us} disponible!
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-amber-600" />
                          <span className="text-sm font-bold text-gray-700">
                            Talla {recommendation.size.us} no disponible por el momento
                          </span>
                        </>
                      )}
                    </div>

                    <p className={`text-xs mb-2 ${
                      recommendation.isAvailable ? 'text-orange-700' : 'text-gray-600'
                    }`}>
                      {recommendation.fitNote}
                    </p>

                    {/* Size conversions */}
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-0.5 bg-white/60 rounded text-gray-600">
                        EU: {recommendation.size.eu}
                      </span>
                      <span className="px-2 py-0.5 bg-white/60 rounded text-gray-600">
                        UK: {recommendation.size.uk}
                      </span>
                      <span className="px-2 py-0.5 bg-white/60 rounded text-gray-600">
                        ~{recommendation.size.cm} cm
                      </span>
                    </div>

                    {/* Action Button */}
                    {recommendation.isAvailable ? (
                      <button
                        onClick={() => onSelectSize(recommendation.sizeStr)}
                        style={{ backgroundColor: '#FE6A00' }}
                        className="mt-3 w-full py-2 hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        Seleccionar Talla {recommendation.size.us}
                      </button>
                    ) : recommendation.closestAvailable ? (
                      <button
                        onClick={() => onSelectSize(recommendation.closestAvailable!)}
                        className="mt-3 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        Seleccionar Talla {recommendation.closestAvailable} (disponible más cercana)
                      </button>
                    ) : (
                      <p className="mt-3 text-center text-sm text-gray-500">
                        No hay tallas disponibles en este momento
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!recommendation && footLength && (
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Ingresa un valor entre 23 y 32 cm
              </p>
            </div>
          )}

          {/* Size Reference Table - Solo tallas disponibles del producto */}
          {availableSizes.length > 0 && (
            <details className="mt-4">
              <summary className="text-xs font-semibold cursor-pointer hover:opacity-80" style={{ color: '#FE6A00' }}>
                Ver tallas disponibles de este producto
              </summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="px-2 py-2 text-center text-orange-800">US</th>
                      <th className="px-2 py-2 text-center text-orange-800">EU</th>
                      <th className="px-2 py-2 text-center text-orange-800">CM aprox.</th>
                      <th className="px-2 py-2 text-center text-orange-800">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50">
                    {availableSizes.map((sizeStr) => {
                      const sizeNum = parseFloat(sizeStr)
                      const sizeData = SIZE_CHART.find(s => s.us === sizeNum)
                      const isRecommended = recommendation?.size.us === sizeNum
                      return (
                        <tr
                          key={sizeStr}
                          className={`${isRecommended ? 'bg-orange-200 font-semibold' : 'hover:bg-orange-50'}`}
                        >
                          <td className="px-2 py-1.5 text-center font-medium">
                            {sizeStr}
                            {isRecommended && <span className="ml-1 text-orange-600">← Tu talla</span>}
                          </td>
                          <td className="px-2 py-1.5 text-center text-gray-600">{sizeData?.eu || '-'}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600">{sizeData?.cm || '-'}</td>
                          <td className="px-2 py-1.5 text-center">
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Disponible
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
