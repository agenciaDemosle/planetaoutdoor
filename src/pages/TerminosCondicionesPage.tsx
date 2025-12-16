import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ChevronRight, Shield, Truck, CreditCard, RefreshCw, Mail, Phone, MapPin } from 'lucide-react'

export function TerminosCondicionesPage() {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | Planeta Outdoor</title>
        <meta
          name="description"
          content="Términos y condiciones de compra en Planeta Outdoor. Información sobre envíos a Chile y Argentina, devoluciones, garantías y políticas de privacidad."
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-black">
              Inicio
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-black font-medium">Términos y Condiciones</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6 text-white/70">
            Información Legal
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light">
            Términos y Condiciones
          </h1>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Truck className="w-8 h-8 mx-auto mb-3 text-black" />
              <p className="text-sm font-medium text-gray-900">Envíos a Chile y Argentina</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-3 text-black" />
              <p className="text-sm font-medium text-gray-900">Compra Segura</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <CreditCard className="w-8 h-8 mx-auto mb-3 text-black" />
              <p className="text-sm font-medium text-gray-900">Múltiples Medios de Pago</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 text-black" />
              <p className="text-sm font-medium text-gray-900">Cambios y Devoluciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">

          {/* Introducción */}
          <div className="mb-16">
            <p className="text-lg text-gray-600 leading-relaxed">
              Bienvenido a Planeta Outdoor. Al realizar una compra en nuestra tienda, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de realizar tu pedido.
            </p>
          </div>

          {/* Sección 1: Información de la Empresa */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              1. Información de la Empresa
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong className="text-gray-900">Razón Social:</strong> Planeta Outdoor
              </p>
              <p>
                <strong className="text-gray-900">Ubicación:</strong> Temuco, Región de La Araucanía, Chile
              </p>
              <p>
                <strong className="text-gray-900">Giro:</strong> Venta de artículos de pesca con mosca y outdoor
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a href="mailto:info@planetaoutdoor.cl" className="flex items-center gap-2 text-black hover:text-gray-600">
                  <Mail size={18} />
                  info@planetaoutdoor.cl
                </a>
                <div className="flex flex-col gap-1">
                  <a href="tel:+56983610365" className="flex items-center gap-2 text-black hover:text-gray-600">
                    <Phone size={18} />
                    Eduardo: +56 9 8361 0365
                  </a>
                  <a href="tel:+56932563910" className="flex items-center gap-2 text-black hover:text-gray-600">
                    <Phone size={18} />
                    Daniel: +56 9 3256 3910
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Productos y Precios */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              2. Productos y Precios
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Todos los precios publicados en nuestro sitio web están expresados en <strong className="text-gray-900">Pesos Chilenos (CLP)</strong> e incluyen IVA cuando corresponda.
              </p>
              <p>
                Nos reservamos el derecho de modificar los precios sin previo aviso. El precio aplicable será el vigente al momento de confirmar tu pedido.
              </p>
              <p>
                Las fotografías de los productos son referenciales. Pueden existir variaciones menores en colores o presentación debido a las pantallas de los dispositivos.
              </p>
              <p>
                La disponibilidad de productos está sujeta a stock. En caso de no contar con stock, te contactaremos para ofrecerte alternativas o el reembolso correspondiente.
              </p>
            </div>
          </div>

          {/* Sección 3: Envíos y Despachos */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              3. Políticas de Despacho
            </h2>

            {/* Chile */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-black" />
                <h3 className="text-xl font-medium text-gray-900">Clientes en Chile</h3>
              </div>
              <div className="space-y-4 text-gray-600 pl-8">
                <p>
                  Realizamos envíos a todo el país mediante:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-gray-900">Correos de Chile</strong></li>
                  <li><strong className="text-gray-900">Starken</strong></li>
                  <li><strong className="text-gray-900">Chilexpress</strong></li>
                </ul>
                <p>
                  Los pedidos generalmente se despachan <strong className="text-gray-900">al día hábil siguiente</strong>, pero considera entre <strong className="text-gray-900">2 a 3 días hábiles</strong> para el despacho durante períodos de alta demanda.
                </p>
                <p>
                  Si necesitas tu compra con urgencia, <strong className="text-gray-900">consulta por WhatsApp</strong> para confirmar tiempos y disponibilidad.
                </p>
              </div>
            </div>

            {/* Argentina */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-black" />
                <h3 className="text-xl font-medium text-gray-900">Clientes de Argentina</h3>
              </div>
              <div className="space-y-4 text-gray-600 pl-8">
                <p>
                  Ofrecemos puntos de retiro cercanos a los pasos fronterizos:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-gray-900">Icalma:</strong> en el pueblo de Icalma, apenas cruzando la Aduana.</li>
                  <li><strong className="text-gray-900">Curarrehue:</strong> punto de retiro cercano al paso internacional Mamuil Malal.</li>
                </ul>
                <p>
                  <strong className="text-gray-900">Estos retiros deben ser coordinados previamente con el personal de la tienda por WhatsApp</strong>, para confirmar horarios, ubicación exacta y disponibilidad.
                </p>
                <p>
                  Para clientes de <strong className="text-gray-900">Neuquén y alrededores</strong>, consultar por WhatsApp las formas de envío o retiro disponibles.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm">
                    <strong className="text-gray-900">Importante:</strong> Los pagos desde Argentina se realizan <strong className="text-gray-900">solo por WebPay</strong>. Mercado Pago funciona exclusivamente para compras dentro de Chile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 4: Medios de Pago */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              4. Medios de Pago
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>Aceptamos los siguientes medios de pago:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900">WebPay Plus:</strong> Tarjetas de crédito y débito (Visa, Mastercard, American Express, Redcompra)</li>
                <li><strong className="text-gray-900">Transferencia bancaria:</strong> Banco Estado, Banco de Chile, Santander, BCI y otros</li>
                <li><strong className="text-gray-900">Cuotas sin interés:</strong> 3, 6 o 12 cuotas según tu banco emisor</li>
              </ul>
              <p className="mt-4">
                Todas las transacciones son procesadas de forma segura. No almacenamos datos de tarjetas de crédito en nuestros servidores.
              </p>
            </div>
          </div>

          {/* Sección 5: Cambios y Devoluciones */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              5. Cambios y Devoluciones
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Tienes <strong className="text-gray-900">30 días corridos</strong> desde la recepción del producto para solicitar un cambio o devolución, siempre que:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>El producto se encuentre en su empaque original, sin uso y con todas sus etiquetas</li>
                <li>Cuentes con la boleta o factura de compra</li>
                <li>El producto no presente daños causados por mal uso</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Derecho a Retracto</h3>
              <p>
                Según la Ley del Consumidor, tienes derecho a retractarte de tu compra dentro de los <strong className="text-gray-900">10 días</strong> siguientes a la recepción del producto, sin necesidad de expresar causa.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Productos con Defectos</h3>
              <p>
                Si el producto presenta defectos de fábrica, nos haremos cargo del envío de devolución y te ofreceremos reemplazo o reembolso completo.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <p className="text-sm text-gray-600">
                  Para iniciar un proceso de cambio o devolución, contáctanos a <a href="mailto:info@planetaoutdoor.cl" className="text-black underline">info@planetaoutdoor.cl</a> indicando tu número de pedido y el motivo de la solicitud.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 6: Garantía */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              6. Garantía
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Todos nuestros productos cuentan con la <strong className="text-gray-900">garantía legal de 3 meses</strong> establecida por la Ley del Consumidor en Chile.
              </p>
              <p>
                Algunos productos de marcas premium como Patagonia, Simms, Sage y otros, pueden contar con garantías extendidas del fabricante. Consulta las condiciones específicas de cada marca.
              </p>
              <p>
                La garantía no cubre daños causados por mal uso, desgaste normal, modificaciones no autorizadas o accidentes.
              </p>
            </div>
          </div>

          {/* Sección 7: Privacidad */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              7. Privacidad y Protección de Datos
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                En Planeta Outdoor respetamos tu privacidad. Los datos personales que nos proporcionas serán utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Procesar y enviar tus pedidos</li>
                <li>Comunicarnos contigo sobre el estado de tu compra</li>
                <li>Enviarte información promocional (solo si lo autorizas)</li>
                <li>Mejorar nuestros servicios</li>
              </ul>
              <p className="mt-4">
                No compartimos ni vendemos tus datos personales a terceros, excepto cuando sea necesario para completar tu pedido (empresas de courier, procesadores de pago).
              </p>
            </div>
          </div>

          {/* Sección 8: Propiedad Intelectual */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              8. Propiedad Intelectual
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos, diseños y código, es propiedad de Planeta Outdoor o de sus respectivos propietarios y está protegido por las leyes de propiedad intelectual.
              </p>
              <p>
                Queda prohibida la reproducción, distribución o modificación del contenido sin autorización expresa.
              </p>
            </div>
          </div>

          {/* Sección 9: Modificaciones */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              9. Modificaciones a los Términos
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigencia desde su publicación en el sitio web.
              </p>
              <p>
                Te recomendamos revisar periódicamente esta página para estar informado de cualquier actualización.
              </p>
              <p className="text-sm text-gray-500 mt-6">
                Última actualización: Diciembre 2024
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#f7f7f7]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
            ¿Tienes dudas?
          </h2>
          <p className="text-gray-600 mb-8">
            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus consultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
            >
              Contactar
            </Link>
            <a
              href="https://wa.me/56983610365"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-black text-black text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
