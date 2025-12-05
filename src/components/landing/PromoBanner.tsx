import { Link } from 'react-router-dom'

export function PromoBanner() {
  return (
    <section className="relative bg-nature py-10 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Left Illustration - Hidden on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none hidden md:block opacity-50 lg:opacity-100">
        <svg
          viewBox="0 0 200 400"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountains */}
          <path
            d="M0 400 L60 200 L100 280 L140 150 L200 400 Z"
            fill="rgba(255,255,255,0.05)"
          />
          {/* Trees */}
          <path
            d="M30 400 L30 320 M20 340 L30 320 L40 340 M15 360 L30 340 L45 360 M10 380 L30 360 L50 380"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <path
            d="M80 400 L80 350 M70 365 L80 350 L90 365 M65 380 L80 365 L95 380"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          {/* Birds */}
          <path
            d="M50 100 Q60 90 70 100 M100 150 Q110 140 120 150"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Right Illustration - Hidden on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none hidden md:block opacity-50 lg:opacity-100">
        <svg
          viewBox="0 0 200 400"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountains */}
          <path
            d="M0 400 L80 180 L120 260 L180 120 L200 400 Z"
            fill="rgba(255,255,255,0.05)"
          />
          {/* Deer silhouette */}
          <ellipse
            cx="130"
            cy="340"
            rx="25"
            ry="15"
            fill="rgba(255,255,255,0.08)"
          />
          <line
            x1="130"
            y1="340"
            x2="130"
            y2="310"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            cx="130"
            cy="305"
            r="8"
            fill="rgba(255,255,255,0.08)"
          />
          {/* Antlers */}
          <path
            d="M125 300 L115 280 M115 280 L105 275 M115 280 L110 270 M135 300 L145 280 M145 280 L155 275 M145 280 L150 270"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          {/* Plants */}
          <path
            d="M170 400 L170 360 M160 380 Q170 370 180 380 M155 390 Q170 375 185 390"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative px-4 md:px-10 lg:px-20 max-w-container mx-auto text-center text-white">
        <span className="inline-block text-[10px] sm:text-xs md:text-sm uppercase tracking-widest mb-2 sm:mb-3 md:mb-4 text-white/80">
          Temporada de Pesca 2024
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
          Vive la Experiencia
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-[280px] sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto mb-5 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed">
          Equipamiento profesional para pesca con mosca en la Patagonia.
          Asesoría experta y stock inmediato.
        </p>
        <Link
          to="/contacto"
          className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-nature text-xs sm:text-sm md:text-base font-medium rounded-full hover:bg-gray-100 transition-colors"
        >
          Contáctanos
        </Link>
      </div>

      {/* Bottom wave decoration - Simplified on mobile */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 md:h-6 lg:h-8 bg-white"
        style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 75% 50%, 50% 20%, 25% 60%, 0 30%)'
        }}
      />
    </section>
  )
}
