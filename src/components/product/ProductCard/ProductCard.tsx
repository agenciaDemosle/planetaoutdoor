import { Link } from 'react-router-dom'
import { Product } from '../../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link to={`/producto/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.onSale && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-medium px-2 py-1">
            OFERTA
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Brand */}
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          Planeta Outdoor
        </p>

        {/* Name */}
        <h3 className="text-sm text-black font-medium leading-tight line-clamp-2 mb-2 group-hover:text-[#f46d47] transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">
            {formatPrice(product.price)}
          </span>
          {product.onSale && product.regularPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
