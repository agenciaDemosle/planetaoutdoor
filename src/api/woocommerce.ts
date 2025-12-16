import axios, { AxiosInstance } from 'axios'
import { env } from '../config/env'
import { CreateOrderData } from '../types/order'

// En desarrollo usamos el proxy de Vite para evitar CORS
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api/woo' : `${env.woo.url}/wp-json/wc/v3`

// Cache mejorado para productos, variaciones y productos individuales
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutos para productos
const CACHE_DURATION_SINGLE = 15 * 60 * 1000 // 15 minutos para producto individual

function getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
  return `${endpoint}:${JSON.stringify(params || {})}`
}

function getFromCache(key: string, duration: number = CACHE_DURATION): unknown | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

class WooCommerceAPI {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL,
      timeout: 15000, // 15 segundos timeout
      params: {
        consumer_key: env.woo.consumerKey,
        consumer_secret: env.woo.consumerSecret,
      },
    })
  }

  // Products - con caché
  async getProducts(params?: Record<string, unknown>) {
    const cacheKey = getCacheKey('/products', params)
    const cached = getFromCache(cacheKey)

    if (cached) {
      return cached
    }

    const response = await this.api.get('/products', { params })
    setCache(cacheKey, response.data)
    return response.data
  }

  async getProduct(id: number) {
    const cacheKey = `/products/${id}`
    const cached = getFromCache(cacheKey, CACHE_DURATION_SINGLE)

    if (cached) {
      return cached
    }

    const response = await this.api.get(`/products/${id}`)
    setCache(cacheKey, response.data)
    return response.data
  }

  async getProductBySlug(slug: string) {
    const cacheKey = `/products/slug/${slug}`
    const cached = getFromCache(cacheKey, CACHE_DURATION_SINGLE)

    if (cached) {
      return cached
    }

    const response = await this.api.get('/products', { params: { slug } })
    const product = response.data[0]
    if (product) {
      setCache(cacheKey, product)
    }
    return product
  }

  // Product Variations - con caché
  async getProductVariations(productId: number) {
    const cacheKey = `/products/${productId}/variations`
    const cached = getFromCache(cacheKey, CACHE_DURATION_SINGLE)

    if (cached) {
      return cached
    }

    const response = await this.api.get(`/products/${productId}/variations`, {
      params: { per_page: 100 }
    })
    setCache(cacheKey, response.data)
    return response.data
  }

  // Categories
  async getCategories(params?: Record<string, unknown>) {
    const response = await this.api.get('/products/categories', { params })
    return response.data
  }

  async getCategory(id: number) {
    const response = await this.api.get(`/products/categories/${id}`)
    return response.data
  }

  // Orders
  async createOrder(orderData: CreateOrderData) {
    const response = await this.api.post('/orders', orderData)
    return response.data
  }

  async getOrder(id: number) {
    const response = await this.api.get(`/orders/${id}`)
    return response.data
  }

  async updateOrder(id: number, data: Record<string, unknown>) {
    const response = await this.api.put(`/orders/${id}`, data)
    return response.data
  }

  async getOrders(params?: Record<string, unknown>) {
    const response = await this.api.get('/orders', { params })
    return response.data
  }

  // Customers
  async createCustomer(customerData: Record<string, unknown>) {
    const response = await this.api.post('/customers', customerData)
    return response.data
  }

  async getCustomer(id: number) {
    const response = await this.api.get(`/customers/${id}`)
    return response.data
  }

  // Payment Gateways
  async getPaymentGateways() {
    const response = await this.api.get('/payment_gateways')
    return response.data
  }

  // Shipping Zones
  async getShippingZones() {
    const response = await this.api.get('/shipping/zones')
    return response.data
  }

  // Shipping Methods for a zone
  async getShippingMethods(zoneId: number) {
    const response = await this.api.get(`/shipping/zones/${zoneId}/methods`)
    return response.data
  }

  // Product Attributes - con caché
  async getAttributes() {
    const cacheKey = '/products/attributes'
    const cached = getFromCache(cacheKey, CACHE_DURATION)

    if (cached) {
      return cached
    }

    const response = await this.api.get('/products/attributes')
    setCache(cacheKey, response.data)
    return response.data
  }

  async getAttributeTerms(attributeId: number) {
    const cacheKey = `/products/attributes/${attributeId}/terms`
    const cached = getFromCache(cacheKey, CACHE_DURATION)

    if (cached) {
      return cached
    }

    const response = await this.api.get(`/products/attributes/${attributeId}/terms`, {
      params: { per_page: 100 }
    })
    setCache(cacheKey, response.data)
    return response.data
  }
}

export const wooCommerceAPI = new WooCommerceAPI()
export default wooCommerceAPI
