import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  displayName: string
  avatar?: string
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  country: string
  phone?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  billingAddress: Address | null
  shippingAddress: Address | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setBillingAddress: (address: Address | null) => void
  setShippingAddress: (address: Address | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      billingAddress: null,
      shippingAddress: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setBillingAddress: (address) => set({ billingAddress: address }),
      setShippingAddress: (address) => set({ shippingAddress: address }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        billingAddress: null,
        shippingAddress: null
      }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
