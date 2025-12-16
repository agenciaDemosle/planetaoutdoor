import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SkwalaProduct {
  id: number
  name: string
  slug: string
  price: string
  image: string
  category: string
}

const skwalaWaders: SkwalaProduct[] = [
  {
    id: 7769,
    name: 'RS Wader',
    slug: 'skwala-rs-wader',
    price: '$1.125.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/10/rs-wader-385804_900x.webp',
    category: 'Waders',
  },
  {
    id: 7519,
    name: 'Carbon Wader',
    slug: 'skwala-carbon-wader',
    price: '$728.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/10/skwala-carbon-waders-front.png',
    category: 'Waders',
  },
]

const skwalaBoots: SkwalaProduct[] = [
  {
    id: 7774,
    name: 'RS Botas de Vadeo',
    slug: 'skwala-rs-botas-de-vadeo',
    price: '$436.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/10/rs-wading-boot-3594174_1080x.webp',
    category: 'Botas',
  },
  {
    id: 7784,
    name: 'Carbon Botas de Vadeo',
    slug: 'skwala-carbon-botas-de-vadeo',
    price: '$383.000',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/10/carbon-wading-boot-326920_900x-1.webp',
    category: 'Botas',
  },
]

export function SkwalaSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Banner principal con imagen de fondo */}
        <div className="relative mb-10 md:mb-14 rounded-2xl overflow-hidden">
          <img
            src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/channels4_banner.jpg"
            alt="Skwala"
            className="w-full h-48 md:h-64 lg:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                SKWALA
              </h2>
              <p className="text-white/80 mt-2 max-w-md text-sm md:text-base">
                Equipamiento de pesca de alta gama. Innovación y rendimiento.
              </p>
            </div>
            <Link
              to="/tienda?search=skwala"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver productos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Waders Section - Productos + Video */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* Productos de waders */}
            <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col justify-center order-2 lg:order-1">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Waders Skwala</h3>
              <div className="grid grid-cols-2 gap-6">
                {skwalaWaders.map((product) => (
                  <Link
                    key={product.id}
                    to={`/producto/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden bg-white rounded-lg mb-3 cursor-zoom-in">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-150 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#FE6A00] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Video */}
            <div className="relative w-full lg:w-64 xl:w-80 flex-shrink-0 order-1 lg:order-2">
              <div className="aspect-[9/16] lg:aspect-auto lg:h-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/videos/skwala_waders_hd.mp4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botas Section - Video + 2 productos */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* Video */}
            <div className="relative w-full lg:w-64 xl:w-80 flex-shrink-0">
              <div className="aspect-[9/16] lg:aspect-auto lg:h-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/videos/skwala_video_hd.mp4"
                />
              </div>
            </div>

            {/* Productos de botas */}
            <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Botas de Vadeo</h3>
              <div className="grid grid-cols-2 gap-6">
                {skwalaBoots.map((product) => (
                  <Link
                    key={product.id}
                    to={`/producto/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden bg-white rounded-lg mb-3 cursor-zoom-in">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-150 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#FE6A00] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkwalaSection
