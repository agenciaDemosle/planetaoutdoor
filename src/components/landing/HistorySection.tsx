import { Store, Heart, Users, Award } from 'lucide-react'

export function HistorySection() {
  return (
    <section className="bg-[#1a1a1a] text-white">
      {/* Video Hero */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/doudjiatu/video/upload/v1765628463/historia-hero_svraqx.mp4"
        />
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Contenido sobre el video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <span className="inline-block text-xs md:text-sm uppercase tracking-[0.3em] mb-4 text-white/80">
              Desde 2007
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Más que una tienda, un lugar de encuentro para la comunidad de pescadores
            </p>
          </div>
        </div>
        {/* Gradiente inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
      </div>

      {/* Contenido */}
      <div className="py-12 md:py-16 lg:py-20 px-4 md:px-10 lg:px-20 max-w-container mx-auto">

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Story text */}
          <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              Lo que comenzó siempre como ayuda y asesoría de manera desinteresada se transformó en una tienda construida a pulso. Desde el inicio la idea fue simple: <span className="text-white font-medium">que cada persona pudiera armar el mejor equipo posible con el dinero que estaba invirtiendo</span>. La base siempre fue la confianza: muchas cosas llegaban por encargo, venta calzada, muchas veces pagadas antes de ser entregadas, y la regla era cumplir los compromisos.
            </p>

            <p>
              Al principio todo cabía en una pieza de la casa de sus padres: unas pocas cosas, algunas cajas, moscas y equipo que se traía y recomendaba en los viajes de pesca. Con el tiempo ese esfuerzo empezó a tomar forma y a formalizarse el <span className="text-[#FE6A00] font-semibold">2007</span>. Planeta Outdoor no fue siempre la tienda consolidada que es hoy: se partió prácticamente de cero y se fue avanzando paso a paso, temporada tras temporada.
            </p>

            <p>
              El <span className="text-[#FE6A00] font-semibold">2015</span> marcó un salto importante: una casa grande y vieja comenzó a convertirse, con poco dinero, mucha imaginación y trabajo, en la tienda física. Para <span className="text-[#FE6A00] font-semibold">2008</span> la tienda ya estaba prácticamente construida y comenzó una nueva etapa: hacerla funcionar y consolidarla. Poco antes de que la tienda empezara a funcionar llegó Gabriel, conocido como "El Palo", que fue clave en esa etapa para sacar el proyecto adelante. Más adelante se sumó Daniel, continuando con la tarea de empujar la tienda y hacerla crecer día a día.
            </p>

            <p>
              Hoy la tienda física de Planeta Outdoor es un lugar de encuentro, asesoría y aprendizaje para la comunidad de pescadores, nuevos pescadores y amigos, no solo un punto de venta. Muchos la describen como <span className="text-white font-medium italic">"la juguetería de los pescadores"</span>, y más de alguno ha entrado diciendo que esto es <span className="text-white font-medium italic">"como estar en Disney"</span>. Planeta Outdoor es hoy una tienda de referencia en pesca y outdoor en Chile, pero detrás hay años de trabajo, confianza y decisiones cuidadas, y la base sigue siendo la misma:
            </p>

            <p className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#FE6A00] pl-4 py-2">
              Planeta Outdoor siempre fue y será asesoría honesta.
            </p>
          </div>

          {/* Right - Image and highlights */}
          <div className="space-y-8">
            {/* Store image placeholder */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-800">
              <img
                src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/tienda-fisica.jpg"
                alt="Tienda Planeta Outdoor"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/80 text-sm">Recreo 838, Temuco</p>
                <p className="text-white font-bold text-lg">La juguetería de los pescadores</p>
              </div>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Store className="w-8 h-8 mx-auto mb-2 text-[#FE6A00]" />
                <p className="text-2xl font-bold">2007</p>
                <p className="text-xs text-gray-400">Fundación</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-[#FE6A00]" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-gray-400">Asesoría honesta</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-[#FE6A00]" />
                <p className="text-2xl font-bold">2008</p>
                <p className="text-xs text-gray-400">Tienda física</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-[#FE6A00]" />
                <p className="text-2xl font-bold">#1</p>
                <p className="text-xs text-gray-400">Referencia en Chile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
