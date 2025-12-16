import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface RedirectingToPaymentPageProps {
  paymentUrl: string
}

export function RedirectingToPaymentPage({ paymentUrl }: RedirectingToPaymentPageProps) {
  useEffect(() => {
    // Redirigir después de un breve delay para mostrar la animación
    const timer = setTimeout(() => {
      window.location.href = paymentUrl
    }, 2000)

    return () => clearTimeout(timer)
  }, [paymentUrl])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a4a] to-[#0d1f28] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Logo o imagen outdoor */}
        <div className="mb-8">
          <svg
            viewBox="0 0 200 120"
            className="w-48 h-28 mx-auto opacity-90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Montañas */}
            <path
              d="M0 120 L40 60 L60 80 L100 30 L140 80 L160 60 L200 120 Z"
              fill="#2d5a6b"
            />
            <path
              d="M20 120 L60 70 L80 85 L120 45 L160 85 L180 70 L200 120 Z"
              fill="#3d7a8b"
            />
            {/* Nieve en las cumbres */}
            <path
              d="M95 30 L100 30 L105 35 L100 33 Z"
              fill="white"
              opacity="0.8"
            />
            <path
              d="M38 60 L40 60 L44 65 L40 63 Z"
              fill="white"
              opacity="0.8"
            />
            {/* Sol/Luna */}
            <circle cx="160" cy="35" r="12" fill="#FE6A00" opacity="0.9" />
            {/* Pájaros */}
            <path
              d="M70 45 Q75 40 80 45"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M85 50 Q88 47 91 50"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Texto */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Preparando tu pago
        </h1>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Te estamos redirigiendo a Mercado Pago para completar tu compra de forma segura
        </p>

        {/* Loader */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Loader2 size={24} className="animate-spin text-[#00b1ea]" />
          <span className="text-white/80">Redirigiendo...</span>
        </div>

        {/* Logo Mercado Pago */}
        <div className="flex items-center justify-center gap-3 opacity-90">
          <span className="text-white/60 text-sm">Pago procesado por</span>
          <div className="bg-white rounded-md px-3 py-1.5">
            <img
              src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mercado_Pago.svg_.webp"
              alt="Mercado Pago"
              className="h-5"
            />
          </div>
        </div>

        {/* Indicadores de seguridad */}
        <div className="mt-8 flex items-center justify-center gap-4 text-white/50 text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Conexión segura</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Datos protegidos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
