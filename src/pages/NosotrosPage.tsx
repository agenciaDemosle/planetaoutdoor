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
  const formalizacion = useScrollAnimation()
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

      {/* Hero Section - Full width video */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/doudjiatu/video/upload/v1765628463/historia-hero_svraqx.mp4"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 text-white/80">
            Desde 2007
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
            Nuestra Historia
          </h1>
        </div>
      </section>

      {/* Intro Quote */}
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
                  Lo que comenzó siempre como ayuda y asesoría de manera desinteresada se fue transformando en una tienda construida a pulso.
                </p>
                <p>
                  La base siempre fue la confianza de la gente: muchas cosas llegaban por encargo, venta calzada, muchas veces pagadas antes de ser entregadas, y la regla era cumplir los compromisos.
                </p>
                <p>
                  Al principio todo cabía en una pieza en la casa de mis padres: unas pocas cosas, algunas cajas, moscas y equipo que se traía y recomendaba en los viajes de pesca.
                </p>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-200 ${inicios.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative p-3 md:p-4">
                <div className="absolute inset-0 border-2 border-gray-300" />
                <div className="absolute inset-2 md:inset-3 border border-gray-200" />
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/perro-historia.jpg"
                    alt="Los inicios de Planeta Outdoor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Marker - 2007 */}
      <section ref={formalizacion.ref as React.RefObject<HTMLElement>} className="py-20 md:py-28 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className={`text-center transition-all duration-700 ${formalizacion.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-8xl md:text-9xl font-light text-gray-200">2007</p>
            <h3 className="text-xl md:text-2xl font-light text-gray-900 mt-4 mb-8">
              Formalización de Planeta Outdoor
            </h3>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-600 text-lg leading-relaxed text-left">
              <p>
                Con los años, ese pequeño espacio y la asesoría desinteresada se fueron transformando en algo más ordenado. El año 2007 comienza la formalización de Planeta Outdoor como proyecto: organizar los encargos, ponerle nombre a la idea y comenzar a trabajar ya como tienda, aunque todo siguiera cabiendo en esa misma pieza en la casa de mis padres.
              </p>
              <p>
                En ese momento la tienda física seguía siendo un sueño lejano: un lugar donde se encontraran pescadores, quienes recién estaban empezando y amigos, en torno a la pesca, la conversación y el río.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 2 - La Tienda Física */}
      <section ref={tienda.ref as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-[#f7f7f7] relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`order-2 lg:order-1 relative transition-all duration-700 ${tienda.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative p-3 md:p-4">
                <div className="absolute inset-0 border-2 border-gray-300" />
                <div className="absolute inset-2 md:inset-3 border border-gray-200" />
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/tienda-fisica.jpg"
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
                  El 2015 marcó un salto importante: una casa grande y vieja empezó a convertirse en la tienda física de Planeta Outdoor. Fue un proceso con poco dinero, mucha imaginación, aterrizando las ideas al presupuesto y haciendo lo mejor posible con los recursos que teníamos.
                </p>
                <p>
                  Para 2016 el grueso de la construcción ya estaba prácticamente listo, pero todavía no había muebles y había poco o nada de mercadería. De nuevo fueron los amigos de siempre quienes apoyaron el proyecto con compras por encargo. Para ese entonces ya nos habíamos ganado la confianza de algunos proveedores, que nos financiaban con pequeños créditos cortos para ir llenando la tienda de vida y productos.
                </p>
                <p>
                  Poco antes de abrir llegó Gabriel, conocido como "El Palo", que fue clave para sacar el proyecto adelante. Con Gabriel fueron años de aprendizaje, mucha pesca y un poquito de rock and roll. Más adelante se sumó Daniel, continuando con la tarea de empujar la tienda y hacerla crecer día a día.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La juguetería de los pescadores */}
      <section ref={jugueteria.ref as React.RefObject<HTMLElement>} className="relative min-h-[600px] md:min-h-[700px] flex items-center z-10">
        <svg className="absolute top-0 left-0 w-full h-12 md:h-20 text-[#f7f7f7] z-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 0 L0 50 L180 30 L360 60 L540 20 L720 45 L900 15 L1080 40 L1260 25 L1440 55 L1440 0 Z" fill="currentColor" />
        </svg>

        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/doudjiatu/video/upload/v1765628463/jugueteria-hero_mcl4zy.mp4"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-12 md:h-20 text-black z-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 100 L0 40 L200 60 L400 25 L600 50 L800 15 L1000 45 L1200 20 L1440 55 L1440 100 Z" fill="currentColor" />
        </svg>

        <div className={`relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-20 text-center transition-all duration-1000 ${jugueteria.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
            Hoy
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 text-white leading-tight">
            La juguetería de los pescadores
          </h2>

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
              Planeta Outdoor es hoy una tienda de referencia en pesca y outdoor en Chile. Detrás hay años de trabajo, confianza y decisiones cuidadas, y la base sigue siendo la misma:
            </p>
          </div>
        </div>
      </section>

      {/* Final Statement */}
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
