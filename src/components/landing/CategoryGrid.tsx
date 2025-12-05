import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Category {
  id: number
  title: string
  subtitle?: string
  image: string
  href: string
}

// Categorías principales - sincronizadas con el menú de navegación y WooCommerce
const categories: Category[] = [
  {
    id: 630,
    title: 'Equipo de Pesca',
    subtitle: 'Cañas, carretes y líneas',
    image: '/images/web/pescaconmosca.jpg',
    href: '/tienda?categoria=equipo-de-pesca',
  },
  {
    id: 638,
    title: 'Waders & Botas',
    subtitle: 'Equipamiento de vadeo',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/08/82365_BSNG.webp',
    href: '/tienda?categoria=waders',
  },
  {
    id: 669,
    title: 'Ropa',
    subtitle: 'Vestuario técnico',
    image: '/images/web/ropa-categoria.jpg',
    href: '/tienda?categoria=vestuario',
  },
  {
    id: 96,
    title: 'Outdoors',
    subtitle: 'Accesorios y más',
    image: '/images/web/outdoor-categoria.jpg',
    href: '/tienda?categoria=outdoors-inicio',
  },
  {
    id: 228,
    title: 'Accesorios',
    subtitle: 'Complementos esenciales',
    image: '/images/web/accesorios-categoria.jpg',
    href: '/tienda?categoria=accesorios-de-pesca',
  },
]

export function CategoryGrid() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

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

    // Fallback: activar después de un breve delay si el observer no se activa
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-24">
      {/* Contenedor principal con max-width */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Título centrado */}
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center tracking-tight mb-10 md:mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Explora Nuestras Categorías
        </h2>

        {/* Slider container */}
        <div className="relative">
          {/* Botón anterior - solo desktop */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white hidden md:flex ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          {/* Slider de tarjetas */}
          <div
            ref={sliderRef}
            onScroll={checkScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={category.href}
                className={`flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(20%-1rem)] snap-start group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
              >
                {/* Tarjeta */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />

                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-1 tracking-tight">
                      {category.title}
                    </h3>
                    {category.subtitle && (
                      <p className="text-white/70 text-sm font-light">
                        {category.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Botón siguiente - solo desktop */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white hidden md:flex ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  )
}
