import { Link } from 'react-router-dom'

interface FishingType {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  image: string
  href: string
  variant: 'primary' | 'secondary'
}

const fishingTypes: FishingType[] = [
  {
    id: 'fly-fishing',
    title: 'Pesca Con Mosca',
    subtitle: 'Productos y Accesorios',
    description: 'El arte del fly fishing. Técnica elegante que imita insectos con moscas artificiales para truchas y salmónidos en ríos y lagos.',
    features: ['Cañas de mosca', 'Carretes fly', 'Líneas flotantes y hundidas', 'Moscas secas y ninfas', 'Waders y botas'],
    image: 'https://images.unsplash.com/photo-1532015917327-bc8dd498a237?w=600&h=400&fit=crop',
    href: '/tienda?categoria=canas',
    variant: 'primary',
  },
  {
    id: 'sea-fishing',
    title: 'Pesca De Mar',
    subtitle: 'Productos y Accesorios',
    description: 'Equipamiento robusto para enfrentar las especies más grandes. Pesca de orilla, embarcado o kayak en aguas saladas.',
    features: ['Cañas de surf casting', 'Carretes de alto torque', 'Señuelos de agua salada', 'Líneas resistentes', 'Accesorios anticorrosión'],
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop',
    href: '/tienda?categoria=senuelos',
    variant: 'secondary',
  },
  {
    id: 'traditional',
    title: 'Pesca Tradicional',
    subtitle: 'Pesca Spinning y UL',
    description: 'Versatilidad máxima con señuelos artificiales. Ideal para truchas, percas y especies de agua dulce con equipos livianos.',
    features: ['Cañas spinning y ultralight', 'Carretes frontales', 'Cucharas y spinners', 'Señuelos blandos', 'Líneas trenzadas'],
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=600&h=400&fit=crop',
    href: '/tienda?categoria=senuelos',
    variant: 'primary',
  },
]

export function FishingTypesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#fafafa]">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-10 lg:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
            Tipos de Pesca
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Cada modalidad tiene su técnica, equipo y magia propia
          </p>
        </header>

        {/* Cards Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {fishingTypes.map((type) => (
            <article
              key={type.id}
              className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col ${
                type.variant === 'primary'
                  ? 'bg-[#FE6A00] text-white'
                  : 'bg-[#f5f5f0] text-gray-900'
              }`}
            >
              {/* Image Container */}
              <div className="p-4 pb-0 md:p-5 md:pb-0">
                <img
                  src={type.image}
                  alt={type.title}
                  loading="lazy"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-1">
                {/* Title & Subtitle */}
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {type.title}
                  </h3>
                  <p className={`text-sm font-medium ${
                    type.variant === 'primary' ? 'text-white/80' : 'text-[#FE6A00]'
                  }`}>
                    {type.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-4 ${
                  type.variant === 'primary' ? 'opacity-90' : 'text-gray-600'
                }`}>
                  {type.description}
                </p>

                {/* Features List */}
                <ul className={`text-xs space-y-1.5 mb-5 flex-1 ${
                  type.variant === 'primary' ? 'text-white/85' : 'text-gray-500'
                }`}>
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        type.variant === 'primary' ? 'bg-white/70' : 'bg-[#FE6A00]'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <div className="mt-auto">
                  <Link
                    to={type.href}
                    className={`inline-block px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                      type.variant === 'primary'
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-[#FE6A00] text-white hover:bg-[#e55f00]'
                    }`}
                  >
                    Catálogo
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
