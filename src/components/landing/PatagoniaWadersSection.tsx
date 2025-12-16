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
  posterUrl: string
  description: string
  features: string[]
}

// Waders Patagonia con video - datos estáticos (slugs de WooCommerce)
const patagoniaWaders: WaderWithVideo[] = [
  {
    id: 6715,
    name: 'Wader Patagonia Swiftcurrent Expedition',
    slug: 'wader-hombre-swiftcurrent-expedition-zip-front',
    videoUrl: 'https://res.cloudinary.com/doudjiatu/video/upload/v1765628463/expedition_zc13w1.mp4',
    posterUrl: 'https://planetaoutdoor.cl/wp-content/uploads/2023/05/82365_BSNG-1-324x324.jpg',
    description: 'El wader más avanzado de Patagonia. Diseñado para las condiciones más exigentes.',
    features: ['4 capas H2No', 'Cierre frontal', 'Rodilleras reforzadas'],
  },
  {
    id: 6181,
    name: 'Wader Patagonia Swiftcurrent Traverse',
    slug: 'waders-hombre-swiftcurrent-traverse-zip-front-waders',
    videoUrl: 'https://res.cloudinary.com/doudjiatu/video/upload/v1765628463/traverse_slfuor.mp4',
    posterUrl: 'https://planetaoutdoor.cl/wp-content/uploads/2023/05/82385_RVGN-1-324x324.jpg',
    description: 'Versatilidad y durabilidad para el pescador que busca rendimiento.',
    features: ['3 capas H2No', 'Peso ligero', 'Máxima movilidad'],
  },
]

// Productos destacados adicionales de Patagonia
interface FeaturedProduct {
  id: number
  name: string
  slug: string
  price: string
  image: string
  category: string
}

const patagoniaFeaturedProducts: FeaturedProduct[] = [
  {
    id: 5369,
    name: 'Botas Foot Tractor Wading',
    slug: 'patagonia-botas-foot-tractor-wading',
    price: '$324.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2024/10/IMG_0217.jpeg',
    category: 'Botas',
  },
  {
    id: 5249,
    name: 'Botas Forra Wading',
    slug: 'botas-de-pesca-forra-wading-boots',
    price: '$284.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2024/09/79206_FGE.webp',
    category: 'Botas',
  },
  {
    id: 6191,
    name: 'Chaqueta Swiftcurrent',
    slug: 'chaqueta-hombre-swiftcurrent-wading-jacket',
    price: '$309.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/08/81771_RVGN.webp',
    category: 'Chaquetas',
  },
  {
    id: 5397,
    name: 'Wader Swiftcurrent Mujer',
    slug: 'wader-patagonia-swiftcurrent-mujer',
    price: '$429.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2024/10/IMG_0371.jpeg',
    category: 'Waders',
  },
]

export function PatagoniaWadersSection() {

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Patagonia Banner with Video Background */}
        <div className="relative mb-10 md:mb-14 rounded-2xl overflow-hidden bg-[#1a3a5c]">
          {/* Video de fondo */}
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://res.cloudinary.com/doudjiatu/video/upload/v1765628470/patagonia-video_frhmdn.mp4"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative px-6 py-12 md:px-10 md:py-16 lg:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <img
                src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Patagonia_Unternehmen_logo.svg_.png"
                alt="Patagonia"
                className="h-8 md:h-10 mb-4 mx-auto md:mx-0 brightness-0 invert"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Waders Patagonia
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Los mejores waders del mundo, diseñados para pescadores que exigen lo máximo de su equipo.
              </p>
            </div>
            <Link
              to="/tienda?categoria=waders-botas"
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

        {/* Productos destacados adicionales */}
        <div className="mt-10 md:mt-14">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Más productos Patagonia
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {patagoniaFeaturedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <span className="text-xs text-[#FE6A00] font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h4 className="text-sm md:text-base font-semibold mt-1 line-clamp-2 group-hover:text-[#FE6A00] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm md:text-base font-bold text-gray-900 mt-2">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
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
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Auto-play video when in viewport
  useEffect(() => {
    const video = videoRef.current
    if (!video || videoError) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoLoaded) {
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
  }, [videoError, videoLoaded])

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

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="group">
      {/* Video container */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video mb-4 shadow-lg">
        {/* Poster/Fallback image */}
        {(!videoLoaded || videoError) && (
          <img
            src={wader.posterUrl}
            alt={wader.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://planetaoutdoor.cl/wp-content/uploads/2025/11/Patagonia-Waders-Fallback.jpg'
            }}
          />
        )}

        {!videoError && (
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src={wader.videoUrl}
            loop
            muted
            playsInline
            autoPlay
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlayThrough={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            webkit-playsinline="true"
          />
        )}

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

        {/* Play button center (when paused and video available) */}
        {!isPlaying && !videoError && videoLoaded && (
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

        {/* Loading indicator */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
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
