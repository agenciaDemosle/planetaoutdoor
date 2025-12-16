import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/useCartStore'
import { useUIStore } from '../../store/useUIStore'

const FREE_SHIPPING_THRESHOLD = 150000

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()

  const itemCount = getItemCount()
  const total = getTotal()
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeCart}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-medium tracking-wide">
                        CARRITO ({itemCount})
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Cerrar carrito"
                      >
                        <X size={24} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Free Shipping Banner */}
                    {items.length > 0 && (
                      <div className="px-4 py-3 bg-nature/10 border-b border-nature/20">
                        <div className="flex items-center gap-3">
                          <Truck size={18} className="text-nature flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {remainingForFreeShipping > 0 ? (
                              <>
                                <p className="text-xs text-nature-dark">
                                  <span className="font-semibold">Te faltan {formatPrice(remainingForFreeShipping)}</span> para envío gratis
                                </p>
                                <div className="w-full bg-nature/20 rounded-full h-1.5 mt-1.5">
                                  <div
                                    className="bg-nature h-1.5 rounded-full transition-all"
                                    style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                                  />
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-nature-dark font-semibold">
                                ¡Tienes envío gratis!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                          <ShoppingBag size={64} strokeWidth={1} className="text-gray-300 mb-6" />
                          <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
                          <p className="text-gray-400 text-sm mb-8">
                            Agrega productos para comenzar tu compra
                          </p>
                          <button
                            onClick={closeCart}
                            className="px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors"
                          >
                            SEGUIR COMPRANDO
                          </button>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {items.map((item) => {
                            const itemKey = item.options
                              ? `${item.id}-${Object.values(item.options).join('-')}`
                              : `${item.id}`

                            return (
                              <li key={itemKey} className="px-6 py-5">
                                <div className="flex gap-4">
                                  {/* Image */}
                                  <Link
                                    to={`/producto/${item.slug}`}
                                    onClick={closeCart}
                                    className="flex-shrink-0"
                                  >
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-24 h-24 object-cover bg-gray-100"
                                    />
                                  </Link>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between gap-2">
                                      <Link
                                        to={`/producto/${item.slug}`}
                                        onClick={closeCart}
                                        className="text-sm font-medium text-black hover:underline line-clamp-2"
                                      >
                                        {item.name}
                                      </Link>
                                      <button
                                        onClick={() => removeItem(item.id, item.options)}
                                        className="flex-shrink-0 p-1 text-gray-400 hover:text-black transition-colors"
                                        aria-label="Eliminar producto"
                                      >
                                        <X size={18} strokeWidth={1.5} />
                                      </button>
                                    </div>

                                    {/* Options */}
                                    {item.options && Object.keys(item.options).length > 0 && (
                                      <div className="mt-1 text-xs text-gray-500">
                                        {Object.entries(item.options).map(([key, value]) => (
                                          <span key={key} className="mr-3">
                                            {key}: {value}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* Price */}
                                    <p className="mt-2 text-sm font-medium">
                                      {formatPrice(item.price)}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="mt-3 flex items-center">
                                      <div className="flex items-center border border-gray-300">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                          disabled={item.quantity <= 1}
                                          aria-label="Disminuir cantidad"
                                        >
                                          <Minus size={14} strokeWidth={1.5} />
                                        </button>
                                        <span className="w-10 text-center text-sm">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                                          className="p-2 hover:bg-gray-100 transition-colors"
                                          aria-label="Aumentar cantidad"
                                        >
                                          <Plus size={14} strokeWidth={1.5} />
                                        </button>
                                      </div>
                                      <span className="ml-auto text-sm font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-6 py-6 space-y-4 bg-gray-50">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-medium">{formatPrice(total)}</span>
                        </div>

                        {/* Shipping note */}
                        <p className="text-xs text-gray-500 text-center">
                          Envío calculado en el checkout
                        </p>

                        {/* Buttons */}
                        <div className="space-y-3">
                          <Link
                            to="/checkout"
                            onClick={closeCart}
                            className="block w-full py-4 bg-black text-white text-sm font-medium tracking-wide text-center hover:bg-gray-900 transition-colors"
                          >
                            FINALIZAR COMPRA
                          </Link>
                          <Link
                            to="/carrito"
                            onClick={closeCart}
                            className="block w-full py-4 bg-white text-black text-sm font-medium tracking-wide text-center border border-black hover:bg-gray-50 transition-colors"
                          >
                            VER CARRITO
                          </Link>
                        </div>

                        {/* Continue shopping */}
                        <button
                          onClick={closeCart}
                          className="w-full text-sm text-gray-600 hover:text-black underline transition-colors"
                        >
                          Seguir comprando
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CartDrawer
