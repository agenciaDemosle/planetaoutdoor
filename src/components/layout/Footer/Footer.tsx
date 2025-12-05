import { Link } from 'react-router-dom'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
          {/* Logo & Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/logo.webp"
                alt="Planeta Outdoor"
                className="h-16 sm:h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Equipamiento profesional para pesca con mosca y outdoor desde 2016.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/planetaoutdoor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FE6A00] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://instagram.com/planetaoutdoor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FE6A00] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-4 md:mb-6">Productos</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/productos/waders" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Waders
                </Link>
              </li>
              <li>
                <Link to="/productos/botas" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Botas de Vadeo
                </Link>
              </li>
              <li>
                <Link to="/productos/canas" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Cañas
                </Link>
              </li>
              <li>
                <Link to="/productos/carretes" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Carretes
                </Link>
              </li>
              <li>
                <Link to="/productos/accesorios" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-4 md:mb-6">Ayuda</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/faq/como-comprar" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link to="/faq/despachos" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Envíos y despachos
                </Link>
              </li>
              <li>
                <Link to="/faq/cambios" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Cambios y devoluciones
                </Link>
              </li>
              <li>
                <Link to="/faq/garantia" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Garantía
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Nosotros */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-4 md:mb-6">Nosotros</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/nosotros" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Nuestra historia
                </Link>
              </li>
              <li>
                <Link to="/historias" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Historias
                </Link>
              </li>
              <li>
                <Link to="/equipos-usados" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Equipos usados
                </Link>
              </li>
              <li>
                <Link to="/reparaciones" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                  Reparaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-4 md:mb-6">Contacto</h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>(+56) 45 231 2870</p>
                  <p>(+569) 8361 0365</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:info@planetaoutdoor.cl" className="hover:text-white transition-colors">
                  info@planetaoutdoor.cl
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <p>Recreo 838, Temuco, Chile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-white/10">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500">Métodos de pago</p>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400">
                WebpayPlus
              </div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400">
                3, 6, 12 cuotas
              </div>
              <div className="px-3 py-1 bg-white/10 rounded text-xs text-gray-400">
                Transferencia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © 2016 – {new Date().getFullYear()} Planeta Outdoor. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link to="/terminos" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link to="/privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
