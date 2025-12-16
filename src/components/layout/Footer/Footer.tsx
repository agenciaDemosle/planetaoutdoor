import { Link } from 'react-router-dom'
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4 md:mb-6">
              <img
                src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/logo.webp"
                alt="Planeta Outdoor"
                className="h-14 md:h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Equipamiento profesional para pesca con mosca y outdoor desde 2008.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/planetaoutdoortemuco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FE6A00] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/planetaoutdoor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FE6A00] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-base font-bold mb-4 md:mb-6">Tienda</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tienda" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=canas" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cañas
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=carretes" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Carretes
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=waders" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Waders
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=botas" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Botas
                </Link>
              </li>
              <li>
                <Link to="/tienda?categoria=moscas" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Moscas
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-base font-bold mb-4 md:mb-6">Información</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/nosotros" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/terminos-y-condiciones" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Términos, Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/faq-argentina" className="text-sm text-gray-400 hover:text-white transition-colors">
                  FAQ Clientes Argentina
                </Link>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div className="sm:col-span-1">
            <h4 className="text-base font-bold mb-4 md:mb-6">Horario</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 flex-shrink-0 text-[#FE6A00]" />
                <div className="space-y-1">
                  <p>Lunes a Viernes: <span className="text-white">11:00 - 19:00</span></p>
                  <p>Sábado: <span className="text-white">11:00 - 17:00</span></p>
                  <p>Domingo: <span className="text-white">Cerrado</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-base font-bold mb-4 md:mb-6">Contacto</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a
                href="https://wa.me/56983610365"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <Phone size={16} className="flex-shrink-0" />
                <span>Eduardo: +56 9 8361 0365</span>
              </a>
              <a
                href="https://wa.me/56932563910"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <Phone size={16} className="flex-shrink-0" />
                <span>Daniel: +56 9 3256 3910</span>
              </a>
              <a
                href="mailto:info@planetaoutdoor.cl"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} className="flex-shrink-0" />
                <span>info@planetaoutdoor.cl</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>Recreo 838</p>
                  <p>Temuco, Chile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-[#1a1a1a]">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">Métodos de pago seguros</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Mercado Pago */}
              <div className="bg-white rounded-md px-3 py-2">
                <img
                  src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mercado_Pago.svg_.webp"
                  alt="Mercado Pago"
                  className="h-6"
                />
              </div>
              {/* Visa */}
              <div className="bg-white rounded-md px-3 py-2">
                <img
                  src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Visa_Inc._logo.svg_.png"
                  alt="Visa"
                  className="h-5"
                />
              </div>
              {/* Mastercard */}
              <div className="bg-white rounded-md px-3 py-2">
                <img
                  src="https://planetaoutdoor.cl/wp-content/uploads/2025/12/Mastercard-logo.svg_.webp"
                  alt="Mastercard"
                  className="h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © 2008 – {new Date().getFullYear()} Planeta Outdoor. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link to="/condiciones-de-uso" className="hover:text-white transition-colors">
                Condiciones de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="border-t border-white/5 bg-black/50">
        <div className="px-4 md:px-10 lg:px-20 max-w-container mx-auto py-3">
          <p className="text-center text-[10px] text-gray-600">
            Desarrollado por{' '}
            <a
              href="https://demosle.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FE6A00] hover:text-white transition-colors font-medium"
            >
              demosle.cl
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
