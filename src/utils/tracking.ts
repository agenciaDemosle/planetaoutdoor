// Google Analytics 4
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track: (...args: unknown[]) => void
      page: () => void
    }
  }
}

// Google Analytics Events
export const trackGA4Event = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Facebook Pixel Events
export const trackFBEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// TikTok Pixel Events
export const trackTikTokEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, params)
  }
}

// Combined tracking function
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  trackGA4Event(eventName, params)
  trackFBEvent(eventName, params)
  trackTikTokEvent(eventName, params)
}

// Specific event helpers
export const trackAddToCart = (product: {
  id: number
  name: string
  price: number
  quantity: number
}) => {
  trackEvent('add_to_cart', {
    currency: 'CLP',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  })
}

export const trackRemoveFromCart = (product: {
  id: number
  name: string
  price: number
  quantity: number
}) => {
  trackEvent('remove_from_cart', {
    currency: 'CLP',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  })
}

export const trackBeginCheckout = (value: number, items: unknown[]) => {
  trackEvent('begin_checkout', {
    currency: 'CLP',
    value,
    items,
  })
}

export const trackPurchase = (orderId: string, value: number, items: unknown[]) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'CLP',
    value,
    items,
  })
}

export const trackViewItem = (product: {
  id: number
  name: string
  price: number
}) => {
  trackEvent('view_item', {
    currency: 'CLP',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      },
    ],
  })
}
