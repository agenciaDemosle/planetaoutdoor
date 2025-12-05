import { create } from 'zustand'

interface UIState {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  isChatbotOpen: boolean
  openChatbot: () => void
  closeChatbot: () => void
  toggleChatbot: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  isChatbotOpen: false,
  openChatbot: () => set({ isChatbotOpen: true }),
  closeChatbot: () => set({ isChatbotOpen: false }),
  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
}))
