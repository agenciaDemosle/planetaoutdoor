import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Clock, ExternalLink, Package, ArrowRight } from 'lucide-react'
import { wooCommerceAPI } from '../api/woocommerce'
import { formatPrice } from '../data/products'
import { trackPurchase } from '../hooks/useAnalytics'

interface OrderState {
  orderId: number
  orderKey: string
  total: number
}

export function OrderConfirmedPage() {
  const location = useLocation()
  const state = location.state as OrderState | null
  const [orderStatus, setOrderStatus] = useState<string>('pending')
  const [isChecking, setIsChecking] = useState(false)
  const [hasTrackedPurchase, setHasTrackedPurchase] = useState(false)

  useEffect(() => {
    if (!state?.orderId) return

    // Verificar estado del pedido cada 5 segundos
    const checkOrderStatus = async () => {
      try {
        setIsChecking(true)
        const order = await wooCommerceAPI.getOrder(state.orderId)
        setOrderStatus(order.status)

        // Track purchase when order is completed or processing (only once)
        if ((order.status === 'completed' || order.status === 'processing') && !hasTrackedPurchase) {
          setHasTrackedPurchase(true)

          trackPurchase({
            transaction_id: order.id.toString(),
            value: parseFloat(order.total),
            num_items: order.line_items?.length || 0,
            product_ids: order.line_items?.map((item: any) => item.product_id.toString()) || [],
            product_names: order.line_items?.map((item: any) => item.name) || [],
            email: order.billing?.email,
            phone: order.billing?.phone,
            firstName: order.billing?.first_name,
            lastName: order.billing?.last_name,
            items: order.line_items?.map((item: any) => ({
              item_id: item.product_id.toString(),
              item_name: item.name,
              price: parseFloat(item.price),
              quantity: item.quantity,
            })) || [],
          })
        }
      } catch (error) {
        console.error('Error checking order status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkOrderStatus()
    const interval = setInterval(checkOrderStatus, 5000)

    return () => clearInterval(interval)
  }, [state?.orderId, hasTrackedPurchase])

  const getStatusInfo = () => {
    switch (orderStatus) {
      case 'completed':
      case 'processing':
        return {
          icon: <CheckCircle size={64} className="text-green-500" />,
          title: '¡Pago confirmado!',
          description: 'Tu pedido ha sido procesado correctamente.',
          color: 'green'
        }
      case 'on-hold':
        return {
          icon: <Clock size={64} className="text-yellow-500" />,
          title: 'Pedido en espera',
          description: 'Estamos esperando la confirmación del pago.',
          color: 'yellow'
        }
      case 'pending':
      default:
        return {
          icon: <Clock size={64} className="text-orange-500" />,
          title: 'Completa tu pago',
          description: 'Tu pedido está pendiente de pago. Completa el pago en la pestaña que se abrió.',
          color: 'orange'
        }
    }
  }

  const statusInfo = getStatusInfo()

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No hay información del pedido</h1>
          <Link to="/tienda" className="text-nature hover:underline">
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {statusInfo.icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {statusInfo.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {statusInfo.description}
          </p>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <Package size={16} />
              <span>Pedido #{state.orderId}</span>
            </div>
            <div className="text-2xl font-bold">
              {formatPrice(state.total)}
            </div>
          </div>

          {/* Status indicator */}
          {orderStatus === 'pending' && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-orange-700">
                {isChecking && (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                )}
                <span className="text-sm">
                  {isChecking ? 'Verificando estado del pago...' : 'Esperando confirmación de pago'}
                </span>
              </div>
              <p className="text-xs text-orange-600 mt-2">
                Si ya completaste el pago, espera unos segundos mientras confirmamos.
              </p>
            </div>
          )}

          {orderStatus === 'processing' || orderStatus === 'completed' ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                Recibirás un correo de confirmación con los detalles de tu pedido.
              </p>
            </div>
          ) : null}

          {/* Payment link (if still pending) */}
          {orderStatus === 'pending' && (
            <a
              href={`https://planetaoutdoor.cl/finalizar-compra/order-pay/${state.orderId}/?pay_for_order=true&key=${state.orderKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-nature text-white font-medium rounded-lg hover:bg-nature/90 transition-colors mb-4"
            >
              Completar pago
              <ExternalLink size={16} />
            </a>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Seguir comprando
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-400 mt-8">
            ¿Tienes problemas con tu pedido? Contáctanos por{' '}
            <a href="https://wa.me/56983610365" className="text-nature hover:underline">WhatsApp (+56 9 8361 0365)</a>
            {' '}o escríbenos a{' '}
            <a href="mailto:info@planetaoutdoor.cl" className="text-nature hover:underline">info@planetaoutdoor.cl</a>
          </p>
        </div>
      </div>
    </div>
  )
}
