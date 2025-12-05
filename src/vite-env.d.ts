/// <reference types="vite/client" />

// Swiper CSS module declarations
declare module 'swiper/css' {
  const content: string;
  export default content;
}

declare module 'swiper/css/navigation' {
  const content: string;
  export default content;
}

declare module 'swiper/css/pagination' {
  const content: string;
  export default content;
}

declare module 'swiper/css/autoplay' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_WOO_URL: string
  readonly VITE_WOO_CONSUMER_KEY: string
  readonly VITE_WOO_CONSUMER_SECRET: string
  readonly VITE_SITE_NAME: string
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_DESCRIPTION: string
  readonly VITE_INSTALLATION_EXTRA_PERCENT: string
  readonly VITE_CONTACT_PHONE: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_WHATSAPP: string
  readonly VITE_SOCIAL_INSTAGRAM: string
  readonly VITE_SOCIAL_FACEBOOK: string
  readonly VITE_SOCIAL_TIKTOK: string
  readonly VITE_SOCIAL_YOUTUBE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
