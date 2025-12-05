import { useState } from 'react'
import { wooCommerceAPI } from '../api/woocommerce'
import { CreateOrderData, Order } from '../types/order'
import { useCartStore } from '../store/useCartStore'

interface UseCheckoutReturn {
  isLoading: boolean
  error: string | null
  order: Order | null
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>
}

export function useCheckout(): UseCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const clearCart = useCartStore((state) => state.clearCart)

  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const createdOrder = await wooCommerceAPI.createOrder(orderData)
      setOrder(createdOrder)
      clearCart()
      return createdOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la orden'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    order,
    createOrder,
  }
}
