export function NewsletterSection() {
  return (
    <section className="relative w-full">
      {/* Imagen separadora de montañas */}
      <div className="absolute top-0 left-0 right-0 w-full z-20" style={{ transform: 'translateY(-95%)' }}>
        <img
          src="/images/web/separador-montanas.png"
          alt="Paisaje de montañas"
          className="w-full h-auto"
        />
        {/* Gradiente crema sutil en la parte inferior del separador para mezclarse */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(245, 243, 240, 0.6) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Contenedor con imagen del glaciar */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full">
        {/* Imagen de fondo - glaciar */}
        <img
          src="/images/web/glaciar-newsletter.jpg"
          alt="Glaciar en la Patagonia"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />

        {/* Nube blanca sutil arriba */}
        <div
          className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, white 0%, transparent 100%)'
          }}
        />

        {/* Gradiente hacia negro abajo para mezclarse con el footer */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 1) 100%)'
          }}
        />
      </div>
    </section>
  )
}
