import { Video } from 'lucide-react'

export function NewsletterSection() {
  return (
    <section className="relative w-full bg-[#1a3a4a] overflow-visible">
      {/* Contenedor con imagen del glaciar */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-visible">
        {/* Imagen de fondo - glaciar */}
        <img
          src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/glaciar-newsletter.jpg"
          alt="Glaciar en la Patagonia"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />

        {/* Gradiente superior que se mezcla con el color de transición */}
        <div
          className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #1a3a4a 0%, transparent 100%)'
          }}
        />

        {/* Gradiente hacia negro abajo para mezclarse con el footer */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 1) 100%)'
          }}
        />

        {/* Simon Container Mobile - Con difuminado abajo */}
        <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]">
          <img
            src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/simon-2-1.png"
            alt="Simon - Asistente de Planeta Outdoor"
            className="w-full h-full object-contain object-bottom"
          />
          {/* Difuminado en la parte inferior */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)'
            }}
          />
        </div>

        {/* Speech Bubble Mobile - Arriba de Simon */}
        <div className="md:hidden absolute bottom-[320px] sm:bottom-[400px] left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl p-3 w-[170px] sm:w-[190px]">
          <p className="text-gray-900 font-bold text-xs sm:text-sm">
            Hola soy Simon!
          </p>
          <p className="text-gray-600 text-[10px] sm:text-xs mt-1">
            ¿Tienes dudas con tu talla o quieres ver tu producto en tiempo real?
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col gap-1.5 mt-2">
            <a
              href="https://wa.me/56983610365?text=Hola!%20Tengo%20dudas%20con%20mi%20talla"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium text-white bg-[#25D366] hover:bg-[#20bd5a] px-2.5 py-1.5 rounded-full transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pregúntame
            </a>
            <a
              href="https://wa.me/56983610365?text=Hola!%20Quiero%20una%20video%20llamada%20AHORA%20para%20asesor%C3%ADa%20de%20tallas%20%F0%9F%8E%A5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <Video size={12} />
              Video llamada
            </a>
          </div>

          {/* Bubble tail pointing down hacia Simon */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45"
          />
        </div>

        {/* Simon Helper Desktop - Lateral izquierdo inferior */}
        <div className="hidden md:flex absolute bottom-0 left-0 z-30 items-end">
          {/* Simon Image Desktop - Simon.png grande */}
          <img
            src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/simon-1.png"
            alt="Simon - Asistente de Planeta Outdoor"
            className="md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] object-contain"
          />

          {/* Speech Bubble Desktop */}
          <div className="relative mb-44 lg:mb-56 xl:mb-64 -ml-8 bg-white rounded-2xl shadow-2xl p-4 lg:p-5 w-[220px] lg:w-[260px]">
            <p className="text-gray-900 font-bold text-sm lg:text-base">
              Hola soy Simon!
            </p>
            <p className="text-gray-600 text-xs lg:text-sm mt-1">
              ¿Tienes dudas con tu talla o quieres ver tu producto en tiempo real?
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2 mt-3">
              <a
                href="https://wa.me/56983610365?text=Hola!%20Tengo%20dudas%20con%20mi%20talla"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#20bd5a] px-3 py-1.5 rounded-full transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pregúntame
              </a>
              <a
                href="https://wa.me/56983610365?text=Hola!%20Quiero%20una%20video%20llamada%20AHORA%20para%20asesor%C3%ADa%20de%20tallas%20%F0%9F%8E%A5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors"
              >
                <Video size={14} />
                Video llamada
              </a>
            </div>

            {/* Bubble tail pointing to Simon - a la izquierda */}
            <div
              className="absolute -left-2 bottom-4 w-4 h-4 bg-white transform rotate-45"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
