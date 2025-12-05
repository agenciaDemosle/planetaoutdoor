const promoMessages = [
  'PREFIERE EQUIPO DE CALIDAD Y DURADERO',
  'ASESORÍA EXPERTA EN PESCA CON MOSCA',
  'GARANTÍA EN TODOS NUESTROS PRODUCTOS',
]

export function TopBar() {
  const marqueeText = promoMessages.join('        •        ')

  return (
    <div className="bg-[#FE6A00] h-10 overflow-hidden">
      <div className="h-full max-w-[1800px] mx-auto px-4 flex items-center justify-center">
        {/* Marquee de mensajes */}
        <div className="overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            <span className="text-xs text-white font-medium tracking-wider">
              {marqueeText}        •        {marqueeText}        •        {marqueeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
