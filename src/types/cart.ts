export type CartItemType = 'solo_equipo' | 'equipo_mas_instalacion'

export interface CartItem {
  id: string
  productId: number
  name: string
  slug: string
  imageUrl: string
  quantity: number
  basePrice: number
  installationPrice?: number
  type: CartItemType
  lineBaseTotal: number
  lineInstallationTotal: number
  lineGrandTotal: number
}

export interface CartStore {
  items: CartItem[]
  currency: string
  subtotalEquipos: number
  subtotalInstalacion: number
  grandTotal: number
  addItem: (item: Omit<CartItem, 'id' | 'lineBaseTotal' | 'lineInstallationTotal' | 'lineGrandTotal'>) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleType: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  recalcTotals: () => void
}

export function calculateCartTotals(items: CartItem[]): {
  subtotalEquipos: number
  subtotalInstalacion: number
  grandTotal: number
} {
  let subtotalEquipos = 0
  let subtotalInstalacion = 0

  for (const item of items) {
    subtotalEquipos += item.lineBaseTotal
    subtotalInstalacion += item.lineInstallationTotal
  }

  return {
    subtotalEquipos,
    subtotalInstalacion,
    grandTotal: subtotalEquipos + subtotalInstalacion,
  }
}
