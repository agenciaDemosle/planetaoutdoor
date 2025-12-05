// HeroSlider.tsx
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

export function HeroSlider() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative h-[100svh] min-h-[500px] w-full overflow-hidden">
      {/* Video de fondo - fullscreen HD, escalado para eliminar franjas negras */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
        src="/images/hero/videohero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Gradiente sutil desde abajo para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Contenido centrado verticalmente */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center text-white max-w-4xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6 leading-tight">
            Bienvenidos a Planeta Outdoor
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
            Tu hogar para la pesca y la aventura en Temuco
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

      {/* Indicador de scroll - oculto en mobile pequeño */}
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
