import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { env } from '../config/env'

export function ThankYouPage() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <>
      <Helmet>
        <title>Gracias por tu compra | {env.site.name}</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-text-muted mb-8">
          Tu pedido {orderId && `#${orderId}`} ha sido recibido y está siendo procesado.
          Te enviaremos un correo con los detalles de tu compra.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
