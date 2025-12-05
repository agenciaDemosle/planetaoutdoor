import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, User, Bot, Loader2 } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Base de conocimiento del asesor - Puedes agregar más información aquí
const KNOWLEDGE_BASE = {
  greeting: `¡Hola! Soy tu asesor virtual de Planeta Outdoor. Estoy aquí para ayudarte a encontrar el equipo perfecto para pesca con mosca. ¿En qué puedo ayudarte?`,

  categories: {
    waders: {
      keywords: ['wader', 'waders', 'vadeo', 'vadeador'],
      response: `Los waders son esenciales para la pesca con mosca. Tenemos varias opciones:

- **Waders de neopreno**: Ideales para aguas muy frías, ofrecen excelente aislamiento térmico
- **Waders de tela respirable**: Perfectos para climas más templados, permiten transpiración
- **Waders con botas integradas vs calcetín**: Los de calcetín permiten usar botas separadas para mejor ajuste

¿Qué tipo de condiciones de pesca tienes en mente?`
    },
    botas: {
      keywords: ['bota', 'botas', 'calzado', 'zapato', 'zapatos', 'wading boots'],
      response: `Para botas de vadeo, considera estos factores:

- **Suela de fieltro**: Excelente agarre en rocas resbaladizas, tradicional y confiable
- **Suela de goma**: Más versátil, buena para entrar/salir del agua, más duradera
- **Suela con clavos/studs**: Máximo agarre en terrenos difíciles

Para elegir la talla correcta, usa nuestro calculador de tallas. Generalmente se recomienda media talla más grande para usar con calcetines de neopreno.

¿Necesitas ayuda para elegir la talla correcta?`
    },
    canas: {
      keywords: ['caña', 'cañas', 'rod', 'rods', 'vara'],
      response: `Las cañas de mosca se clasifican por peso de línea (#):

- **#3-4**: Truchas pequeñas, arroyos pequeños
- **#5-6**: Las más versátiles, ideales para principiantes, truchas medianas
- **#7-8**: Truchas grandes, steelhead, condiciones de viento
- **#9-10**: Salmones, pesca en mar

También considera la longitud:
- **7'6" - 8'**: Arroyos pequeños con vegetación
- **9'**: Estándar, muy versátil
- **10'+**: Nymphing europeo, grandes ríos

¿Qué tipo de pesca practicas principalmente?`
    },
    carretes: {
      keywords: ['carrete', 'carretes', 'reel', 'reels'],
      response: `Los carretes de mosca deben equilibrar con tu caña:

- **Sistema de freno**: Disc drag para peces grandes, click & pawl para truchas pequeñas
- **Arbor**: Large arbor recoge línea más rápido y reduce memoria
- **Material**: Aluminio mecanizado es más duradero y ligero

Recomendaciones:
- Principiantes: Un buen carrete de rango medio dura años
- El carrete debe balancear el peso de la caña
- Siempre ten backing suficiente

¿Qué peso de línea usas?`
    },
    lineas: {
      keywords: ['línea', 'lineas', 'líneas', 'line', 'lines', 'fly line'],
      response: `Tipos de líneas de mosca:

**Por flotabilidad:**
- **Floating (F)**: La más común, ideal para pesca seca y ninfas
- **Sinking (S)**: Para streamers y pesca profunda
- **Sink-tip**: Combinación versátil

**Por perfil (taper):**
- **Weight Forward (WF)**: Más fácil de lanzar, la más popular
- **Double Taper (DT)**: Presentaciones más delicadas

**Colores:**
- Colores brillantes: Más visibles para el pescador
- Colores neutros: Menos visibles para los peces

¿Qué tipo de pesca te interesa más?`
    },
    moscas: {
      keywords: ['mosca', 'moscas', 'fly', 'flies', 'señuelo', 'patron', 'patrón'],
      response: `Moscas esenciales para Chile:

**Secas (Dry flies):**
- Adams, Elk Hair Caddis, Royal Wulff
- Chernobyl Ant para el verano

**Ninfas:**
- Pheasant Tail, Hare's Ear, Prince Nymph
- San Juan Worm para aguas turbias

**Streamers:**
- Woolly Bugger (negro/oliva)
- Zonker, Muddler Minnow

**Tamaños más usados:** #12-18 para truchas

¿Pescas en ríos o lagos principalmente?`
    },
    tallas: {
      keywords: ['talla', 'tallas', 'medida', 'medidas', 'tamaño', 'size', 'calce'],
      response: `Para encontrar tu talla perfecta:

1. **Mide tu pie en cm** desde el talón hasta el dedo más largo
2. **Usa nuestro calculador de tallas** en la página del producto
3. **Considera el calce:**
   - Ajustado: Para sentir bien el fondo del río
   - Normal: Uso cómodo con calcetines regulares
   - Holgado: Para calcetines gruesos de neopreno

**Tips:**
- Mide al final del día cuando el pie está más expandido
- Si estás entre dos tallas, elige la mayor
- Los waders con calcetín necesitan botas media talla más grandes

¿Necesitas ayuda con algún producto específico?`
    }
  },

  shipping: {
    keywords: ['envío', 'envio', 'despacho', 'entrega', 'shipping', 'delivery', 'llega', 'demora'],
    response: `Información de envíos:

- **Santiago**: 1-2 días hábiles
- **Regiones**: 3-5 días hábiles
- **Zonas extremas**: 5-7 días hábiles

**Envío gratis** en compras sobre $50.000

Trabajamos con Chilexpress y Starken para asegurar que tu equipo llegue en perfectas condiciones.

¿Tienes alguna otra consulta?`
  },

  payment: {
    keywords: ['pago', 'pagos', 'pagar', 'cuotas', 'tarjeta', 'webpay', 'transferencia'],
    response: `Métodos de pago disponibles:

- **WebpayPlus**: Tarjetas de crédito y débito
- **Cuotas sin interés**: 3, 6 o 12 cuotas con tarjetas participantes
- **Transferencia bancaria**: Datos enviados por email

Todas las transacciones son 100% seguras.

¿Puedo ayudarte con algo más?`
  },

  returns: {
    keywords: ['devolución', 'devolucion', 'cambio', 'garantía', 'garantia', 'retorno'],
    response: `Política de cambios y devoluciones:

- **30 días** para cambios o devoluciones
- Producto debe estar **sin uso** y con etiquetas
- **Cambio de talla gratis** (solo pagas envío de retorno)
- Garantía de fábrica según cada producto

Para iniciar un cambio, contáctanos por WhatsApp o email.

¿Hay algo más en lo que pueda ayudarte?`
  },

  fallback: `No estoy seguro de entender tu consulta. Puedo ayudarte con:

- Información sobre **waders y botas**
- Asesoría en **cañas y carretes**
- Recomendaciones de **líneas y moscas**
- Ayuda con **tallas y medidas**
- Información de **envíos y pagos**

¿Sobre cuál tema te gustaría saber más?`
}

function findResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Check greeting
  if (lowerMessage.match(/^(hola|hi|buenas|hey|buenos días|buenas tardes)/)) {
    return KNOWLEDGE_BASE.greeting
  }

  // Check categories
  for (const [, category] of Object.entries(KNOWLEDGE_BASE.categories)) {
    if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return category.response
    }
  }

  // Check shipping
  if (KNOWLEDGE_BASE.shipping.keywords.some(keyword => lowerMessage.includes(keyword))) {
    return KNOWLEDGE_BASE.shipping.response
  }

  // Check payment
  if (KNOWLEDGE_BASE.payment.keywords.some(keyword => lowerMessage.includes(keyword))) {
    return KNOWLEDGE_BASE.payment.response
  }

  // Check returns
  if (KNOWLEDGE_BASE.returns.keywords.some(keyword => lowerMessage.includes(keyword))) {
    return KNOWLEDGE_BASE.returns.response
  }

  // Fallback
  return KNOWLEDGE_BASE.fallback
}

export function AdvisorChatbot() {
  const { isChatbotOpen, closeChatbot, toggleChatbot } = useUIStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: KNOWLEDGE_BASE.greeting,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isChatbotOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatbotOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = findResponse(userMessage.content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }

    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isChatbotOpen
            ? 'bg-gray-700 text-white'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
        }`}
        style={!isChatbotOpen ? { background: 'linear-gradient(135deg, #FE6A00 0%, #e55d00 100%)' } : {}}
      >
        {isChatbotOpen ? (
          <X size={20} />
        ) : (
          <>
            <MessageCircle size={20} />
            <span className="font-medium text-sm hidden sm:inline">¿Necesitas un asesor?</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div
            className="px-4 py-3 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #FE6A00 0%, #e55d00 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asesor Planeta Outdoor</h3>
                <p className="text-xs text-white/80">Experto en pesca con mosca</p>
              </div>
            </div>
            <button
              onClick={closeChatbot}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#FE6A00' }}
                  >
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gray-800 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content.split('\n').map((line, i) => {
                      // Handle bold text
                      const parts = line.split(/(\*\*[^*]+\*\*)/g)
                      return (
                        <span key={i}>
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j}>{part.slice(2, -2)}</strong>
                            }
                            return <span key={j}>{part}</span>
                          })}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </span>
                      )
                    })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FE6A00' }}
                >
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
            {['Waders', 'Botas', 'Canas', 'Tallas', 'Envios'].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setInput(topic === 'Canas' ? 'Cañas' : topic === 'Envios' ? 'Envíos' : topic)
                  setTimeout(() => handleSend(), 100)
                }}
                className="px-3 py-1.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-full whitespace-nowrap hover:bg-orange-100 transition-colors"
              >
                {topic === 'Canas' ? 'Cañas' : topic === 'Envios' ? 'Envíos' : topic}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#FE6A00' }}
              >
                {isTyping ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
