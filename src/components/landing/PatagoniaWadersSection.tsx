import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, ArrowRight } from 'lucide-react'

/**
 * RECORDATORIO MIGRACIÓN:
 * Cuando se migre a planetaoutdoor.cl/demosle, las URLs de recursos
 * (videos, imágenes, logo) deben seguir apuntando a:
 * https://planetaoutdoor.cl/wp-content/uploads/...
 * ya que permanecerán en el mismo servidor WordPress.
 */

interface WaderWithVideo {
  id: number
  name: string
  slug: string
  videoUrl: string
  description: string
  features: string[]
}

// Waders Patagonia con video - datos estáticos
const patagoniaWaders: WaderWithVideo[] = [
  {
    id: 1,
    name: 'Wader Patagonia Swiftcurrent Expedition',
    slug: 'wader-patagonia-swiftcurrent-expedition',
    videoUrl: 'https://planetaoutdoor.cl/wp-content/uploads/2025/11/82365_BSNG_CDD_FEATURE_MOTION1.mp4',
    description: 'El wader más avanzado de Patagonia. Diseñado para las condiciones más exigentes.',
    features: ['4 capas H2No', 'Cierre frontal', 'Rodilleras reforzadas'],
  },
  {
    id: 2,
    name: 'Wader Patagonia Swiftcurrent Traverse',
    slug: 'wader-patagonia-swiftcurrent-traverse',
    videoUrl: 'https://planetaoutdoor.cl/wp-content/uploads/2025/11/82385_RVGN_BF_FEATURE_MOTION1.mp4',
    description: 'Versatilidad y durabilidad para el pescador que busca rendimiento.',
    features: ['3 capas H2No', 'Peso ligero', 'Máxima movilidad'],
  },
]

export function PatagoniaWadersSection() {

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Patagonia Banner with Video Background */}
        <div className="relative mb-10 md:mb-14 rounded-2xl overflow-hidden">
          {/* Video de fondo */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/patagonia-pine.mp4" type="video/mp4" />
          </video>
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative px-6 py-12 md:px-10 md:py-16 lg:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <img
                src="https://planetaoutdoor.cl/wp-content/uploads/2025/11/Patagonia_logo-wt.svg"
                alt="Patagonia"
                className="h-8 md:h-10 mb-4 mx-auto md:mx-0"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Waders Patagonia
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Los mejores waders del mundo, diseñados para pescadores que exigen lo máximo de su equipo.
              </p>
            </div>
            <Link
              to="/tienda?categoria=waders"
              className="inline-flex items-center gap-2 bg-white text-[#1a3a5c] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Ver todos los waders
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Waders with Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {patagoniaWaders.map((wader) => (
            <WaderVideoCard key={wader.id} wader={wader} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface WaderVideoCardProps {
  wader: WaderWithVideo
}

function WaderVideoCard({ wader }: WaderVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Auto-play video when in viewport
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay blocked, that's ok
            })
            setIsPlaying(true)
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(!isMuted)
  }

  return (
    <div className="group">
      {/* Video container */}
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-4 shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={wader.videoUrl}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />

        {/* Video controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* Play button center (when paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            aria-label="Reproducir video"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play size={28} className="text-[#1a3a5c] ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="mt-5">
        <Link to={`/producto/${wader.slug}`} className="block group/link">
          <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover/link:text-[#FE6A00] transition-colors">
            {wader.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm md:text-base mb-4">
          {wader.description}
        </p>
        <ul className="flex flex-wrap gap-2 mb-4">
          {wader.features.map((feature, idx) => (
            <li
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs md:text-sm rounded-full"
            >
              {feature}
            </li>
          ))}
        </ul>
        <Link
          to={`/producto/${wader.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a3a5c] hover:text-[#FE6A00] transition-colors"
        >
          Ver detalles del producto
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
