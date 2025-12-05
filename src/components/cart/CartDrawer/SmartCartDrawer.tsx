import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../../../store/useCartStore'
import { Link } from 'react-router-dom'

interface SmartCartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SmartCartDrawer({ isOpen, onClose }: SmartCartDrawerProps) {
  const { items, getTotal, updateQuantity, removeItem } = useCartStore()
  const grandTotal = getTotal()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 bg-[#FE6A00] text-white">
                      <Dialog.Title className="flex items-center gap-2 text-lg font-semibold">
                        <ShoppingCart className="h-5 w-5" />
                        Carrito
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {items.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                          Tu carrito está vacío
                        </div>
                      ) : (
                        <ul className="space-y-4">
                          {items.map((item) => (
                            <li key={item.id} className="flex gap-4 border-b pb-4">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-[#FE6A00] font-semibold">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 border rounded hover:bg-gray-100"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 border rounded hover:bg-gray-100"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t px-4 py-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-[#FE6A00]">{formatPrice(grandTotal)}</span>
                        </div>
                        <Link
                          to="/checkout"
                          onClick={onClose}
                          className="block w-full bg-[#FE6A00] text-white text-center py-3 font-semibold hover:bg-[#e55f00] transition-colors"
                        >
                          Ir al checkout
                        </Link>
                        <Link
                          to="/carrito"
                          onClick={onClose}
                          className="block w-full border border-[#FE6A00] text-[#FE6A00] text-center py-3 font-semibold hover:bg-[#FE6A00] hover:text-white transition-colors"
                        >
                          Ver carrito
                        </Link>
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
