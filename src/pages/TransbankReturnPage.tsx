import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, XCircle, Loader2, CreditCard, Calendar, Hash } from 'lucide-react'
import { transbankAPI } from '../api/transbank'
import { wooCommerceAPI } from '../api/woocommerce'
import { useCartStore } from '../store/useCartStore'

interface TransactionResult {
  vci: string
  amount: number
  status: string
  buy_order: string
  session_id: string
  card_detail: {
    card_number: string
  }
  accounting_date: string
  transaction_date: string
  authorization_code: string
  payment_type_code: string
  response_code: number
  installments_number: number
}

export function TransbankReturnPage() {
  const [searchParams] = useSearchParams()
  const { clearCart } = useCartStore()

  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<TransactionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const confirmPayment = async () => {
      // Obtener token de la URL (GET) o del body (POST viene como query param por la redirección)
      const tokenWs = searchParams.get('token_ws')
      const tbkToken = searchParams.get('TBK_TOKEN')

      // Si hay TBK_TOKEN, el usuario canceló o hubo timeout
      if (tbkToken) {
        setError('El pago fue cancelado o expiró. Por favor, intenta nuevamente.')
        setLoading(false)
        return
      }

      // Si no hay token_ws, algo salió mal
      if (!tokenWs) {
        setError('No se recibió información del pago. Por favor, contacta a soporte.')
        setLoading(false)
        return
      }

      try {
        // Confirmar transacción con Transbank
        const transactionResult = await transbankAPI.confirmTransaction(tokenWs)
        setResult(transactionResult)

        // Verificar si fue exitosa
        if (transactionResult.response_code === 0 && transactionResult.status === 'AUTHORIZED') {
          setIsSuccess(true)

          // Obtener orderId del sessionId o buyOrder
          const orderId = localStorage.getItem('pendingOrderId')

          if (orderId) {
            // Actualizar orden en WooCommerce
            try {
              await wooCommerceAPI.updateOrder(parseInt(orderId), {
                status: 'processing',
                transaction_id: transactionResult.authorization_code,
                meta_data: [
                  { key: '_transbank_token', value: tokenWs },
                  { key: '_transbank_authorization_code', value: transactionResult.authorization_code },
                  { key: '_transbank_card_number', value: transactionResult.card_detail.card_number },
                  { key: '_transbank_payment_type', value: transactionResult.payment_type_code },
                  { key: '_transbank_installments', value: transactionResult.installments_number.toString() },
                ]
              })
            } catch (updateError) {
              console.error('Error actualizando orden:', updateError)
            }

            // Limpiar datos temporales
            localStorage.removeItem('pendingOrderId')
            localStorage.removeItem('pendingBuyOrder')
          }

          // Limpiar carrito
          clearCart()
        } else {
          setIsSuccess(false)
          setError(getErrorMessage(transactionResult.response_code))
        }
      } catch (err: unknown) {
        console.error('Error confirmando pago:', err)
        setError('Error al confirmar el pago. Por favor, contacta a soporte.')
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams, clearCart])

  const getErrorMessage = (code: number): string => {
    const errorMessages: Record<number, string> = {
      [-1]: 'Rechazo de transacción - Error en los datos de la tarjeta',
      [-2]: 'Rechazo de transacción - Tarjeta bloqueada',
      [-3]: 'Rechazo de transacción - Error en la transacción',
      [-4]: 'Rechazo de transacción - Monto inválido',
      [-5]: 'Rechazo de transacción - Error genérico',
    }
    return errorMessages[code] || `Transacción rechazada (código: ${code})`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleString('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return dateStr
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Helmet>
          <title>Procesando pago... | Planeta Outdoor</title>
        </Helmet>
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Confirmando tu pago...</h2>
          <p className="text-gray-500 mt-2">Por favor, no cierres esta ventana</p>
        </div>
      </div>
    )
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Helmet>
          <title>Error en el pago | Planeta Outdoor</title>
        </Helmet>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago no completado</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-y-4">
            <Link
              to="/carrito"
              className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Volver al carrito
            </Link>
            <Link
              to="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Helmet>
          <title>Pago exitoso | Planeta Outdoor</title>
        </Helmet>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 text-white p-8 text-center">
              <CheckCircle className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Pago exitoso</h1>
              <p className="text-green-100">Tu compra ha sido procesada correctamente</p>
            </div>

            {/* Detalles */}
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-6">Detalles de la transacción</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Hash className="w-5 h-5" />
                    <span>Orden de compra</span>
                  </div>
                  <span className="font-semibold">{result.buy_order}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CreditCard className="w-5 h-5" />
                    <span>Tarjeta</span>
                  </div>
                  <span className="font-semibold">**** {result.card_detail.card_number}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-5 h-5 flex items-center justify-center font-bold">$</span>
                    <span>Monto total</span>
                  </div>
                  <span className="font-semibold text-green-600 text-xl">
                    {formatAmount(result.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Fecha</span>
                  </div>
                  <span className="font-semibold">{formatDate(result.transaction_date)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Código de autorización</span>
                  <span className="font-semibold">{result.authorization_code}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Tipo de pago</span>
                  <span className="font-semibold">
                    {transbankAPI.getPaymentTypeDescription(result.payment_type_code)}
                  </span>
                </div>

                {result.installments_number > 0 && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">Cuotas</span>
                    <span className="font-semibold">{result.installments_number}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Recibirás un correo de confirmación con los detalles de tu pedido.
                  Si tienes preguntas, contáctanos al{' '}
                  <a href="tel:+56983610365" className="text-green-600 font-semibold">
                    +56 9 8361 0365
                  </a>
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  to="/tienda"
                  className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                >
                  Seguir comprando
                </Link>
                <Link
                  to="/"
                  className="block w-full text-gray-600 hover:text-gray-800 transition text-center"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Transacción rechazada
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>Pago rechazado | Planeta Outdoor</title>
      </Helmet>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago rechazado</h1>
        <p className="text-gray-600 mb-4">{error || 'La transacción no pudo ser procesada'}</p>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm">
            <p><strong>Orden:</strong> {result.buy_order}</p>
            <p><strong>Monto:</strong> {formatAmount(result.amount)}</p>
            <p><strong>Estado:</strong> {result.status}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/carrito"
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Intentar nuevamente
          </Link>
          <Link
            to="/"
            className="block w-full text-gray-600 hover:text-gray-800 transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TransbankReturnPage
