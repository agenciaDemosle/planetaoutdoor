import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, ChevronRight, Mic, User } from 'lucide-react'
import { useCartStore } from '../../../store/useCartStore'
import { useUIStore } from '../../../store/useUIStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { KitConfiguratorModal } from '../../kit'

// Types for SpeechRecognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// Datos del menú basados en categorías de WooCommerce (actualizado Dic 2025)
const menuData = {
  'Pesca con Mosca': {
    columns: [
      {
        title: 'Equipamiento',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=pesca-con-mosca', bold: true },
          { label: 'Cañas de Mosca', href: '/tienda?categoria=canas-mosca' },
          { label: 'Carretes de Mosca', href: '/tienda?categoria=carretes-mosca' },
          { label: 'Líneas de Mosca', href: '/tienda?categoria=lineas-mosca' },
          { label: 'Leaders y Tippets', href: '/tienda?categoria=leaders-tippets' },
          { label: 'Combos Mosqueros', href: '/tienda?categoria=combos-mosqueros' },
        ],
      },
      {
        title: 'Moscas',
        links: [
          { label: 'Todas las Moscas', href: '/tienda?categoria=moscas-pesca', bold: true },
          { label: 'Secas', href: '/tienda?categoria=moscas-secas' },
          { label: 'Ninfas', href: '/tienda?categoria=moscas-ninfas' },
          { label: 'Streamers', href: '/tienda?categoria=moscas-streamers' },
          { label: 'Terrestres', href: '/tienda?categoria=moscas-terrestres' },
        ],
      },
      {
        title: 'Accesorios',
        links: [
          { label: 'Chalecos y Packs', href: '/tienda?categoria=chalecos-packs-mosqueros' },
          { label: 'Chinguillos', href: '/tienda?categoria=chinguillos-sacaderas' },
          { label: 'Accesorios Mosqueros', href: '/tienda?categoria=accesorios-mosqueros' },
          { label: 'Lentes Polarizados', href: '/tienda?categoria=lentes-polarizados' },
        ],
      },
    ],
  },
  'Pesca Tradicional': {
    columns: [
      {
        title: 'Equipamiento',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=pesca-tradicional', bold: true },
          { label: 'Cañas Spinning/Casting', href: '/tienda?categoria=canas-tradicional' },
          { label: 'Carretes', href: '/tienda?categoria=carretes-tradicional' },
          { label: 'Nylon y Multifilamento', href: '/tienda?categoria=nylon-multifilamento' },
          { label: 'Accesorios', href: '/tienda?categoria=accesorios-tradicional' },
        ],
      },
      {
        title: 'Señuelos',
        links: [
          { label: 'Todos los Señuelos', href: '/tienda?categoria=senuelos-tradicional', bold: true },
          { label: 'Spoons y Cucharas', href: '/tienda?categoria=senuelos-spoons-cucharas' },
          { label: 'Spinners', href: '/tienda?categoria=senuelos-spinners' },
          { label: 'Crankbaits', href: '/tienda?categoria=senuelos-crankbaits' },
          { label: 'Minnows y Jerkbaits', href: '/tienda?categoria=senuelos-minnows-jerkbaits' },
          { label: 'Soft Baits y Vinilos', href: '/tienda?categoria=senuelos-soft-baits' },
          { label: 'Metal Jigs', href: '/tienda?categoria=senuelos-metal-jigs' },
          { label: 'Topwater', href: '/tienda?categoria=senuelos-topwater' },
        ],
      },
    ],
  },
  'Waders & Botas': {
    columns: [
      {
        title: 'Waders',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=waders-botas', bold: true },
          { label: 'Waders Hombre', href: '/tienda?categoria=waders-hombre' },
          { label: 'Waders Mujer', href: '/tienda?categoria=waders-mujer' },
        ],
      },
      {
        title: 'Botas de Vadeo',
        links: [
          { label: 'Botas Suela Goma', href: '/tienda?categoria=botas-vadeo-goma' },
          { label: 'Botas Suela Fieltro', href: '/tienda?categoria=botas-vadeo-fieltro' },
          { label: 'Botas Suela Intercambiable', href: '/tienda?categoria=botas-intercambiables' },
          { label: 'Accesorios de Vadeo', href: '/tienda?categoria=accesorios-vadeo' },
        ],
      },
    ],
  },
  'Ropa Técnica': {
    columns: [
      {
        title: 'Vestuario',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=ropa-tecnica', bold: true },
          { label: 'Chaquetas Impermeables', href: '/tienda?categoria=chaquetas-impermeables' },
          { label: 'Capas Intermedias', href: '/tienda?categoria=capas-intermedias' },
          { label: 'Capas Base', href: '/tienda?categoria=capas-base' },
          { label: 'Ropa con Filtro UV', href: '/tienda?categoria=ropa-uv' },
          { label: 'Pantalones y Shorts', href: '/tienda?categoria=pantalones-shorts' },
        ],
      },
      {
        title: 'Accesorios',
        links: [
          { label: 'Gorros y Jockeys', href: '/tienda?categoria=gorros-jockeys' },
          { label: 'Bandanas', href: '/tienda?categoria=bandanas' },
          { label: 'Lentes Polarizados', href: '/tienda?categoria=lentes-polarizados-ropa' },
          { label: 'Guantes', href: '/tienda?categoria=guantes' },
          { label: 'Calcetines Técnicos', href: '/tienda?categoria=calcetines-tecnicos' },
        ],
      },
    ],
  },
  'Atado de Moscas': {
    columns: [
      {
        title: 'Herramientas',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=atado-de-moscas', bold: true },
          { label: 'Prensas y Herramientas', href: '/tienda?categoria=prensas-herramientas' },
          { label: 'Anzuelos', href: '/tienda?categoria=anzuelos-atado' },
          { label: 'Kits y Packs de Atado', href: '/tienda?categoria=kits-packs-atado' },
        ],
      },
      {
        title: 'Materiales Naturales',
        links: [
          { label: 'Plumas', href: '/tienda?categoria=plumas-atado' },
          { label: 'Pelos y Cueros', href: '/tienda?categoria=pelos-naturales-cueros' },
          { label: 'Dubbings', href: '/tienda?categoria=dubbings' },
        ],
      },
      {
        title: 'Materiales Sintéticos',
        links: [
          { label: 'Sintéticos y Flash', href: '/tienda?categoria=sinteticos-flash' },
          { label: 'Cuerpos, Ribbing y Tinsel', href: '/tienda?categoria=cuerpos-ribbing-tinsel' },
          { label: 'Ojos y Cabezas', href: '/tienda?categoria=ojos-cabezas' },
          { label: 'Hilos y Floss', href: '/tienda?categoria=hilos-floss' },
          { label: 'Pegamentos y Resinas', href: '/tienda?categoria=pegamentos-barnices-resinas' },
        ],
      },
    ],
  },
  'Outdoor': {
    columns: [
      {
        title: 'Camping',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=outdoor-camping', bold: true },
          { label: 'Hidratación y Termos', href: '/tienda?categoria=hidratacion' },
          { label: 'Neveras y Coolers', href: '/tienda?categoria=neveras-coolers' },
          { label: 'Cocina y Campamento', href: '/tienda?categoria=cocina-campamento' },
          { label: 'Descanso y Sacos', href: '/tienda?categoria=descanso-sacos' },
          { label: 'Iluminación', href: '/tienda?categoria=iluminacion' },
        ],
      },
      {
        title: 'Equipamiento',
        links: [
          { label: 'Mochilas y Packs', href: '/tienda?categoria=mochilas-equipamiento', bold: true },
          { label: 'Mochilas de Pesca', href: '/tienda?categoria=mochilas-packs-pesca' },
          { label: 'Chest/Sling/Hip Packs', href: '/tienda?categoria=chest-sling-hip-packs' },
          { label: 'Bolsos y Duffels', href: '/tienda?categoria=bolsos-duffels' },
          { label: 'Calzado Outdoor', href: '/tienda?categoria=calzado-outdoor' },
          { label: 'Herramientas y Cuchillos', href: '/tienda?categoria=herramientas-cuchillos' },
        ],
      },
      {
        title: 'Flotación',
        links: [
          { label: 'Float Tubes', href: '/tienda?categoria=float-tubes-embarcaciones-flotacion' },
          { label: 'SUP y Kayak', href: '/tienda?categoria=tablas-sup-sub' },
        ],
      },
    ],
  },
}

type MenuKey = keyof typeof menuData

const navItems = [
  { label: 'Pesca con Mosca', href: '/tienda?categoria=pesca-con-mosca', hasSubmenu: true },
  { label: 'Pesca Tradicional', href: '/tienda?categoria=pesca-tradicional', hasSubmenu: true },
  { label: 'Waders & Botas', href: '/tienda?categoria=waders-botas', hasSubmenu: true },
  { label: 'Ropa Técnica', href: '/tienda?categoria=ropa-tecnica', hasSubmenu: true },
  { label: 'Atado de Moscas', href: '/tienda?categoria=atado-de-moscas', hasSubmenu: true },
  { label: 'Outdoor', href: '/tienda?categoria=outdoor-camping', hasSubmenu: true },
  { label: 'Blog', href: '/blog', hasSubmenu: false },
  { label: 'Contacto', href: '/contacto', hasSubmenu: false },
]

export function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  // Speech Recognition - Optimizado para respuesta rápida
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta búsqueda por voz. Prueba con Chrome o Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'es-CL'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    let finalTranscript = ''
    let searchTimeout: ReturnType<typeof setTimeout>

    recognition.onstart = () => {
      setIsListening(true)
      finalTranscript = ''
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript = transcript
        } else {
          interimTranscript = transcript
        }
      }

      setSearchQuery(finalTranscript || interimTranscript)

      if (finalTranscript) {
        clearTimeout(searchTimeout)
        setIsListening(false)

        searchTimeout = setTimeout(() => {
          navigate(`/tienda?buscar=${encodeURIComponent(finalTranscript.trim())}`)
          setSearchQuery('')
          setIsSearchOpen(false)
        }, 300)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const openCart = useUIStore((state) => state.openCart)
  const { isAuthenticated, user } = useAuthStore()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearchOpen(false)
      setSearchQuery('')
      navigate(`/tienda?buscar=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  // Bloquear scroll solo cuando el menú mobile está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Focus en input de búsqueda
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleMenuEnter = (label: MenuKey) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }
    setActiveMenu(label)
  }

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setMobileSubmenu(null)
  }

  return (
    <>
      {/* Header Principal */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center h-14 lg:h-16">

            {/* Left - Logo */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 mr-2"
                aria-label="Abrir menú"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp"
                  alt="Planeta Outdoor"
                  className="h-10 lg:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasSubmenu && handleMenuEnter(item.label as MenuKey)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    to={item.href}
                    className="px-4 py-5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-block"
                  >
                    {item.label}
                  </Link>

                  {/* Underline indicator */}
                  <div
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-black transform origin-left transition-transform duration-200 ${
                      activeMenu === item.label ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>
              ))}
            </nav>

            {/* Right - Icons */}
            <div className="flex items-center gap-0.5 ml-auto">
              {/* Configurator Button */}
              <button
                onClick={() => setIsConfiguratorOpen(true)}
                className="hidden sm:flex items-center px-4 py-1.5 bg-[#FE6A00] text-white text-xs font-medium tracking-wide uppercase hover:bg-[#e55f00] transition-colors mr-1"
                aria-label="Configurador de Equipo"
              >
                Arma tu Kit
              </button>

              {/* Mobile Configurator Button */}
              <button
                onClick={() => setIsConfiguratorOpen(true)}
                className="sm:hidden px-3 py-1.5 bg-[#FE6A00] text-white text-[10px] font-medium tracking-wide uppercase hover:bg-[#e55f00] transition-colors"
                aria-label="Configurador de Equipo"
              >
                Kit
              </button>

              {/* Search Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Buscar"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <>
                    {/* Overlay para cerrar */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                    />
                    {/* Burbuja de búsqueda */}
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-[calc(100vw-2rem)] max-w-[400px] -mr-2 md:mr-0 md:w-[400px]">
                      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <Search size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={isListening ? 'Escuchando...' : '¿Qué buscas?'}
                          className="flex-1 py-2 text-base bg-transparent border-0 outline-none placeholder-gray-400"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={startVoiceSearch}
                          className={`p-2 rounded-full transition-all flex-shrink-0 ${
                            isListening
                              ? 'bg-[#FE6A00] text-white animate-pulse'
                              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                          }`}
                          aria-label="Buscar por voz"
                        >
                          <Mic size={18} strokeWidth={1.5} />
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>

              {/* User Account Button */}
              <Link
                to={isAuthenticated ? '/mi-cuenta' : '/login'}
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}
              >
                {isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
                {isAuthenticated && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Carrito"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-black text-white text-[10px] font-medium flex items-center justify-center rounded-full px-1">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Desktop - Estilo Patagonia */}
        {activeMenu && menuData[activeMenu] && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
              style={{ top: '106px' }}
              onClick={() => setActiveMenu(null)}
            />

            {/* Menu Content */}
            <div
              className="absolute top-full left-0 right-0 bg-white z-50 shadow-lg border-t border-gray-100"
              onMouseEnter={() => handleMenuEnter(activeMenu)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-10">
                <div className="grid grid-cols-4 gap-8">
                  {menuData[activeMenu].columns.map((column, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                        {column.title}
                      </h3>
                      <ul className="space-y-2.5">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              to={link.href}
                              className={`text-sm transition-colors hover:underline ${
                                link.bold
                                  ? 'font-semibold text-black'
                                  : 'text-gray-700 hover:text-black'
                              }`}
                              onClick={() => setActiveMenu(null)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Footer del menú */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <Link
                    to={`/${activeMenu.toLowerCase()}`}
                    className="text-sm font-semibold text-black hover:underline"
                    onClick={() => setActiveMenu(null)}
                  >
                    Ver todo en {activeMenu} →
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile Menu - Estilo Patagonia */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={closeMenu}
          />

          {/* Panel */}
          <div className="absolute top-0 left-0 w-full max-w-[320px] h-full bg-white flex flex-col shadow-2xl animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
              <span className="text-base font-bold tracking-tight">MENÚ</span>
              <button
                onClick={closeMenu}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
                aria-label="Cerrar menú"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overscroll-contain">
              <div className="py-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.hasSubmenu ? (
                      <>
                        <button
                          onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                        >
                          <span className="text-[15px] font-medium">{item.label}</span>
                          <ChevronRight
                            size={18}
                            strokeWidth={1.5}
                            className={`text-gray-400 transition-transform duration-200 ${
                              mobileSubmenu === item.label ? 'rotate-90' : ''
                            }`}
                          />
                        </button>

                        {/* Submenu expandible */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            mobileSubmenu === item.label ? 'max-h-[1000px]' : 'max-h-0'
                          }`}
                        >
                          <div className="bg-gray-50 py-3">
                            {menuData[item.label as MenuKey]?.columns.map((column, idx) => (
                              <div key={idx} className="mb-4 last:mb-0">
                                <p className="px-5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                  {column.title}
                                </p>
                                {column.links.map((link) => (
                                  <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`block px-5 py-2 text-sm ${
                                      link.bold
                                        ? 'font-semibold text-black'
                                        : 'text-gray-700'
                                    }`}
                                    onClick={closeMenu}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-5 py-3.5 text-[15px] font-medium"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                <Link to="/tiendas" className="hover:text-black hover:underline" onClick={closeMenu}>
                  Tiendas
                </Link>
                <Link to="/usado" className="hover:text-black hover:underline" onClick={closeMenu}>
                  Equipos Usados
                </Link>
                <Link to="/contacto" className="hover:text-black hover:underline" onClick={closeMenu}>
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Kit Configurator Modal */}
      <KitConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
      />
    </>
  )
}
