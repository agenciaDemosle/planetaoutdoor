import { Helmet } from 'react-helmet-async'
import { useEffect, useRef, useState } from 'react'

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

export function NosotrosPage() {
  const quote = useScrollAnimation()
  const inicios = useScrollAnimation()
  const tienda = useScrollAnimation()
  const jugueteria = useScrollAnimation()
  const final = useScrollAnimation()
  return (
    <>
      <Helmet>
        <title>Nuestra Historia | Planeta Outdoor</title>
        <meta
          name="description"
          content="Conoce la historia de Planeta Outdoor, desde 2007 construyendo la tienda de referencia en pesca y outdoor en Chile. Asesoría honesta desde Temuco."
        />
      </Helmet>

      {/* Hero Section - Full width image with sticky effect */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <img
            src="/images/web/hero-nosotros.jpg"
            alt="Planeta Outdoor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 text-white/80 animate-hero-text">
            Desde 2007
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight animate-hero-text-delay-1">
            Nuestra Historia
          </h1>
        </div>
      </section>

      {/* Intro Quote - Patagonia style large typography */}
      <section ref={quote.ref as React.RefObject<HTMLElement>} className="py-20 md:py-32 lg:py-40 bg-white relative z-10">
        <div className={`max-w-5xl mx-auto px-6 md:px-10 transition-all duration-1000 ${quote.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed text-center text-gray-900">
            "De vender por encargo en una pequeña habitación a transformarse en la juguetería de los pescadores."
          </blockquote>
          <p className="text-center mt-8 text-gray-500 text-sm uppercase tracking-widest">
            Nuestro camino
          </p>
        </div>
      </section>

      {/* Story Section 1 - Los Inicios */}
      <section ref={inicios.ref as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-[#f7f7f7] relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`transition-all duration-700 ${inicios.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
                Los Inicios
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">
                Construida a pulso
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Lo que comenzó siempre como ayuda y asesoría de manera desinteresada se transformó en una tienda construida a pulso.
                </p>
                <p>
                  La base siempre fue la confianza: muchas cosas llegaban por encargo, venta calzada, muchas veces pagadas antes de ser entregadas, y la regla era cumplir los compromisos.
                </p>
                <p>
                  Al principio todo cabía en una pieza de la casa de sus padres: unas pocas cosas, algunas cajas, moscas y equipo que se traía y recomendaba en los viajes de pesca.
                </p>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-200 ${inicios.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Contenedor de imagen con marco */}
              <div className="relative p-3 md:p-4">
                {/* Marco decorativo */}
                <div className="absolute inset-0 border-2 border-gray-300" />
                <div className="absolute inset-2 md:inset-3 border border-gray-200" />
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src="/images/web/perro-historia.jpg"
                    alt="Los inicios de Planeta Outdoor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Marker */}
      <section className="py-20 md:py-28 text-center bg-white relative z-10">
        <p className="text-8xl md:text-9xl font-light text-gray-200">2007</p>
        <p className="text-lg text-gray-600 mt-4">Formalización de Planeta Outdoor</p>
      </section>

      {/* Story Section 2 - La Tienda */}
      <section ref={tienda.ref as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-[#f7f7f7] relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`order-2 lg:order-1 relative transition-all duration-700 ${tienda.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Contenedor de imagen con marco */}
              <div className="relative p-3 md:p-4">
                {/* Marco decorativo */}
                <div className="absolute inset-0 border-2 border-gray-300" />
                <div className="absolute inset-2 md:inset-3 border border-gray-200" />
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src="/images/web/tienda-fisica.jpg"
                    alt="La tienda física de Planeta Outdoor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className={`order-1 lg:order-2 transition-all duration-700 delay-200 ${tienda.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
                2015 - 2016
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">
                La tienda física
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  El 2015 marcó un salto importante: una casa grande y vieja comenzó a convertirse, con poco dinero, mucha imaginación y mucho trabajo, en la tienda física.
                </p>
                <p>
                  Para 2016 la tienda ya estaba prácticamente construida y comenzó una nueva etapa: hacerla funcionar y consolidarla.
                </p>
                <p>
                  Poco antes de que la tienda empezara a funcionar llegó Gabriel, conocido como "El Palo", que fue clave en esa etapa para sacar el proyecto adelante. Más adelante se sumó Daniel, continuando con la tarea de empujar la tienda y hacerla crecer día a día.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La juguetería de los pescadores - Con fondo de pescador al atardecer */}
      <section ref={jugueteria.ref as React.RefObject<HTMLElement>} className="relative min-h-[600px] md:min-h-[700px] flex items-center z-10">
        {/* Borde superior con forma de montañas invertidas */}
        <svg className="absolute top-0 left-0 w-full h-12 md:h-20 text-white z-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 0 L0 50 L180 30 L360 60 L540 20 L720 45 L900 15 L1080 40 L1260 25 L1440 55 L1440 0 Z" fill="currentColor" />
        </svg>

        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="/images/web/paisaje-jugueteria.jpg"
            alt="Paisaje Patagonia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Borde inferior con forma de montañas */}
        <svg className="absolute bottom-0 left-0 w-full h-12 md:h-20 text-black z-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 100 L0 40 L200 60 L400 25 L600 50 L800 15 L1000 45 L1200 20 L1440 55 L1440 100 Z" fill="currentColor" />
        </svg>

        {/* Decoración anzuelo esquina superior izquierda */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 w-16 h-16 md:w-24 md:h-24 opacity-30">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white w-full h-full">
            <path d="M10 10 L10 50 Q10 70 30 70 L50 70" strokeLinecap="round" />
            <circle cx="50" cy="70" r="8" />
            <path d="M58 70 Q70 70 70 58 L70 30" strokeLinecap="round" />
          </svg>
        </div>

        {/* Decoración anzuelo esquina inferior derecha */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 md:w-24 md:h-24 opacity-30 rotate-180">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white w-full h-full">
            <path d="M10 10 L10 50 Q10 70 30 70 L50 70" strokeLinecap="round" />
            <circle cx="50" cy="70" r="8" />
            <path d="M58 70 Q70 70 70 58 L70 30" strokeLinecap="round" />
          </svg>
        </div>

        {/* Contenido */}
        <div className={`relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-20 text-center transition-all duration-1000 ${jugueteria.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
            Hoy
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 text-white leading-tight">
            La juguetería de los pescadores
          </h2>

          {/* Línea decorativa con anzuelo */}
          <div className="flex items-center gap-4 mb-8 justify-center">
            <div className="w-12 h-px bg-white/50" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#FE6A00]">
              <path d="M12 2 L12 8 Q12 14 6 14 L4 14" strokeLinecap="round" />
              <circle cx="4" cy="14" r="2" />
            </svg>
            <div className="w-12 h-px bg-white/50" />
          </div>

          <div className="space-y-5 text-white/90 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              Hoy la tienda física de Planeta Outdoor es un lugar de encuentro, asesoría y aprendizaje para la comunidad de pescadores, nuevos pescadores y amigos, no solo un punto de venta.
            </p>
            <p>
              Muchos la describen como <span className="font-medium text-white">"la juguetería de los pescadores"</span>, y más de alguno ha entrado diciendo que esto es "como estar en Disney".
            </p>
            <p>
              Planeta Outdoor es hoy una tienda de referencia en pesca y outdoor en Chile, pero detrás hay años de trabajo, confianza y decisiones cuidadas, y la base sigue siendo la misma.
            </p>
          </div>
        </div>
      </section>

      {/* Final Statement - Large Typography */}
      <section ref={final.ref as React.RefObject<HTMLElement>} className="py-24 md:py-40 bg-black text-white relative z-10">
        <div className={`max-w-5xl mx-auto px-6 md:px-10 text-center transition-all duration-1000 ${final.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Planeta Outdoor siempre fue y será{' '}
            <span className="text-[#FE6A00]">asesoría honesta</span>.
          </p>
        </div>
      </section>

    </>
  )
}
