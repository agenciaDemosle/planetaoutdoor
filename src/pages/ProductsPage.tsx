import { Helmet } from 'react-helmet-async'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/product/ProductCard'
import { FishingLoader } from '../components/common/FishingLoader'
import { env } from '../config/env'

export function ProductsPage() {
  const { data: products, isLoading, error } = useProducts()

  return (
    <>
      <Helmet>
        <title>Productos | {env.site.name}</title>
        <meta name="description" content={`Explora nuestros productos en ${env.site.name}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>

        {isLoading && (
          <div className="flex justify-center py-12">
            <FishingLoader message="Cargando productos..." size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">
            Error al cargar los productos. Por favor intenta de nuevo.
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No hay productos disponibles en este momento.
          </div>
        )}
      </div>
    </>
  )
}
