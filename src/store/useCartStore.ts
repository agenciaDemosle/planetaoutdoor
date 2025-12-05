import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  imageUrl: string
  quantity: number
  options?: Record<string, string>
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (id: number, quantity: number, options?: Record<string, string>) => void
  removeItem: (id: number, options?: Record<string, string>) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

// Helper to create a unique key for cart items with options
const getItemKey = (id: number, options?: Record<string, string>): string => {
  if (!options || Object.keys(options).length === 0) {
    return `${id}`
  }
  return `${id}-${Object.entries(options).sort().map(([k, v]) => `${k}:${v}`).join('-')}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get()
        const itemKey = getItemKey(newItem.id, newItem.options)

        const existingIndex = items.findIndex(item =>
          getItemKey(item.id, item.options) === itemKey
        )

        if (existingIndex >= 0) {
          // Update quantity of existing item
          const updatedItems = [...items]
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + (newItem.quantity || 1)
          }
          set({ items: updatedItems })
        } else {
          // Add new item
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity || 1 }]
          })
        }
      },

      updateQuantity: (id, quantity, options) => {
        if (quantity <= 0) {
          get().removeItem(id, options)
          return
        }

        const itemKey = getItemKey(id, options)
        set((state) => ({
          items: state.items.map((item) =>
            getItemKey(item.id, item.options) === itemKey
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      removeItem: (id, options) => {
        const itemKey = getItemKey(id, options)
        set((state) => ({
          items: state.items.filter((item) =>
            getItemKey(item.id, item.options) !== itemKey
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'planetaoutdoor-cart',
    }
  )
)
