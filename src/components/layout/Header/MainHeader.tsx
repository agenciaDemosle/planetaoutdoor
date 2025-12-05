import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, ChevronRight, Mic } from 'lucide-react'
import { useCartStore } from '../../../store/useCartStore'
import { useUIStore } from '../../../store/useUIStore'

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

// Datos del menú basados en categorías REALES de WooCommerce (IDs verificados)
const menuData = {
  'Equipo de Pesca': {
    columns: [
      {
        title: 'Cañas y Carretes',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=equipo-de-pesca', bold: true },
          { label: 'Cañas', href: '/tienda?categoria=canas' },
          { label: 'Carretes', href: '/tienda?categoria=carretes' },
          { label: 'Líneas', href: '/tienda?categoria=lineas' },
          { label: 'Leaders', href: '/tienda?categoria=leaders' },
        ],
      },
      {
        title: 'Moscas',
        links: [
          { label: 'Moscas', href: '/tienda?categoria=moscas' },
          { label: 'Atado de Moscas', href: '/tienda?categoria=atado-de-moscas' },
          { label: 'Señuelos', href: '/tienda?categoria=senuelos' },
        ],
      },
      {
        title: 'Equipamiento',
        links: [
          { label: 'Cajas', href: '/tienda?categoria=cajas' },
          { label: 'Chinguillos', href: '/tienda?categoria=chinguillos' },
          { label: 'Accesorios', href: '/tienda?categoria=accesorios' },
          { label: 'Float Tubes', href: '/tienda?categoria=float-tubes' },
        ],
      },
    ],
  },
  'Waders & Botas': {
    columns: [
      {
        title: 'Waders y Botas',
        links: [
          { label: 'Ver Waders', href: '/tienda?categoria=waders', bold: true },
          { label: 'Ver Botas', href: '/tienda?categoria=botas', bold: true },
        ],
      },
    ],
  },
  'Ropa': {
    columns: [
      {
        title: 'Vestuario',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=vestuario', bold: true },
          { label: 'Chaquetas', href: '/tienda?categoria=chaquetas' },
          { label: 'Poleras UV y Camisas', href: '/tienda?categoria=poleras-uv' },
          { label: 'Gorros', href: '/tienda?categoria=gorros' },
        ],
      },
      {
        title: 'Accesorios',
        links: [
          { label: 'Gafas y Straps', href: '/tienda?categoria=gafas-y-straps' },
          { label: 'Chalecos y Bolsos', href: '/tienda?categoria=chalecos-y-bolsos' },
        ],
      },
    ],
  },
  'Accesorios': {
    columns: [
      {
        title: 'Accesorios de Pesca',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=accesorios-de-pesca', bold: true },
          { label: 'Infaltables', href: '/tienda?categoria=infaltables' },
          { label: 'Gafas y Straps', href: '/tienda?categoria=gafas-y-straps' },
          { label: 'Zapatos', href: '/tienda?categoria=zapatos' },
        ],
      },
      {
        title: 'Otros',
        links: [
          { label: 'Flashers y Parabans', href: '/tienda?categoria=flashers-y-parabans' },
          { label: 'Gearaid', href: '/tienda?categoria=gearaid' },
          { label: 'Stickers', href: '/tienda?categoria=stickers' },
        ],
      },
    ],
  },
  'Outdoors': {
    columns: [
      {
        title: 'Camping y Outdoor',
        links: [
          { label: 'Ver todo', href: '/tienda?categoria=outdoors-inicio', bold: true },
          { label: 'Termos', href: '/tienda?categoria=termos-outdoors-inicio' },
          { label: 'Coolers', href: '/tienda?categoria=coolers' },
          { label: 'Carpas y Sacos', href: '/tienda?categoria=carpas-y-sacos' },
          { label: 'Cocinillas', href: '/tienda?categoria=cocinillas' },
        ],
      },
      {
        title: 'Actividades',
        links: [
          { label: 'Calzado', href: '/tienda?categoria=calzado' },
          { label: 'Actividades Acuáticas', href: '/tienda?categoria=actividades-acuaticas' },
        ],
      },
    ],
  },
}

type MenuKey = keyof typeof menuData

const navItems = [
  { label: 'Equipo de Pesca', href: '/tienda?categoria=equipo-de-pesca', hasSubmenu: true },
  { label: 'Waders & Botas', href: '/tienda?categoria=waders', hasSubmenu: true },
  { label: 'Ropa', href: '/tienda?categoria=vestuario', hasSubmenu: true },
  { label: 'Accesorios', href: '/tienda?categoria=accesorios-de-pesca', hasSubmenu: true },
  { label: 'Outdoors', href: '/tienda?categoria=outdoors-inicio', hasSubmenu: true },
  { label: 'Nuestra Historia', href: '/nosotros', hasSubmenu: false },
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
                  src="/logo.webp"
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
    </>
  )
}
