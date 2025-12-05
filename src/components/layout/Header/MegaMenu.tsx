import { Link } from 'react-router-dom'

interface MegaMenuProps {
  activeMenu: string
  onClose: () => void
}

const menuData: Record<string, { categories: { title: string; links: { label: string; href: string }[] }[]; featured?: { image: string; title: string; href: string } }> = {
  Productos: {
    categories: [
      {
        title: 'Vadeo',
        links: [
          { label: 'Waders', href: '/productos/waders' },
          { label: 'Botas Suela Fieltro', href: '/productos/botas-fieltro' },
          { label: 'Botas Suela Goma', href: '/productos/botas-goma' },
          { label: 'Accesorios de Vadeo', href: '/productos/accesorios-vadeo' },
        ],
      },
      {
        title: 'Equipos de Pesca',
        links: [
          { label: 'Cañas de Mosca', href: '/productos/canas' },
          { label: 'Carretes', href: '/productos/carretes' },
          { label: 'Líneas y Líderes', href: '/productos/lineas' },
          { label: 'Moscas', href: '/productos/moscas' },
          { label: 'Atado de Moscas', href: '/productos/atado-moscas' },
        ],
      },
      {
        title: 'Vestuario y Accesorios',
        links: [
          { label: 'Chaquetas', href: '/productos/chaquetas' },
          { label: 'Gorros y Guantes', href: '/productos/gorros' },
          { label: 'Anteojos Polarizados', href: '/productos/anteojos' },
          { label: 'Mochilas y Bolsos', href: '/productos/mochilas' },
          { label: 'Accesorios', href: '/productos/accesorios' },
        ],
      },
    ],
    featured: {
      image: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=400&h=300&fit=crop',
      title: 'Nuevos Waders Temporada',
      href: '/productos/nuevos',
    },
  },
  Deportes: {
    categories: [
      {
        title: 'Pesca con Mosca',
        links: [
          { label: 'Truchas', href: '/deportes/pesca-truchas' },
          { label: 'Salmónidos', href: '/deportes/pesca-salmonidos' },
          { label: 'Ríos Patagónicos', href: '/deportes/rios-patagonicos' },
          { label: 'Guías y Destinos', href: '/deportes/guias-destinos' },
        ],
      },
      {
        title: 'Otras Modalidades',
        links: [
          { label: 'Pesca Spinning', href: '/deportes/pesca-spinning' },
          { label: 'Pesca de Mar', href: '/deportes/pesca-mar' },
          { label: 'Kayak Fishing', href: '/deportes/kayak-fishing' },
          { label: 'Pesca con Trolling', href: '/deportes/trolling' },
        ],
      },
      {
        title: 'Outdoor',
        links: [
          { label: 'Trekking', href: '/deportes/trekking' },
          { label: 'Camping', href: '/deportes/camping' },
          { label: 'Kayak', href: '/deportes/kayak' },
        ],
      },
    ],
    featured: {
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      title: 'Guía de Pesca con Mosca',
      href: '/deportes/guia-pesca-mosca',
    },
  },
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const menu = menuData[activeMenu]

  if (!menu) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-megamenu"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div
        className="absolute top-full left-0 right-0 bg-white shadow-dropdown z-megamenu animate-slide-down"
        onMouseLeave={onClose}
      >
        <div className="container-main py-10">
          <div className="grid grid-cols-12 gap-8">
            {/* Categories */}
            <div className="col-span-8 grid grid-cols-3 gap-8">
              {menu.categories.map((category) => (
                <div key={category.title}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-sm text-gray-600 hover:text-black transition-colors"
                          onClick={onClose}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured Image */}
            {menu.featured && (
              <div className="col-span-4">
                <Link
                  to={menu.featured.href}
                  className="block group"
                  onClick={onClose}
                >
                  <div className="relative overflow-hidden rounded-lg aspect-4/3">
                    <img
                      src={menu.featured.image}
                      alt={menu.featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <h4 className="absolute bottom-4 left-4 text-white text-lg font-bold">
                      {menu.featured.title}
                    </h4>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* View All Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to={`/${activeMenu.toLowerCase()}`}
              className="text-sm font-medium hover:underline"
              onClick={onClose}
            >
              Ver todo en {activeMenu} →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
