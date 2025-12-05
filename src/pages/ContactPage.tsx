import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react'
import { env } from '../config/env'

export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [sendMethod, setSendMethod] = useState<'whatsapp' | 'email'>('whatsapp')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (sendMethod === 'whatsapp') {
      const message = `Hola! Mi nombre es ${formData.nombre}.%0A%0AEmail: ${formData.email}%0ATeléfono: ${formData.telefono}%0A%0AMensaje: ${formData.mensaje}`
      const whatsappUrl = `https://wa.me/56962183634?text=${message}`
      window.open(whatsappUrl, '_blank')
    } else {
      const subject = `Contacto desde web - ${formData.nombre}`
      const body = `Nombre: ${formData.nombre}%0AEmail: ${formData.email}%0ATeléfono: ${formData.telefono}%0A%0AMensaje:%0A${formData.mensaje}`
      const mailtoUrl = `mailto:${env.contact.email}?subject=${subject}&body=${body}`
      window.location.href = mailtoUrl
    }
  }

  return (
    <>
      <Helmet>
        <title>Contacto | {env.site.name}</title>
        <meta name="description" content={`Contáctanos en ${env.site.name}`} />
      </Helmet>

      {/* Hero - Estilo Wild Lama */}
      <div className="bg-white pt-8 pb-12 md:pt-12 md:pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400 mb-4">Inicio / Contacto</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight">
            Contacto
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info - Estilo Wild Lama */}
          <div>
            <h2 className="text-xl font-semibold mb-8 text-black">Información de contacto</h2>
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${env.contact.email}`} className="text-black hover:text-[#f46d47] transition-colors">
                    {env.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Teléfono / WhatsApp</p>
                  <a href="https://wa.me/56962183634" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#f46d47] transition-colors">
                    +56 9 6218 3634
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="text-black">Temuco, Chile</p>
                </div>
              </li>
            </ul>

            {/* Horario */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-4">Horario de atención</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Lunes a Viernes</span>
                  <span className="text-black">10:00 - 19:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Sábado</span>
                  <span className="text-black">10:00 - 14:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Domingo</span>
                  <span className="text-black">Cerrado</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form - Estilo Wild Lama */}
          <div>
            <h2 className="text-xl font-semibold mb-8 text-black">Envíanos un mensaje</h2>

            {/* Send Method Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => setSendMethod('whatsapp')}
                className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-all ${
                  sendMethod === 'whatsapp'
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-black'
                }`}
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setSendMethod('email')}
                className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-all ${
                  sendMethod === 'email'
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-black'
                }`}
              >
                <Mail size={16} />
                Correo
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-black transition-colors bg-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-black transition-colors bg-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-black transition-colors bg-transparent"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-black transition-colors bg-transparent resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#f46d47] border-b-2 border-[#f46d47] pb-1 hover:text-black hover:border-black transition-colors mt-4"
              >
                {sendMethod === 'whatsapp' ? (
                  <>
                    <MessageCircle size={16} />
                    Enviar por WhatsApp
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Enviar por Correo
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
