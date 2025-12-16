// HeroSlider.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const heroSlides = [
  {
    type: 'image',
    src: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/IMG-20251024-WA0032.jpg',
  },
  {
    type: 'image',
    src: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/IMG-20251024-WA0034.jpg',
  },
  {
    type: 'image',
    src: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/IMG-20251024-WA0037.jpg',
  },
  {
    type: 'image',
    src: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/IMG-20251024-WA0042.jpg',
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-[100svh] min-h-[500px] w-full overflow-hidden">
      {/* Slides con efecto Ken Burns (zoom lento) */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <img
              src={slide.src}
              alt={`Hero ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform ease-out ${
                index === currentSlide
                  ? 'scale-110 duration-[6000ms]'
                  : 'scale-100 duration-0'
              }`}
            />
          )}
        </div>
      ))}

      {/* Gradiente sutil desde abajo para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Flechas de navegacion */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={40} strokeWidth={1.5} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
        aria-label="Siguiente slide"
      >
        <ChevronRight size={40} strokeWidth={1.5} />
      </button>

      {/* Contenido centrado verticalmente */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center text-white max-w-4xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 leading-tight">
            Bienvenidos a Planeta Outdoor
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
            Todo lo que necesitas para tu proxima aventura esta en Planeta Outdoor
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/tienda"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 md:px-10 md:py-4 bg-[#FE6A00] text-white text-sm md:text-base font-semibold tracking-wide hover:bg-[#e55f00] transition-all duration-300"
            >
              Explorar Tienda
            </Link>
            <Link
              to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 md:px-10 md:py-4 border-2 border-white text-white text-sm md:text-base font-semibold tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores de slides */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#FE6A00] w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicador de scroll - oculto en mobile pequeno */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer animate-bounce hidden sm:block"
        aria-label="Scroll hacia abajo"
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </button>
    </section>
  )
}

export default HeroSlider
