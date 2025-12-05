import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Categorías reales de WooCommerce
const categories = [
  { label: 'Waders', href: '/tienda?categoria=waders' },
  { label: 'Botas', href: '/tienda?categoria=botas' },
  { label: 'Cañas', href: '/tienda?categoria=canas' },
  { label: 'Carretes', href: '/tienda?categoria=carretes' },
  { label: 'Líneas', href: '/tienda?categoria=lineas' },
  { label: 'Moscas', href: '/tienda?categoria=moscas' },
  { label: 'Atado de Moscas', href: '/tienda?categoria=atado-de-moscas' },
  { label: 'Señuelos', href: '/tienda?categoria=senuelos' },
  { label: 'Chalecos y Bolsos', href: '/tienda?categoria=chalecos-y-bolsos' },
  { label: 'Gorros', href: '/tienda?categoria=gorros' },
  { label: 'Gafas', href: '/tienda?categoria=gafas-y-straps' },
  { label: 'Outdoor', href: '/tienda?categoria=outdoors-inicio' },
]

export function CategoryNavBar() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    return () => window.removeEventListener('resize', checkScrollPosition)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav className="relative bg-white border-b border-black">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start pl-2 md:pl-4"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-black" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end pr-2 md:pr-4"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-black" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-10 lg:px-20"
      >
        <div className="flex items-center gap-0 min-w-max py-1">
          {categories.map((category) => (
            <Link
              key={category.label}
              to={category.href}
              className="px-3 md:px-4 py-3 text-xs md:text-sm font-medium text-black hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
