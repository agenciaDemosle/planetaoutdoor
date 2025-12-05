import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../../store/useCartStore'
import { env } from '../../../config/env'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              {env.site.name}
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text-primary hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/productos" className="text-text-primary hover:text-primary transition-colors">
              Productos
            </Link>
            <Link to="/servicios" className="text-text-primary hover:text-primary transition-colors">
              Servicios
            </Link>
            <Link to="/contacto" className="text-text-primary hover:text-primary transition-colors">
              Contacto
            </Link>
            <button className="relative p-2 text-text-primary hover:text-primary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-text-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="block px-3 py-2 text-text-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/servicios"
              className="block px-3 py-2 text-text-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </Link>
            <Link
              to="/contacto"
              className="block px-3 py-2 text-text-primary hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
