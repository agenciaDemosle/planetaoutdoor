import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

interface ProductAdvisorProps {
  productName: string
  productCategory?: string
}

// Preguntas frecuentes por categoria de producto
const FAQ_BY_CATEGORY: Record<string, FAQ[]> = {
  waders: [
    {
      question: '¿Qué talla de wader debo elegir?',
      answer: 'Para elegir tu talla de wader, mide tu altura y el contorno de pecho/cadera. Consulta nuestra tabla de tallas. Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad de movimiento.'
    },
    {
      question: '¿Neopreno o tela respirable?',
      answer: 'Neopreno: Ideal para aguas muy frías (bajo 10°C), ofrece excelente aislamiento térmico. Tela respirable: Perfecta para climas templados y días de mucha caminata, permite transpiración y es más liviana.'
    },
    {
      question: '¿Cómo cuido mi wader?',
      answer: 'Después de cada uso, enjuaga con agua dulce y seca completamente antes de guardar. Evita exposición prolongada al sol. Guarda colgado o enrollado sin pliegues marcados. Revisa costuras periódicamente.'
    },
    {
      question: '¿Qué botas usar con waders de calcetín?',
      answer: 'Usa botas de vadeo específicas, media talla más grande que tu talla normal para acomodar el calcetín de neopreno. Elige suela de fieltro para ríos con rocas o goma para terrenos mixtos.'
    },
  ],
  botas: [
    {
      question: '¿Qué talla de bota debo elegir?',
      answer: 'Mide tu pie en cm al final del día. Usa nuestro calculador de tallas. Si usarás calcetines de neopreno gruesos, sube media talla. Si estás entre dos tallas, elige la mayor.'
    },
    {
      question: '¿Suela de fieltro o goma?',
      answer: 'Fieltro: Excelente agarre en rocas resbaladizas y fondos de río, es la opción tradicional. Goma: Más versátil, mejor para caminar fuera del agua, más duradera y fácil de limpiar.'
    },
    {
      question: '¿Necesito clavos/studs?',
      answer: 'Los clavos ofrecen máximo agarre en terrenos muy resbaladizos o con musgo. Son ideales para ríos con piedras pulidas. Puedes agregarlos después a botas de fieltro si lo necesitas.'
    },
    {
      question: '¿Cómo cuido mis botas de vadeo?',
      answer: 'Enjuaga con agua dulce después de cada uso. Seca a la sombra, nunca al sol directo o cerca de calor. Guarda en lugar ventilado. Las suelas de fieltro requieren secado completo para evitar olores.'
    },
  ],
  canas: [
    {
      question: '¿Qué peso de línea necesito?',
      answer: '#3-4: Truchas pequeñas y arroyos. #5-6: La más versátil, ideal para principiantes. #7-8: Truchas grandes y condiciones de viento. #9-10: Salmones y pesca en mar.'
    },
    {
      question: '¿Qué longitud de caña elegir?',
      answer: '7\'6"-8\': Arroyos pequeños con vegetación. 9\': Estándar y más versátil, recomendada para la mayoría. 10\'+: Nymphing europeo y grandes ríos con espacio.'
    },
    {
      question: '¿Caña de acción rápida o lenta?',
      answer: 'Acción rápida: Mejor para lanzamientos largos y viento, requiere más técnica. Acción media: Más versátil y perdona errores. Acción lenta: Ideal para distancias cortas y presentaciones delicadas.'
    },
    {
      question: '¿Cuántas secciones es mejor?',
      answer: '4 secciones: Estándar actual, excelente rendimiento y fácil de transportar. 2-3 secciones: Ligeramente mejor acción pero menos portátiles. 6+ secciones: Máxima portabilidad para viajes.'
    },
  ],
  carretes: [
    {
      question: '¿Qué tamaño de carrete necesito?',
      answer: 'El carrete debe coincidir con el peso de tu línea y caña. Un carrete #5/6 funciona para cañas #5 o #6. Elige Large Arbor para recoger línea más rápido y reducir memoria.'
    },
    {
      question: '¿Disc drag o click & pawl?',
      answer: 'Disc drag: Necesario para peces grandes que hacen corridas largas. Click & pawl: Suficiente para truchas medianas, más simple y tradicional, ofrece ese sonido clásico.'
    },
    {
      question: '¿Aluminio o composite?',
      answer: 'Aluminio mecanizado: Más duradero, ligero y con mejor acabado, vale la inversión. Composite/plástico: Más económico, funciona bien para principiantes o como respaldo.'
    },
    {
      question: '¿Cuánto backing necesito?',
      answer: 'Para truchas: 50-100 metros de backing 20lb es suficiente. Para peces más grandes (salmones, steelhead): 150-200 metros mínimo. El carrete debe tener capacidad para la línea más el backing.'
    },
  ],
  lineas: [
    {
      question: '¿Floating o sinking?',
      answer: 'Floating (F): La más versátil, para mosca seca y ninfas con indicador. Sinking (S): Para streamers y pesca profunda. Sink-tip: Combina ambas, buena opción intermedia.'
    },
    {
      question: '¿Weight Forward o Double Taper?',
      answer: 'Weight Forward (WF): Más fácil de lanzar, mejor para principiantes y distancias largas. Double Taper (DT): Presentaciones más delicadas, dura el doble porque puedes invertirla.'
    },
    {
      question: '¿Qué color de línea elegir?',
      answer: 'Colores brillantes (naranja, amarillo): Más visibles para el pescador, facilitan ver la línea. Colores neutros (oliva, gris): Menos visibles para los peces, mejores en aguas claras y peces selectivos.'
    },
    {
      question: '¿Cada cuánto cambiar la línea?',
      answer: 'Con uso regular, cada 1-2 temporadas. Señales de cambio: grietas, pérdida de flotabilidad, revestimiento que se pela. Limpia tu línea regularmente para extender su vida útil.'
    },
  ],
  moscas: [
    {
      question: '¿Qué moscas básicas necesito?',
      answer: 'Secas: Adams, Elk Hair Caddis, Royal Wulff. Ninfas: Pheasant Tail, Hare\'s Ear, Prince Nymph. Streamers: Woolly Bugger negro y oliva. Con estas cubres la mayoría de situaciones.'
    },
    {
      question: '¿Qué tamaño de mosca usar?',
      answer: 'Regla general: En aguas claras y peces selectivos usa moscas más pequeñas (#16-20). En aguas turbias o peces activos, más grandes (#10-14). Observa qué insectos hay en el agua.'
    },
    {
      question: '¿Cómo guardo mis moscas?',
      answer: 'Seca completamente las moscas antes de guardar. Usa cajas con compartimentos o espuma. No mezcles moscas húmedas con secas. Revisa periódicamente por óxido en los anzuelos.'
    },
    {
      question: '¿Moscas con o sin rebaba?',
      answer: 'Sin rebaba (barbless): Más fácil soltar peces, menos daño, obligatorio en algunas aguas. Con rebaba: Menor riesgo de perder el pez. Puedes aplastar la rebaba con pinzas si es necesario.'
    },
  ],
  default: [
    {
      question: '¿Tienen envío gratis?',
      answer: 'Sí, envío gratis en compras sobre $50.000. Santiago: 1-2 días hábiles. Regiones: 3-5 días hábiles. Zonas extremas: 5-7 días hábiles.'
    },
    {
      question: '¿Puedo pagar en cuotas?',
      answer: 'Sí, aceptamos pago en 3, 6 o 12 cuotas sin interés con tarjetas participantes a través de WebpayPlus. También aceptamos transferencia bancaria.'
    },
    {
      question: '¿Cuál es la política de cambios?',
      answer: 'Tienes 30 días para cambios o devoluciones. El producto debe estar sin uso y con etiquetas originales. El cambio de talla es gratis, solo pagas el envío de retorno.'
    },
    {
      question: '¿Tienen garantía?',
      answer: 'Todos nuestros productos tienen garantía de fábrica. El tiempo varía según el fabricante. Si tienes algún problema, contáctanos y te ayudamos con el proceso.'
    },
  ],
}

function getCategoryFAQs(productName: string, productCategory?: string): FAQ[] {
  const name = productName.toLowerCase()
  const category = productCategory?.toLowerCase() || ''

  // Detectar categoria por nombre o slug
  if (category.includes('wader') || name.includes('wader')) {
    return [...FAQ_BY_CATEGORY.waders, ...FAQ_BY_CATEGORY.default]
  }
  if (category.includes('bota') || category.includes('boot') || name.includes('bota') || name.includes('boot') || name.includes('zapato')) {
    return [...FAQ_BY_CATEGORY.botas, ...FAQ_BY_CATEGORY.default]
  }
  if (category.includes('caña') || category.includes('cana') || category.includes('rod') || name.includes('caña') || name.includes('rod')) {
    return [...FAQ_BY_CATEGORY.canas, ...FAQ_BY_CATEGORY.default]
  }
  if (category.includes('carrete') || category.includes('reel') || name.includes('carrete') || name.includes('reel')) {
    return [...FAQ_BY_CATEGORY.carretes, ...FAQ_BY_CATEGORY.default]
  }
  if (category.includes('línea') || category.includes('linea') || category.includes('line') || name.includes('línea') || name.includes('line')) {
    return [...FAQ_BY_CATEGORY.lineas, ...FAQ_BY_CATEGORY.default]
  }
  if (category.includes('mosca') || category.includes('flies') || category.includes('fly') || name.includes('mosca') || name.includes('flies')) {
    return [...FAQ_BY_CATEGORY.moscas, ...FAQ_BY_CATEGORY.default]
  }

  return FAQ_BY_CATEGORY.default
}

export function ProductAdvisor({ productName, productCategory }: ProductAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const faqs = getCategoryFAQs(productName, productCategory)

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index)
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FE6A00' }}
          >
            <HelpCircle size={20} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900 block">¿Tienes dudas sobre este producto?</span>
            <span className="text-xs text-gray-500">Preguntas frecuentes</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>

      {/* FAQ Content */}
      {isOpen && (
        <div className="border-t border-gray-100 animate-fade-in-up">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 pr-4">{faq.question}</span>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      expandedQuestion === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedQuestion === index && (
                  <div className="px-4 pb-4 animate-fade-in-up">
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              ¿No encontraste tu respuesta? Llámanos:{' '}
              <a href="tel:+56983610365" className="font-medium" style={{ color: '#FE6A00' }}>
                Eduardo
              </a>
              {' o '}
              <a href="tel:+56932563910" className="font-medium" style={{ color: '#FE6A00' }}>
                Daniel
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
