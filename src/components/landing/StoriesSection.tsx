import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'

interface BlogPost {
  id: number
  title: string
  category: string
  excerpt: string
  image: string
  readTime: string
  href: string
  isNew?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Cómo elegir tu primer wader: Guía completa para principiantes',
    category: 'Tips',
    excerpt: 'Todo lo que necesitas saber sobre materiales, tallas y tecnologías para elegir el wader perfecto.',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/waders.webp',
    readTime: '6 min',
    href: '/blog/como-elegir-wader',
    isNew: true,
  },
  {
    id: 2,
    title: '5 nudos esenciales que todo pescador debe dominar',
    category: 'Tips',
    excerpt: 'Aprende los nudos más importantes para asegurar tus moscas y líneas como un profesional.',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/Equipo-de-Pesca.jpg',
    readTime: '8 min',
    href: '/blog/nudos-esenciales',
  },
  {
    id: 3,
    title: 'Los mejores ríos de la Araucanía para pesca con mosca',
    category: 'Destinos',
    excerpt: 'Descubre los spots más espectaculares del sur de Chile para tu próxima aventura de pesca.',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/pescador-rio.jpg',
    readTime: '10 min',
    href: '/blog/rios-araucania',
  },
  {
    id: 4,
    title: 'Mantenimiento de waders: Cómo alargar la vida de tu equipo',
    category: 'Tips',
    excerpt: 'Consejos prácticos para limpiar, reparar y almacenar tus waders correctamente.',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/waders-1.webp',
    readTime: '5 min',
    href: '/blog/mantenimiento-waders',
  },
  {
    id: 5,
    title: 'Temporada 2024: Regulaciones y permisos de pesca en Chile',
    category: 'Noticias',
    excerpt: 'Todo sobre las nuevas regulaciones, fechas de veda y dónde obtener tu licencia de pesca.',
    image: 'https://planetaoutdoor.cl/wp-content/uploads/2025/12/pescador-atardecer.jpg',
    readTime: '7 min',
    href: '/blog/temporada-2024',
    isNew: true,
  },
]

export function StoriesSection() {
  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24">
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 lg:mb-10">
          <div className="flex items-center gap-3">
            <Lightbulb size={28} className="text-nature" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Blog & Tips</h2>
          </div>
          <Link
            to="/blog"
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
              prevEl: '.stories-prev',
              nextEl: '.stories-next',
            }}
            spaceBetween={12}
            slidesPerView={1.1}
            breakpoints={{
              480: {
                slidesPerView: 1.3,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 24,
              },
            }}
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Link to={post.href} className="block group">
                  <article className="bg-white">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/10] sm:aspect-video mb-3 md:mb-4 rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {post.isNew && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-nature text-white text-xs font-medium rounded">
                          Nuevo
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold mb-1 md:mb-2 line-clamp-2 group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 md:mb-3 hidden sm:block">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{post.readTime} de lectura</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}

            {/* Last slide - View All */}
            <SwiperSlide>
              <Link
                to="/blog"
                className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
              >
                <div className="text-center p-6 md:p-8">
                  <ArrowRight size={28} className="mx-auto mb-3 md:mb-4" />
                  <span className="text-base sm:text-lg font-bold">Ver todos los artículos</span>
                </div>
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
          <button className="stories-prev w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <button className="stories-next w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile Link */}
        <div className="md:hidden text-center mt-6">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  )
}
