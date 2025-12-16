export const env = {
  woo: {
    url: import.meta.env.VITE_WOO_URL || '',
    consumerKey: import.meta.env.VITE_WOO_CONSUMER_KEY || '',
    consumerSecret: import.meta.env.VITE_WOO_CONSUMER_SECRET || '',
  },
  mercadoPago: {
    accessToken: import.meta.env.VITE_MP_ACCESS_TOKEN || '',
    publicKey: import.meta.env.VITE_MP_PUBLIC_KEY || '',
  },
  site: {
    name: import.meta.env.VITE_SITE_NAME || 'Planeta Outdoor',
    url: import.meta.env.VITE_SITE_URL || '',
    description: import.meta.env.VITE_SITE_DESCRIPTION || '',
  },
  installation: {
    extraPercent: parseFloat(import.meta.env.VITE_INSTALLATION_EXTRA_PERCENT || '0.25'),
  },
  contact: {
    phone: import.meta.env.VITE_CONTACT_PHONE || '',
    email: import.meta.env.VITE_CONTACT_EMAIL || '',
    whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '',
  },
  social: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '',
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || '',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK || '',
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE || '',
  },
}
