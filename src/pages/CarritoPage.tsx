import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronRight, Truck } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { formatPrice } from '../data/products'

export function CarritoPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotal = useCartStore((state) => state.getTotal)

  const subtotal = getTotal()
  const FREE_SHIPPING_THRESHOLD = 80000
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-8">
            Explora nuestra tienda y encuentra los mejores productos para tu próxima aventura de pesca.
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded"
          >
            Explorar tienda
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-black">
              Inicio
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-black font-medium">Carrito</span>
          </nav>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="bg-nature/10 border-b border-nature/20">
          <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-nature" />
              <div className="flex-1">
                <p className="text-sm text-nature font-medium">
                  ¡Te faltan {formatPrice(remainingForFreeShipping)} para envío gratis!
                </p>
                <div className="w-full bg-nature/20 rounded-full h-2 mt-1">
                  <div
                    className="bg-nature h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {remainingForFreeShipping <= 0 && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                ¡Felicidades! Tu pedido tiene envío gratis
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Tu Carrito ({items.reduce((sum, item) => sum + item.quantity, 0)} productos)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${JSON.stringify(item.options)}`}
                className="bg-white p-4 md:p-6 rounded-lg border border-gray-200"
              >
                <div className="flex gap-4">
                  <Link to={`/producto/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/producto/${item.slug}`}
                      className="font-medium text-black hover:text-gray-600 line-clamp-2 block"
                    >
                      {item.name}
                    </Link>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {Object.entries(item.options)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(' | ')}
                      </p>
                    )}
                    <p className="font-bold text-lg mt-2">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.options)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/tienda"
                className="text-sm text-gray-500 hover:text-black underline"
              >
                Continuar comprando
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 underline"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className={remainingForFreeShipping <= 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {remainingForFreeShipping <= 0 ? 'Gratis' : 'Calculado en checkout'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Impuestos incluidos
                </p>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-6 flex items-center justify-center gap-2 bg-black text-white py-4 font-medium hover:bg-gray-800 transition-colors rounded"
              >
                Proceder al pago
                <ArrowRight size={18} />
              </Link>

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Pago seguro con WebpayPlus
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Cuotas: 3, 6 o 12 sin interés
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Múltiples medios de pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
