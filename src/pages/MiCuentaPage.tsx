import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  Loader2,
  ShoppingBag,
  X,
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { wooCommerceAPI } from '../api/woocommerce'

interface Order {
  id: number
  number: string
  status: string
  date_created: string
  total: string
  line_items: Array<{
    id: number
    name: string
    quantity: number
    total: string
    image?: { src: string }
  }>
  billing: {
    first_name: string
    last_name: string
    email: string
  }
}

const statusLabels: Record<string, { label: string; style: string }> = {
  pending: { label: 'Pendiente', style: 'border-yellow-600 text-yellow-700' },
  processing: { label: 'Procesando', style: 'border-blue-600 text-blue-700' },
  'on-hold': { label: 'En espera', style: 'border-orange-600 text-orange-700' },
  completed: { label: 'Completado', style: 'border-green-600 text-green-700' },
  cancelled: { label: 'Cancelado', style: 'border-red-600 text-red-700' },
  refunded: { label: 'Reembolsado', style: 'border-gray-500 text-gray-600' },
  failed: { label: 'Fallido', style: 'border-red-600 text-red-700' },
}

type TabType = 'dashboard' | 'orders' | 'addresses' | 'account'

export function MiCuentaPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, billingAddress, shippingAddress } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mi-cuenta' } })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders()
    }
  }, [user, activeTab])

  const fetchOrders = async () => {
    if (!user) return
    setLoadingOrders(true)
    try {
      const response = await wooCommerceAPI.getOrders({ customer: user.id, per_page: 10 })
      setOrders(response || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    return num.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    })
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Panel', icon: User },
    { id: 'orders' as TabType, label: 'Mis Pedidos', icon: Package },
    { id: 'addresses' as TabType, label: 'Direcciones', icon: MapPin },
    { id: 'account' as TabType, label: 'Mi Cuenta', icon: Settings },
  ]

  return (
    <>
      <Helmet>
        <title>Mi Cuenta | Planeta Outdoor</title>
        <meta
          name="description"
          content="Gestiona tu cuenta de Planeta Outdoor. Revisa tus pedidos, actualiza tus direcciones y administra tu perfil."
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-black text-white py-16 md:py-20">
          <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
              Mi Cuenta
            </p>
            <h1 className="text-3xl md:text-4xl font-light">
              Hola, {user.firstName || user.displayName}
            </h1>
            <p className="text-gray-400 mt-2">{user.email}</p>
          </div>
        </div>

        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="border border-gray-200">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors border-b border-gray-200 last:border-b-0 ${
                      activeTab === item.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium uppercase tracking-wide">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium uppercase tracking-wide">Cerrar Sesión</span>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Resumen
                    </p>
                    <h2 className="text-2xl font-light text-gray-900">Panel de Control</h2>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 p-6">
                      <p className="text-3xl font-light text-gray-900 mb-1">{orders.length}</p>
                      <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Pedidos totales</p>
                    </div>
                    <div className="border border-gray-200 p-6">
                      <p className="text-3xl font-light text-gray-900 mb-1">
                        {orders.filter((o) => o.status === 'completed').length}
                      </p>
                      <p className="text-xs uppercase tracking-[0.15em] text-gray-500">Completados</p>
                    </div>
                    <div className="border border-gray-200 p-6">
                      <p className="text-3xl font-light text-gray-900 mb-1">
                        {orders.filter((o) => o.status === 'processing').length}
                      </p>
                      <p className="text-xs uppercase tracking-[0.15em] text-gray-500">En proceso</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                          Pedidos Recientes
                        </h3>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition-colors"
                        >
                          Ver todos
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-6 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Pedido #{order.number}</p>
                            <p className="text-sm text-gray-500 mt-1">{formatDate(order.date_created)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium border ${
                                statusLabels[order.status]?.style || 'border-gray-400 text-gray-600'
                              }`}
                            >
                              {statusLabels[order.status]?.label || order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="p-12 text-center">
                          <Package size={40} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500 mb-4">Aún no tienes pedidos</p>
                          <Link
                            to="/tienda"
                            className="inline-block px-6 py-3 bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
                          >
                            Explorar tienda
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                      to="/tienda"
                      className="border border-gray-200 p-6 hover:border-gray-400 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <ShoppingBag size={20} className="text-gray-400 group-hover:text-black transition-colors" />
                        <div>
                          <p className="font-medium text-gray-900">Explorar Tienda</p>
                          <p className="text-sm text-gray-500">Descubre nuevos productos</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </Link>
                    <Link
                      to="/contacto"
                      className="border border-gray-200 p-6 hover:border-gray-400 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <MapPin size={20} className="text-gray-400 group-hover:text-black transition-colors" />
                        <div>
                          <p className="font-medium text-gray-900">Contacto</p>
                          <p className="text-sm text-gray-500">¿Necesitas ayuda?</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Historial
                    </p>
                    <h2 className="text-2xl font-light text-gray-900">Mis Pedidos</h2>
                  </div>

                  {loadingOrders ? (
                    <div className="border border-gray-200 p-12 text-center">
                      <Loader2 size={32} className="mx-auto text-gray-400 animate-spin mb-4" />
                      <p className="text-gray-500">Cargando pedidos...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                              <div>
                                <p className="text-lg font-medium text-gray-900">Pedido #{order.number}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatDate(order.date_created)}</p>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-medium border ${
                                  statusLabels[order.status]?.style || 'border-gray-400 text-gray-600'
                                }`}
                              >
                                {statusLabels[order.status]?.label || order.status}
                              </span>
                            </div>

                            <div className="space-y-3 mb-6">
                              {order.line_items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gray-100 overflow-hidden flex-shrink-0">
                                    {item.image?.src ? (
                                      <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package size={16} className="text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">{formatPrice(item.total)}</p>
                                </div>
                              ))}
                              {order.line_items.length > 2 && (
                                <p className="text-sm text-gray-500 pl-[72px]">
                                  +{order.line_items.length - 2} productos más
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                              <p className="text-lg font-medium text-gray-900">
                                Total: {formatPrice(order.total)}
                              </p>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-600 hover:text-black transition-colors"
                              >
                                <Eye size={16} />
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-gray-200 p-12 text-center">
                      <Package size={40} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-6">Aún no tienes pedidos</p>
                      <Link
                        to="/tienda"
                        className="inline-block px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
                      >
                        Explorar tienda
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Envíos
                    </p>
                    <h2 className="text-2xl font-light text-gray-900">Mis Direcciones</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Billing Address */}
                    <div className="border border-gray-200 p-6">
                      <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
                        Dirección de Facturación
                      </h3>
                      {billingAddress ? (
                        <div className="text-gray-600 space-y-1 text-sm">
                          <p className="font-medium text-gray-900">{billingAddress.firstName} {billingAddress.lastName}</p>
                          <p>{billingAddress.address1}</p>
                          {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                          <p>{billingAddress.city}, {billingAddress.state}</p>
                          <p>{billingAddress.postcode}</p>
                          {billingAddress.phone && <p className="pt-2">Tel: {billingAddress.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No has agregado una dirección de facturación</p>
                      )}
                      <a
                        href="https://planetaoutdoor.cl/mi-cuenta/edit-address/billing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 text-xs uppercase tracking-wide text-gray-600 hover:text-black transition-colors"
                      >
                        Editar dirección
                      </a>
                    </div>

                    {/* Shipping Address */}
                    <div className="border border-gray-200 p-6">
                      <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
                        Dirección de Envío
                      </h3>
                      {shippingAddress ? (
                        <div className="text-gray-600 space-y-1 text-sm">
                          <p className="font-medium text-gray-900">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                          <p>{shippingAddress.address1}</p>
                          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                          <p>{shippingAddress.city}, {shippingAddress.state}</p>
                          <p>{shippingAddress.postcode}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No has agregado una dirección de envío</p>
                      )}
                      <a
                        href="https://planetaoutdoor.cl/mi-cuenta/edit-address/shipping/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 text-xs uppercase tracking-wide text-gray-600 hover:text-black transition-colors"
                      >
                        Editar dirección
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">
                      Perfil
                    </p>
                    <h2 className="text-2xl font-light text-gray-900">Configuración de Cuenta</h2>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-6">
                      Información Personal
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Nombre</label>
                          <p className="text-gray-900">{user.firstName || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Apellido</label>
                          <p className="text-gray-900">{user.lastName || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    <a
                      href="https://planetaoutdoor.cl/mi-cuenta/edit-account/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-8 px-6 py-3 border border-gray-300 text-xs font-medium uppercase tracking-wider text-gray-700 hover:border-black hover:text-black transition-colors"
                    >
                      Editar información
                    </a>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
                      Cambiar Contraseña
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Para cambiar tu contraseña, haz clic en el siguiente enlace:
                    </p>
                    <a
                      href="https://planetaoutdoor.cl/mi-cuenta/edit-account/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
                    >
                      Cambiar contraseña
                    </a>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-2">
                      Cerrar Sesión
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Al cerrar sesión, se eliminará tu información de este dispositivo.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 border border-gray-300 text-xs font-medium uppercase tracking-wider text-gray-700 hover:border-black hover:text-black transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-1">Detalle</p>
                <h3 className="text-xl font-light text-gray-900">Pedido #{selectedOrder.number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">{formatDate(selectedOrder.date_created)}</p>
                <span
                  className={`px-3 py-1 text-xs font-medium border ${
                    statusLabels[selectedOrder.status]?.style || 'border-gray-400 text-gray-600'
                  }`}
                >
                  {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium uppercase tracking-wide text-gray-900">Productos</h4>
                {selectedOrder.line_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                      {item.image?.src ? (
                        <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
