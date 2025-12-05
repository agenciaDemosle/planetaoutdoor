import { Helmet } from 'react-helmet-async'
import { env } from '../config/env'

export function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Servicios | {env.site.name}</title>
        <meta name="description" content={`Conoce nuestros servicios en ${env.site.name}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Servicios</h1>
        <p className="text-text-muted">
          Próximamente más información sobre nuestros servicios.
        </p>
      </div>
    </>
  )
}
