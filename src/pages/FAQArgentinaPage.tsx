import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, MapPin } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: '¿Puedo comprar desde Argentina en Planeta Outdoor?',
    answer: 'Sí. Enviamos a clientes argentinos y también contamos con puntos de retiro cercanos a la frontera.',
  },
  {
    question: '¿Qué medio de pago puedo usar desde Argentina?',
    answer: 'Las compras internacionales se pagan solo con WebPay. MercadoPago funciona únicamente para compras dentro de Chile.',
  },
  {
    question: '¿Hacen envíos a domicilio en Argentina?',
    answer: 'Por ahora no enviamos a domicilio dentro de Argentina, pero sí podemos coordinar retiros en puntos seguros y cercanos a los pasos fronterizos.',
  },
  {
    question: '¿Cuáles son los puntos de retiro disponibles para Argentina?',
    answer: 'Icalma: en el mismo pueblo, apenas cruzando la aduana chilena.\n\nCurarrehue: cercano al paso Mamuil Malal.\n\nAmbos deben coordinarse previamente por WhatsApp con el equipo de tienda.',
  },
  {
    question: '¿Cuánto tarda mi compra en estar lista?',
    answer: 'Normalmente despachamos al día hábil siguiente, pero considera entre 2 y 3 días hábiles para la preparación. Si estás con apuro, escríbenos y lo vemos juntos.',
  },
  {
    question: '¿Puedo coordinar mi retiro si vengo desde Neuquén u otra zona cercana?',
    answer: 'Sí. Para clientes de Neuquén y alrededores, recomendamos consultar opciones personalizadas por WhatsApp.',
  },
  {
    question: '¿Qué empresas de envío utilizan dentro de Chile?',
    answer: 'Usamos Starken, Chilexpress y Correos de Chile. Si necesitas otra empresa, consúltalo por WhatsApp.',
  },
  {
    question: '¿Qué necesito para retirar mi compra en los puntos cerca de la frontera?',
    answer: 'Solo el comprobante de compra y una coordinación previa por WhatsApp para definir día y hora.',
  },
  {
    question: '¿Puedo recibir asesoría antes de comprar?',
    answer: 'Por supuesto. Podemos enviarte fotos, videos, links de los productos o incluso hacer una videollamada para ayudarte a elegir.',
  },
  {
    question: '¿Tienen stock disponible para Argentina?',
    answer: 'Sí, trabajamos con stock real en tienda y te confirmamos disponibilidad al momento de coordinar el pedido.',
  },
  {
    question: '¿Hay cargos adicionales por comprar desde Argentina?',
    answer: 'No cobramos cargos extras. Solo debes considerar eventuales requisitos o normas locales al regresar a Argentina.',
  },
  {
    question: '¿Cómo los contacto para coordinar el retiro o resolver dudas?',
    answer: 'Escríbenos directo por WhatsApp: Eduardo +56 9 8361 0365 o Daniel +56 9 3256 3910.',
  },
]

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-base md:text-lg font-medium text-gray-900 pr-8 group-hover:text-black transition-colors">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all ${isOpen ? 'bg-black border-black' : 'group-hover:border-gray-400'}`}>
          <ChevronDown
            size={16}
            className={`transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-gray-600'}`}
          />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed whitespace-pre-line pr-12">
          {faq.answer}
        </p>
      </div>
    </div>
  )
}

export function FAQArgentinaPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes - Clientes de Argentina | Planeta Outdoor</title>
        <meta
          name="description"
          content="Preguntas frecuentes para clientes de Argentina. Información sobre puntos de retiro, medios de pago, envíos y coordinación de compras desde Argentina."
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-black transition-colors">
              Inicio
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-black">FAQ Argentina</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Patagonia Style */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">
            Clientes Internacionales
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Argentina
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Sabemos que comprar desde Argentina puede generar algunas dudas.
            Aquí respondemos las consultas más comunes para que tu experiencia sea simple y segura.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="border-t border-gray-200">
            {faqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pickup Points */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.15em] text-gray-500 mb-3">
              Retiro en Frontera
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">
              Puntos de Retiro
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Icalma</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                En el pueblo de Icalma, apenas cruzando la aduana chilena. Ideal para quienes vienen por el paso Icalma.
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Curarrehue</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Punto de retiro cercano al paso internacional Mamuil Malal. Conveniente para quienes vienen desde Junín de los Andes.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Ambos puntos requieren coordinación previa por WhatsApp
          </p>
        </div>
      </section>

      {/* Contact CTA - Patagonia Style */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
            ¿Tienes otra consulta?
          </h2>
          <p className="text-gray-600 mb-8">
            Estamos para ayudarte. Escríbenos por WhatsApp y coordinamos tu compra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/56983610365"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              Eduardo
            </a>
            <a
              href="https://wa.me/56932563910"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              Daniel
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Eduardo: +56 9 8361 0365 | Daniel: +56 9 3256 3910
          </p>
        </div>
      </section>
    </>
  )
}
