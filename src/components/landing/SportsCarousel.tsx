import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'

interface Sport {
  id: number
  title: string
  description: string
  image: string
  href: string
}

const sports: Sport[] = [
  {
    id: 1,
    title: 'Waders',
    description: 'Equipamiento profesional de vadeo',
    image: '/images/sports/waders.jpg',
    href: '/tienda/waders',
  },
  {
    id: 2,
    title: 'Botas de Vadeo',
    description: 'Tracción y comodidad en el río',
    image: '/images/sports/botas.jpg',
    href: '/tienda/botas',
  },
  {
    id: 3,
    title: 'Cañas y Carretes',
    description: 'El equipo esencial para pescar',
    image: '/images/sports/canas.jpg',
    href: '/tienda/canas',
  },
  {
    id: 4,
    title: 'Accesorios',
    description: 'Todo lo que necesitas',
    image: '/images/sports/accesorios.jpg',
    href: '/tienda/accesorios',
  },
]

export function SportsCarousel() {
  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Explora por deporte</h2>
          <Link
            to="/deportes"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.sports-prev',
              nextEl: '.sports-next',
            }}
            spaceBetween={12}
            slidesPerView={1.3}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {sports.map((sport) => (
              <SwiperSlide key={sport.id}>
                <Link to={sport.href} className="block group">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/4]">
                    <img
                      src={sport.image}
                      alt={sport.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {sport.title}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm mb-3 md:mb-4">
                        {sport.description}
                      </p>
                      <span className="inline-flex items-center text-white text-xs sm:text-sm font-medium group-hover:underline">
                        Ver más
                        <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
          <button className="sports-prev w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <button className="sports-next w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile Link */}
        <div className="md:hidden text-center mt-6">
          <Link
            to="/deportes"
            className="inline-flex items-center justify-center px-6 py-3 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Ver todos los deportes
          </Link>
        </div>
      </div>
    </section>
  )
}
