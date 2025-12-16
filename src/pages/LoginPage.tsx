import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { env } from '../config/env'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const from = (location.state as { from?: string })?.from || '/mi-cuenta'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login with WordPress JWT Authentication
        const response = await fetch(`${env.woo.url}/wp-json/jwt-auth/v1/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        })

        const data = await response.json()

        if (response.ok && data.token) {
          // Login successful - store user data
          login({
            id: data.user_id || 0,
            email: data.user_email,
            firstName: data.user_display_name?.split(' ')[0] || '',
            lastName: data.user_display_name?.split(' ').slice(1).join(' ') || '',
            displayName: data.user_display_name,
            avatar: undefined,
          }, data.token)

          // Try to get customer data from WooCommerce for addresses
          try {
            const isDev = import.meta.env.DEV
            const baseUrl = isDev ? '/api/woo/customers' : `${env.woo.url}/wp-json/wc/v3/customers`
            const customerUrl = `${baseUrl}?email=${encodeURIComponent(data.user_email)}&consumer_key=${env.woo.consumerKey}&consumer_secret=${env.woo.consumerSecret}`

            const customerResponse = await fetch(customerUrl)
            const customers = await customerResponse.json()

            if (customerResponse.ok && customers.length > 0) {
              const customer = customers[0]

              if (customer.billing?.address_1) {
                const { setBillingAddress } = useAuthStore.getState()
                setBillingAddress({
                  firstName: customer.billing.first_name,
                  lastName: customer.billing.last_name,
                  company: customer.billing.company,
                  address1: customer.billing.address_1,
                  address2: customer.billing.address_2,
                  city: customer.billing.city,
                  state: customer.billing.state,
                  postcode: customer.billing.postcode,
                  country: customer.billing.country,
                  phone: customer.billing.phone,
                })
              }

              if (customer.shipping?.address_1) {
                const { setShippingAddress } = useAuthStore.getState()
                setShippingAddress({
                  firstName: customer.shipping.first_name,
                  lastName: customer.shipping.last_name,
                  company: customer.shipping.company,
                  address1: customer.shipping.address_1,
                  address2: customer.shipping.address_2,
                  city: customer.shipping.city,
                  state: customer.shipping.state,
                  postcode: customer.shipping.postcode,
                  country: customer.shipping.country,
                })
              }
            }
          } catch (err) {
            console.log('Could not fetch customer addresses:', err)
          }

          toast.success('Bienvenido de vuelta')
          navigate(from, { replace: true })
        } else {
          // Handle specific error messages
          const errorMsg = data.message?.replace(/<[^>]*>/g, '') || 'Credenciales incorrectas'
          toast.error(errorMsg)
        }
      } else {
        // Register new user
        if (password !== confirmPassword) {
          toast.error('Las contraseñas no coinciden')
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres')
          setIsLoading(false)
          return
        }

        // Use proxy in development to avoid CORS
        const isDev = import.meta.env.DEV
        const baseUrl = isDev ? '/api/woo/customers' : `${env.woo.url}/wp-json/wc/v3/customers`
        const apiUrl = `${baseUrl}?consumer_key=${env.woo.consumerKey}&consumer_secret=${env.woo.consumerSecret}`

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            first_name: firstName,
            last_name: lastName,
            username: email,
            password: password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          toast.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
          setIsLogin(true)
          setPassword('')
          setConfirmPassword('')
        } else {
          toast.error(data.message || 'Error al crear la cuenta')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'} | Planeta Outdoor</title>
        <meta
          name="description"
          content="Inicia sesión o crea tu cuenta en Planeta Outdoor para acceder a tus pedidos, guardar direcciones y disfrutar de una experiencia personalizada."
        />
      </Helmet>

      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp"
                alt="Planeta Outdoor"
                className="h-16 mx-auto"
              />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isLogin
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  !isLogin
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nombre
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Juan"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Apellido
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Pérez"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="********"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-gray-600">Recordarme</span>
                  </label>
                  <a
                    href="https://planetaoutdoor.cl/mi-cuenta/lost-password/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isLogin ? 'Ingresando...' : 'Creando cuenta...'}
                  </>
                ) : (
                  isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">o</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Continue as Guest */}
            <Link
              to="/tienda"
              className="block w-full text-center py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continuar como invitado
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Al {isLogin ? 'iniciar sesión' : 'crear una cuenta'}, aceptas nuestros{' '}
            <Link to="/terminos-y-condiciones" className="underline hover:text-gray-700">
              Términos y Condiciones
            </Link>{' '}
            y{' '}
            <Link to="/condiciones-de-uso" className="underline hover:text-gray-700">
              Condiciones de Uso
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
