import { create } from 'zustand'

export interface Toast {
  id: string
  title?: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  toast: (options: Omit<Toast, 'id' | 'type'> & { type?: Toast['type'] }) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  toast: (options) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      type: 'info',
      duration: 4000,
      ...options,
    }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
