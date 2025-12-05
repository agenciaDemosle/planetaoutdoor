import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Lock, Truck, CreditCard, MapPin } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { formatPrice } from '../data/products'

type CheckoutStep = 'information' | 'shipping' | 'payment'

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Envío Estándar',
    description: 'Entrega a domicilio',
    price: 5990,
    estimatedDays: '5-7 días hábiles',
  },
  {
    id: 'express',
    name: 'Envío Express',
    description: 'Entrega prioritaria',
    price: 9990,
    estimatedDays: '2-3 días hábiles',
  },
  {
    id: 'pickup',
    name: 'Retiro en Tienda',
    description: 'Recreo 838, Temuco',
    price: 0,
    estimatedDays: 'Disponible en 24 hrs',
  },
]

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
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [step, setStep] = useState<CheckoutStep>('information')
  const [selectedShipping, setSelectedShipping] = useState<string>('standard')
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
  const FREE_SHIPPING_THRESHOLD = 80000
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping)
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (selectedShippingOption?.price || 0)
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitOrder = () => {
    clearCart()
    navigate('/gracias')
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

                {subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ¡Tu pedido califica para envío gratis!
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {shippingOptions.map((option) => (
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
                        </div>
                      </div>
                      <span className="font-medium">
                        {option.price === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
                          ? 'Gratis'
                          : formatPrice(option.price)}
                      </span>
                    </label>
                  ))}
                </div>

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
                  <div className="p-4 border border-black rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="radio"
                        name="payment"
                        value="webpay"
                        defaultChecked
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="font-medium">WebpayPlus</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Paga con tarjeta de crédito o débito. Acepta cuotas sin interés.
                    </p>
                    <div className="flex gap-2 mt-3 ml-7">
                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Visa</span>
                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Mastercard</span>
                      <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Redcompra</span>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        disabled
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="font-medium">Transferencia Bancaria</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Próximamente</span>
                    </div>
                  </div>
                </div>

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
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
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
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                  >
                    <ChevronLeft size={16} />
                    Volver
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    className="px-8 py-4 bg-nature text-white font-medium rounded hover:bg-nature/90 transition-colors flex items-center gap-2"
                  >
                    <Lock size={16} />
                    Pagar {formatPrice(total)}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Al hacer clic en "Pagar" serás redirigido a WebpayPlus para completar tu pago de forma segura.
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
  )
}
