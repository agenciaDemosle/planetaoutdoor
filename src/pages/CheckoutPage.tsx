import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Lock, Truck, CreditCard, MapPin, Loader2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { formatPrice } from '../data/products'
import { mercadoPagoAPI } from '../api/mercadopago'
import { transbankAPI } from '../api/transbank'
import { RedirectingToPaymentPage } from './RedirectingToPaymentPage'

type CheckoutStep = 'information' | 'shipping' | 'payment'

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

const regions = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
]

export function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [step, setStep] = useState<CheckoutStep>('information')
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [loadingShipping, setLoadingShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transbank'>('transbank')

  // Umbral para envío gratis
  const FREE_SHIPPING_THRESHOLD = 150000
  const SHIPPING_COST = 5990 // Costo de envío estándar

  // Configurar opciones de envío
  useEffect(() => {
    setLoadingShipping(true)

    // Opciones de envío fijas
    const options: ShippingOption[] = [
      {
        id: 'pickup',
        name: 'Retiro en Tienda',
        description: 'Recreo 838, Temuco',
        price: 0,
        estimatedDays: 'Disponible en 24 hrs',
      },
      {
        id: 'shipping',
        name: 'Envío a Domicilio',
        description: 'Despacho a todo Chile',
        price: SHIPPING_COST,
        estimatedDays: '3-7 días hábiles',
      },
    ]

    setShippingOptions(options)
    setSelectedShipping('pickup')
    setLoadingShipping(false)
  }, [])
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    region: 'La Araucanía',
    postalCode: '',
    notes: '',
  })

  const subtotal = getTotal()
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)

  // Lógica de envío:
  // - Retiro en tienda: siempre gratis
  // - Envío a domicilio: gratis sobre $150.000, sino cobra $5.990
  const isFreeShipping = selectedShipping === 'pickup' || subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = isFreeShipping ? 0 : (selectedShippingOption?.price || 0)
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitOrder = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Generar ID único para la orden
      const orderId = `PO-${Date.now()}`

      // Guardar datos del pedido en localStorage para recuperar después
      localStorage.setItem(`order_${orderId}`, JSON.stringify({
        items,
        formData,
        shippingOption: selectedShippingOption,
        total,
        createdAt: new Date().toISOString(),
      }))

      if (paymentMethod === 'transbank') {
        // Pago con Transbank Webpay Plus
        const buyOrder = transbankAPI.generateBuyOrder('PO')
        const sessionId = transbankAPI.generateSessionId()

        // Guardar para recuperar después del pago
        localStorage.setItem('pendingOrderId', orderId)
        localStorage.setItem('pendingBuyOrder', buyOrder)

        const transaction = await transbankAPI.createTransaction({
          buyOrder,
          sessionId,
          amount: total,
          returnUrl: `${window.location.origin}/transbank/retorno`,
        })

        // Redirigir a Webpay
        transbankAPI.redirectToWebpay(transaction.url, transaction.token)
      } else {
        // Pago con Mercado Pago
        const mpItems = items.map(item => ({
          title: item.name,
          quantity: item.quantity,
          currency_id: 'CLP',
          unit_price: item.price,
        }))

        // Agregar costo de envío como item si aplica
        if (shippingCost > 0) {
          mpItems.push({
            title: `Envío - ${selectedShippingOption?.name}`,
            quantity: 1,
            currency_id: 'CLP',
            unit_price: shippingCost,
          })
        }

        const preference = await mercadoPagoAPI.createPreference({
          items: mpItems,
          payer: {
            name: formData.firstName,
            surname: formData.lastName,
            email: formData.email,
            phone: {
              area_code: '56',
              number: formData.phone.replace(/\D/g, ''),
            },
            address: {
              street_name: formData.address,
              street_number: 0,
              zip_code: formData.postalCode || '0000000',
            },
          },
          back_urls: {
            success: `${window.location.origin}/pago-exitoso?order=${orderId}`,
            failure: `${window.location.origin}/pago-fallido?order=${orderId}`,
            pending: `${window.location.origin}/pago-pendiente?order=${orderId}`,
          },
          auto_return: 'approved',
          external_reference: orderId,
          notification_url: 'https://planetaoutdoor.cl/api/webhooks/mercadopago',
        })

        // Guardar URL de pago y mostrar página de redirección
        setPaymentUrl(preference.init_point)
        setIsRedirecting(true)

        // Limpiar carrito
        clearCart()
      }
    } catch (err) {
      console.error('Error creating payment:', err)
      setError('Hubo un error al procesar tu pago. Por favor intenta nuevamente.')
      setIsProcessing(false)
    }
  }

  // Mostrar página de redirección
  if (isRedirecting && paymentUrl) {
    return <RedirectingToPaymentPage paymentUrl={paymentUrl} />
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <Link to="/tienda" className="text-nature hover:underline">
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Planeta Outdoor</title>
        <meta name="description" content="Finaliza tu compra en Planeta Outdoor. Pago seguro con WebPay y MercadoPago." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              Planeta Outdoor
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock size={14} />
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => setStep('information')}
              className={`flex items-center gap-2 ${step === 'information' ? 'text-black font-medium' : 'text-gray-400'}`}
            >
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
              Información
            </button>
            <ChevronRight size={16} className="text-gray-300" />
            <button
              onClick={() => formData.email && setStep('shipping')}
              className={`flex items-center gap-2 ${step === 'shipping' ? 'text-black font-medium' : 'text-gray-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'shipping' || step === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
              Envío
            </button>
            <ChevronRight size={16} className="text-gray-300" />
            <button
              onClick={() => selectedShipping && setStep('payment')}
              className={`flex items-center gap-2 ${step === 'payment' ? 'text-black font-medium' : 'text-gray-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
              Pago
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {/* Information Step */}
            {step === 'information' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold mb-6">Información de contacto</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="+56 9 1234 5678"
                      required
                    />
                  </div>
                </div>

                <h2 className="text-lg font-bold mt-8 mb-6">Dirección de envío</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="Calle y número"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento, oficina, etc. (opcional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región *
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"
                        required
                      >
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal (opcional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas del pedido (opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black resize-none"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Link to="/carrito" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                    <ChevronLeft size={16} />
                    Volver al carrito
                  </Link>
                  <button
                    onClick={() => setStep('shipping')}
                    disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city}
                    className="px-8 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continuar al envío
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Truck size={20} />
                  Método de envío
                </h2>

                <div className="space-y-3">
                  {loadingShipping ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-500">Cargando opciones de envío...</span>
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay opciones de envío disponibles
                    </div>
                  ) : (
                    shippingOptions.map((option) => {
                      const isPickup = option.id === 'pickup'
                      const isFreeByAmount = !isPickup && subtotal >= FREE_SHIPPING_THRESHOLD
                      const displayPrice = isPickup || isFreeByAmount ? 0 : option.price

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedShipping === option.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                            />
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{option.estimatedDays}</p>
                              {isFreeByAmount && (
                                <p className="text-xs text-nature font-medium mt-1">
                                  Envío gratis por compra sobre $150.000
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {isFreeByAmount ? (
                              <>
                                <span className="text-gray-400 line-through text-sm">{formatPrice(option.price)}</span>
                                <span className="font-medium text-nature ml-2">Gratis</span>
                              </>
                            ) : (
                              <span className="font-medium">
                                {displayPrice === 0 ? 'Gratis' : formatPrice(displayPrice)}
                              </span>
                            )}
                          </div>
                        </label>
                      )
                    })
                  )}
                </div>

                {/* Free shipping info banner */}
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="mt-4 p-4 bg-nature/10 border border-nature/30 rounded-lg">
                    <p className="text-sm text-nature-dark">
                      <span className="font-medium">Te faltan {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</span> para obtener envío gratis.
                      Compras sobre $150.000 tienen despacho gratuito.
                    </p>
                  </div>
                )}

                {subtotal >= FREE_SHIPPING_THRESHOLD && selectedShipping === 'shipping' && (
                  <div className="mt-4 p-4 bg-nature/10 border border-nature/30 rounded-lg">
                    <p className="text-sm text-nature-dark font-medium">
                      ¡Felicidades! Tu compra califica para envío gratis.
                    </p>
                  </div>
                )}

                {/* Shipping Address Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-gray-500">{formData.address}</p>
                      {formData.apartment && <p className="text-sm text-gray-500">{formData.apartment}</p>}
                      <p className="text-sm text-gray-500">{formData.city}, {formData.region}</p>
                      <button
                        onClick={() => setStep('information')}
                        className="text-sm text-nature hover:underline mt-2"
                      >
                        Editar dirección
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep('information')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                  >
                    <ChevronLeft size={16} />
                    Volver
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="px-8 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
                  >
                    Continuar al pago
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <CreditCard size={20} />
                  Método de pago
                </h2>

                <div className="space-y-4">
                  {/* Transbank Webpay Plus */}
                  <label
                    className={`block p-6 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'transbank'
                        ? 'border-2 border-[#e4002b] bg-gradient-to-br from-[#e4002b]/5 to-[#e4002b]/10'
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transbank"
                        checked={paymentMethod === 'transbank'}
                        onChange={() => setPaymentMethod('transbank')}
                        className="mt-1 w-4 h-4 text-[#e4002b] border-gray-300 focus:ring-[#e4002b]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src="https://www.transbankdevelopers.cl/public/library/img/svg/logo_webpay_plus.svg"
                            alt="Webpay Plus"
                            className="h-8"
                          />
                          <span className="text-xs text-[#e4002b] font-medium px-2 py-1 bg-[#e4002b]/10 rounded">Recomendado</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Paga directamente con tu tarjeta de crédito o débito chilena
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Tarjetas de crédito</span>
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Tarjetas de débito</span>
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Redcompra</span>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                          <img src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Visa_Inc._logo.svg_.png" alt="Visa" className="h-5" />
                          <img src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mastercard-logo.svg_.webp" alt="Mastercard" className="h-7" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Logo_Redcompra.svg/2560px-Logo_Redcompra.svg.png" alt="Redcompra" className="h-5" />
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Mercado Pago */}
                  <label
                    className={`block p-6 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'mercadopago'
                        ? 'border-2 border-[#00b1ea] bg-gradient-to-br from-[#00b1ea]/5 to-[#00b1ea]/10'
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mercadopago"
                        checked={paymentMethod === 'mercadopago'}
                        onChange={() => setPaymentMethod('mercadopago')}
                        className="mt-1 w-4 h-4 text-[#00b1ea] border-gray-300 focus:ring-[#00b1ea]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mercado_Pago.svg_.webp"
                            alt="Mercado Pago"
                            className="h-8"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Paga con Mercado Pago, acepta múltiples medios de pago
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Tarjetas de crédito</span>
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Tarjetas de débito</span>
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium">Cuenta Mercado Pago</span>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                          <img src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Visa_Inc._logo.svg_.png" alt="Visa" className="h-5" />
                          <img src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mastercard-logo.svg_.webp" alt="Mastercard" className="h-7" />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Resumen del pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({items.length} productos)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío ({selectedShippingOption?.name})</span>
                      <span>
                        {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep('shipping')}
                    disabled={isProcessing}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Volver
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className={`px-8 py-4 text-white font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                      paymentMethod === 'transbank'
                        ? 'bg-[#e4002b] hover:bg-[#c00025]'
                        : 'bg-[#00b1ea] hover:bg-[#009ed6]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        {paymentMethod === 'transbank' ? 'Pagar con Webpay' : 'Pagar con Mercado Pago'}
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  {paymentMethod === 'transbank'
                    ? 'Al hacer clic en "Pagar" serás redirigido a Webpay Plus para completar tu pago de forma segura.'
                    : 'Al hacer clic en "Pagar" serás redirigido a Mercado Pago para completar tu pago de forma segura.'}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Tu pedido</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.options)}`} className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </p>
                      )}
                      <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {step === 'information'
                      ? 'Calculado en el siguiente paso'
                      : shippingCost === 0
                        ? 'Gratis'
                        : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(step === 'information' ? subtotal : total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Impuestos incluidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
