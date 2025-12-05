import axios, { AxiosInstance } from 'axios'
import { env } from '../config/env'
import { CreateOrderData } from '../types/order'

// En desarrollo usamos el proxy de Vite para evitar CORS
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api/woo' : `${env.woo.url}/wp-json/wc/v3`

class WooCommerceAPI {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL,
      params: {
        consumer_key: env.woo.consumerKey,
        consumer_secret: env.woo.consumerSecret,
      },
    })
  }

  // Products
  async getProducts(params?: Record<string, unknown>) {
    const response = await this.api.get('/products', { params })
    return response.data
  }

  async getProduct(id: number) {
    const response = await this.api.get(`/products/${id}`)
    return response.data
  }

  async getProductBySlug(slug: string) {
    const response = await this.api.get('/products', { params: { slug } })
    return response.data[0]
  }

  // Product Variations
  async getProductVariations(productId: number) {
    const response = await this.api.get(`/products/${productId}/variations`, {
      params: { per_page: 100 }
    })
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
}

export const wooCommerceAPI = new WooCommerceAPI()
export default wooCommerceAPI
