import { useState, useEffect } from 'react'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { wooCommerceAPI } from '../../api/woocommerce'

// Definición de atributos disponibles por ID
export const ATTRIBUTES = {
  // Pesca con Mosca
  NUMERO_LINEA: { id: 8, name: 'Número de Línea', slug: 'pa_numero-linea' },
  ACCION_CANA: { id: 9, name: 'Acción', slug: 'pa_accion-cana' },
  TECNICA_PESCA: { id: 10, name: 'Técnica', slug: 'pa_tecnica-pesca' },
  DENSIDAD_LINEA: { id: 11, name: 'Densidad', slug: 'pa_densidad-linea' },
  MATERIAL_TIPPET: { id: 12, name: 'Material', slug: 'pa_material-tippet' },
  COLOR_LENTE: { id: 13, name: 'Color de Lente', slug: 'pa_color-lente' },
  ESPECIE_USO: { id: 14, name: 'Especie/Uso', slug: 'pa_especie-uso' },

  // Pesca Tradicional - Atributos eliminados, ahora usa subcategorías

  // Generales
  TALLA: { id: 2, name: 'Talla', slug: 'pa_talla' },
  COLOR: { id: 1, name: 'Color', slug: 'pa_color' },
}

// Mapeo de filtros por categoría (ID de categoría -> IDs de atributos)
export const CATEGORY_FILTERS: Record<number, typeof ATTRIBUTES[keyof typeof ATTRIBUTES][]> = {
  // Pesca con Mosca
  731: [ATTRIBUTES.NUMERO_LINEA, ATTRIBUTES.ACCION_CANA, ATTRIBUTES.TECNICA_PESCA], // Cañas de Mosca
  732: [ATTRIBUTES.NUMERO_LINEA], // Carretes de Mosca
  733: [ATTRIBUTES.DENSIDAD_LINEA, ATTRIBUTES.ESPECIE_USO], // Líneas de Mosca
  734: [ATTRIBUTES.MATERIAL_TIPPET], // Leaders y Tippets
  740: [ATTRIBUTES.COLOR_LENTE], // Lentes Polarizados

  // Pesca Tradicional - Usa subcategorías en lugar de filtros
  // 761: Cañas - subcategorías: UL, Spinning, Baitcasting, Mar/Costa, Trolling
  // 762: Carretes - sin filtros por ahora
  766: [ATTRIBUTES.COLOR_LENTE], // Lentes Polarizados Tradicional

  // Waders & Botas
  785: [ATTRIBUTES.TALLA], // Waders Hombre
  786: [ATTRIBUTES.TALLA], // Waders Mujer
  787: [ATTRIBUTES.TALLA], // Botas Goma
  788: [ATTRIBUTES.TALLA], // Botas Fieltro
  789: [ATTRIBUTES.TALLA], // Botas Intercambiables

  // Ropa
  791: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Chaquetas
  792: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Capas Intermedias
  793: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Capas Base
  794: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Ropa UV
  795: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Pantalones
  799: [ATTRIBUTES.TALLA], // Guantes
  800: [ATTRIBUTES.TALLA], // Calcetines
}

// Mapeo de categoría padre a filtros (para subcategorías sin filtros específicos)
export const PARENT_CATEGORY_FILTERS: Record<number, typeof ATTRIBUTES[keyof typeof ATTRIBUTES][]> = {
  723: [ATTRIBUTES.NUMERO_LINEA, ATTRIBUTES.ACCION_CANA], // Pesca con Mosca
  // 724: Pesca Tradicional - usa subcategorías en lugar de filtros
  725: [ATTRIBUTES.TALLA], // Waders & Botas
  726: [ATTRIBUTES.TALLA, ATTRIBUTES.COLOR], // Ropa Técnica
}

interface AttributeTerm {
  id: number
  name: string
  slug: string
  count: number
}

interface FilterState {
  [attributeSlug: string]: string[]
}

interface ProductFiltersProps {
  categoryId: number | null
  parentCategoryId: number | null
  activeFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  className?: string
  variant?: 'mobile' | 'desktop' | 'both' // Nueva prop para controlar qué mostrar
}

export function ProductFilters({
  categoryId,
  parentCategoryId,
  activeFilters,
  onFilterChange,
  className = '',
  variant = 'both'
}: ProductFiltersProps) {
  const [attributeTerms, setAttributeTerms] = useState<Record<number, AttributeTerm[]>>({})
  const [loading, setLoading] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState<Set<number>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  // Determinar qué filtros mostrar según la categoría
  const getFiltersForCategory = () => {
    if (categoryId && CATEGORY_FILTERS[categoryId]) {
      return CATEGORY_FILTERS[categoryId]
    }
    if (parentCategoryId && PARENT_CATEGORY_FILTERS[parentCategoryId]) {
      return PARENT_CATEGORY_FILTERS[parentCategoryId]
    }
    return []
  }

  const relevantFilters = getFiltersForCategory()

  // Cargar términos de los atributos relevantes
  useEffect(() => {
    const loadAttributeTerms = async () => {
      if (relevantFilters.length === 0) return

      setLoading(true)
      try {
        const termsPromises = relevantFilters.map(async (attr) => {
          const terms = await wooCommerceAPI.getAttributeTerms(attr.id)
          return { id: attr.id, terms }
        })

        const results = await Promise.all(termsPromises)
        const termsMap: Record<number, AttributeTerm[]> = {}
        results.forEach(({ id, terms }) => {
          termsMap[id] = terms
        })
        setAttributeTerms(termsMap)

        // Expandir el primer filtro por defecto
        if (relevantFilters.length > 0) {
          setExpandedFilters(new Set([relevantFilters[0].id]))
        }
      } catch (error) {
        console.error('Error loading attribute terms:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAttributeTerms()
  }, [categoryId, parentCategoryId])

  const toggleFilter = (attrId: number) => {
    setExpandedFilters(prev => {
      const next = new Set(prev)
      if (next.has(attrId)) {
        next.delete(attrId)
      } else {
        next.add(attrId)
      }
      return next
    })
  }

  const handleTermClick = (attrSlug: string, termSlug: string) => {
    const currentValues = activeFilters[attrSlug] || []
    let newValues: string[]

    if (currentValues.includes(termSlug)) {
      newValues = currentValues.filter(v => v !== termSlug)
    } else {
      newValues = [...currentValues, termSlug]
    }

    const newFilters = { ...activeFilters }
    if (newValues.length === 0) {
      delete newFilters[attrSlug]
    } else {
      newFilters[attrSlug] = newValues
    }

    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = Object.values(activeFilters).flat().length

  // No mostrar nada si no hay filtros relevantes
  if (relevantFilters.length === 0) {
    return null
  }

  const FilterContent = () => (
    <div className="space-y-1">
      {/* Header con contador */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Filtros
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#FE6A00] hover:text-[#e55f00] font-medium flex items-center gap-1"
          >
            Limpiar ({activeFilterCount})
            <X size={12} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#FE6A00] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-0">
          {relevantFilters.map((attr) => {
            const terms = attributeTerms[attr.id] || []
            const isExpanded = expandedFilters.has(attr.id)
            const selectedValues = activeFilters[attr.slug] || []

            return (
              <div key={attr.id} className="border-b border-gray-100 last:border-0">
                {/* Filter Header */}
                <button
                  onClick={() => toggleFilter(attr.id)}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {attr.name}
                    {selectedValues.length > 0 && (
                      <span className="ml-2 text-xs text-white bg-[#FE6A00] px-1.5 py-0.5 rounded-full">
                        {selectedValues.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Filter Options */}
                {isExpanded && (
                  <div className="pb-3 space-y-1">
                    {terms.map((term) => {
                      const isSelected = selectedValues.includes(term.slug)
                      return (
                        <button
                          key={term.id}
                          onClick={() => handleTermClick(attr.slug, term.slug)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FE6A00]/10 text-[#FE6A00] font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{term.name}</span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#FE6A00] flex items-center justify-center">
                              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 6l3 3 5-5" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // Si es variante desktop, solo mostrar el contenido
  if (variant === 'desktop') {
    return (
      <div className={className}>
        <FilterContent />
      </div>
    )
  }

  // Si es variante mobile, solo mostrar botón y drawer
  if (variant === 'mobile') {
    return (
      <>
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors ${className}`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="bg-[#FE6A00] text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Filter Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filtros</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Ver {activeFilterCount > 0 ? 'resultados filtrados' : 'productos'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Variante 'both' - comportamiento por defecto (responsive)
  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors ${className}`}
      >
        <SlidersHorizontal size={16} />
        Filtros
        {activeFilterCount > 0 && (
          <span className="bg-[#FE6A00] text-white text-xs px-1.5 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Filtros</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Ver {activeFilterCount > 0 ? 'resultados filtrados' : 'productos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <FilterContent />
      </div>
    </>
  )
}

export default ProductFilters
