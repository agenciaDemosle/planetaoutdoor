import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const phoneNumber = '56932563910' // Daniel's WhatsApp
  const defaultMessage = 'Hola! Me gustaría consultar sobre los productos de Planeta Outdoor'

  const handleChat = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[320px] bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#075E54] p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Comenzar una conversación</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-white/80 text-sm mt-1">
              Hola! Haz clic en uno de nuestros miembros de abajo para chatear por WhatsApp
            </p>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">
              El equipo suele responder en unos minutos.
            </p>

            {/* Contact */}
            <button
              onClick={handleChat}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Planeta Chat</p>
                <p className="text-sm text-gray-500">Whatsapp PlanetaOutDoor</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg transition-all hover:scale-105"
        aria-label="Chat por WhatsApp"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-4 right-20 md:right-24 z-40 hidden md:block">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm">
            ¿Necesitas ayuda? Chatea con nosotros
          </div>
        </div>
      )}
    </>
  )
}
