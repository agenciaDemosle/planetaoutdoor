import { useState } from 'react'
import { X, ChevronRight, ArrowLeft, MessageCircle, HelpCircle, Truck, CreditCard, RefreshCw, Clock } from 'lucide-react'

interface FAQ {
  id: string
  icon: React.ReactNode
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 'envios',
    icon: <Truck size={18} />,
    question: '¿Hacen envíos a todo Chile?',
    answer: 'Sí, despachamos a todo Chile continental. Envío gratis en compras sobre $80.000. Tiempo de entrega: 1-3 días hábiles en RM, 3-7 días en regiones. También enviamos a Argentina.',
  },
  {
    id: 'pagos',
    icon: <CreditCard size={18} />,
    question: '¿Qué medios de pago aceptan?',
    answer: 'Aceptamos WebPay (crédito/débito), transferencia bancaria y puedes pagar en 3, 6 o 12 cuotas sin interés según tu banco. Todas las transacciones son 100% seguras.',
  },
  {
    id: 'devoluciones',
    icon: <RefreshCw size={18} />,
    question: '¿Puedo hacer cambios o devoluciones?',
    answer: 'Tienes 30 días para cambios y devoluciones. El producto debe estar sin uso, con etiquetas y empaque original. Derecho a retracto de 10 días según Ley del Consumidor.',
  },
  {
    id: 'horario',
    icon: <Clock size={18} />,
    question: '¿Cuál es el horario de atención?',
    answer: 'Nuestra tienda en Temuco (Recreo 838) atiende: Lunes a Viernes de 11:00 a 19:00, Sábados de 11:00 a 17:00. Domingos cerrado. Online atendemos 24/7.',
  },
  {
    id: 'asesoria',
    icon: <HelpCircle size={18} />,
    question: '¿Me pueden asesorar con mi equipo?',
    answer: '¡Por supuesto! Somos pescadores y conocemos cada producto. Cuéntanos tu experiencia, dónde pescas y tu presupuesto, y te recomendamos el equipo ideal para ti.',
  },
]

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [showFaqs, setShowFaqs] = useState(true)

  const phoneNumber = '56983610365'
  const defaultMessage = 'Hola! Me gustaría consultar sobre los productos de Planeta Outdoor'

  const handleChat = (customMessage?: string) => {
    const message = customMessage || defaultMessage
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedFaq(null)
    setShowFaqs(true)
  }

  const handleBack = () => {
    setSelectedFaq(null)
  }

  return (
    <>
      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FE6A00] to-[#ff8533] p-4">
            <div className="flex items-center justify-between">
              {selectedFaq ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm font-medium">Volver</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Planeta Outdoor</h3>
                    <p className="text-white/80 text-xs">Respondemos en minutos</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {selectedFaq ? (
              /* Answer View */
              <div className="p-4">
                <div className="flex items-center gap-2 text-[#FE6A00] mb-3">
                  {selectedFaq.icon}
                  <span className="font-semibold text-sm">{selectedFaq.question}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {selectedFaq.answer}
                </p>
                <button
                  onClick={() => handleChat(`Hola! Tengo una consulta sobre: ${selectedFaq.question}`)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar más por WhatsApp
                </button>
              </div>
            ) : showFaqs ? (
              /* FAQ List */
              <div className="p-3">
                <p className="text-xs text-gray-500 px-2 mb-2 font-medium uppercase tracking-wide">
                  Preguntas frecuentes
                </p>
                <div className="space-y-1">
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => setSelectedFaq(faq)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 bg-gray-100 group-hover:bg-[#FE6A00] rounded-full flex items-center justify-center text-gray-500 group-hover:text-white transition-colors flex-shrink-0">
                        {faq.icon}
                      </div>
                      <span className="text-sm text-gray-700 flex-1 leading-snug">
                        {faq.question}
                      </span>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-[#FE6A00] transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-3 px-2">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400">o</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Direct WhatsApp */}
                <button
                  onClick={() => handleChat()}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Hablar con un asesor
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Chat por WhatsApp"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <span className="fixed bottom-14 right-4 md:right-6 z-50 flex h-4 w-4 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FE6A00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FE6A00] text-white text-[10px] font-bold items-center justify-center">
            ?
          </span>
        </span>
      )}
    </>
  )
}
