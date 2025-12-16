import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Package, ArrowRight, Home } from 'lucide-react'
import { formatPrice } from '../data/products'

type PaymentStatus = 'success' | 'failure' | 'pending'

interface OrderData {
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    imageUrl: string
  }>
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    region: string
  }
  shippingOption: {
    name: string
    price: number
  }
  total: number
  createdAt: string
}

interface PaymentResultPageProps {
  status: PaymentStatus
}

export function PaymentResultPage({ status }: PaymentResultPageProps) {
  const [searchParams] = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const orderId = searchParams.get('order')
  const paymentId = searchParams.get('payment_id')
  const mpStatus = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Recuperar datos del pedido desde localStorage
    const orderKey = orderId || externalReference
    if (orderKey) {
      const savedOrder = localStorage.getItem(`order_${orderKey}`)
      if (savedOrder) {
        setOrderData(JSON.parse(savedOrder))
      }
    }
  }, [orderId, externalReference])

  const statusConfig = {
    success: {
      icon: <CheckCircle size={80} className="text-green-500" />,
      title: '¡Pago exitoso!',
      subtitle: 'Tu pedido ha sido confirmado',
      description: 'Hemos recibido tu pago correctamente. Te enviaremos un correo con los detalles de tu pedido.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
    },
    failure: {
      icon: <XCircle size={80} className="text-red-500" />,
      title: 'Pago no procesado',
      subtitle: 'No pudimos completar tu pago',
      description: 'Hubo un problema al procesar tu pago. Por favor intenta nuevamente o utiliza otro método de pago.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
    },
    pending: {
      icon: <Clock size={80} className="text-yellow-500" />,
      title: 'Pago pendiente',
      subtitle: 'Tu pago está siendo procesado',
      description: 'Estamos esperando la confirmación de tu pago. Te notificaremos por correo cuando se complete.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
    },
  }

  const config = statusConfig[status]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Status Card */}
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 text-center mb-8`}>
          <div className="flex justify-center mb-6">
            {config.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {config.subtitle}
          </p>
          <p className={`text-sm ${config.textColor}`}>
            {config.description}
          </p>
        </div>

        {/* Order Details */}
        {orderData && status === 'success' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Package size={24} className="text-gray-400" />
                <div>
                  <h2 className="text-lg font-bold">Detalles del pedido</h2>
                  <p className="text-sm text-gray-500">Pedido #{orderId || externalReference}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium mb-4">Productos</h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium mb-3">Envío</h3>
              <p className="text-gray-600">{orderData.shippingOption.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {orderData.formData.address}, {orderData.formData.city}, {orderData.formData.region}
              </p>
            </div>

            {/* Total */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total pagado</span>
                <span className="text-2xl font-bold text-nature">{formatPrice(orderData.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info */}
        {paymentId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="font-medium mb-3">Información del pago</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID de pago:</span>
                <span className="font-mono">{paymentId}</span>
              </div>
              {mpStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado:</span>
                  <span className="capitalize">{mpStatus}</span>
                </div>
              )}
              {(orderId || externalReference) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Referencia:</span>
                  <span className="font-mono">{orderId || externalReference}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {status === 'failure' && (
            <Link
              to="/carrito"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-nature text-white font-medium rounded-lg hover:bg-nature/90 transition-colors"
            >
              Intentar nuevamente
              <ArrowRight size={18} />
            </Link>
          )}
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Seguir comprando
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={18} />
            Ir al inicio
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            ¿Tienes alguna pregunta sobre tu pedido?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contáctanos por WhatsApp al{' '}
            <a href="https://wa.me/56983610365" className="text-nature hover:underline">
              +56 9 8361 0365
            </a>
            {' '}o escríbenos a{' '}
            <a href="mailto:info@planetaoutdoor.cl" className="text-nature hover:underline">
              info@planetaoutdoor.cl
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Componentes específicos para cada estado
export function PaymentSuccessPage() {
  return <PaymentResultPage status="success" />
}

export function PaymentFailurePage() {
  return <PaymentResultPage status="failure" />
}

export function PaymentPendingPage() {
  return <PaymentResultPage status="pending" />
}
