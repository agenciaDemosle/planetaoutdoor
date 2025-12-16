import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ChevronRight, FileText, CheckCircle } from 'lucide-react'

export function CondicionesUsoPage() {
  return (
    <>
      <Helmet>
        <title>Condiciones de Uso | Planeta Outdoor</title>
        <meta
          name="description"
          content="Condiciones de uso del sitio web de Planeta Outdoor. Información sobre propiedad intelectual, uso del contenido y limitaciones de responsabilidad."
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
            <span className="text-black font-medium">Condiciones de Uso</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light">
            Condiciones de Uso
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">

          {/* Intro */}
          <div className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Al acceder y utilizar este sitio web, aceptas cumplir con las siguientes condiciones de uso. Te recomendamos leerlas detenidamente.
            </p>
          </div>

          {/* Sección 1 */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">1</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Propiedad Intelectual
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                Todos los contenidos de este sitio, incluyendo textos, imágenes, logotipos, diseños y código fuente, son propiedad de Planeta Outdoor o de sus respectivos autores, y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción, distribución o modificación sin autorización previa.
              </p>
            </div>
          </div>

          {/* Sección 2 */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">2</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Uso del Sitio
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                El usuario se compromete a utilizar este sitio de forma responsable, sin realizar acciones que puedan dañar, sobrecargar o afectar su funcionamiento. Queda prohibido el uso del sitio con fines ilegales o no autorizados.
              </p>
            </div>
          </div>

          {/* Sección 3 */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">3</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Información de Productos
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                Nos esforzamos por mantener la información actualizada, pero no garantizamos que esté libre de errores. Las imágenes son referenciales y pueden existir variaciones menores en los productos.
              </p>
            </div>
          </div>

          {/* Sección 4 */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">4</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Enlaces a Terceros
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                Este sitio puede contener enlaces a páginas externas. No nos hacemos responsables del contenido ni de las políticas de privacidad de esos sitios.
              </p>
            </div>
          </div>

          {/* Sección 5 */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">5</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Limitación de Responsabilidad
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                No seremos responsables por daños directos o indirectos derivados del uso de este sitio, incluyendo interrupciones, errores técnicos o pérdida de datos.
              </p>
            </div>
          </div>

          {/* Sección 6 */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-gray-700">6</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 pt-1">
                Modificaciones
              </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed">
              <p>
                Nos reservamos el derecho de modificar estas condiciones en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio.
              </p>
            </div>
          </div>

          {/* Acceptance Box */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Al continuar navegando en este sitio, aceptas estas condiciones de uso. Si tienes alguna duda, puedes contactarnos a través de nuestra página de <Link to="/contacto" className="text-black underline hover:text-gray-600">contacto</Link>.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Última actualización: Diciembre 2024
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-[#f7f7f7]">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            Documentos relacionados
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/terminos-y-condiciones"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/faq-argentina"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              FAQ Argentina
            </Link>
            <Link
              to="/contacto"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
