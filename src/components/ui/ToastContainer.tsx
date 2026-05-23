"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToastStore, Toast } from '@/lib/toastStore'

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore(state => state.removeToast)
  const duration = toast.duration || 4000

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, removeToast])

  // Icon mapping
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#1aff9c]" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#ffb000]" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Sparkles className="w-5 h-5 text-[#00f7ff] animate-pulse" />
    }
  }

  // Color mapping for bioluminescent styling
  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-[#1aff9c]/30 hover:border-[#1aff9c]/60',
          shadow: 'shadow-[0_0_20px_rgba(26,255,156,0.15)]',
          bar: 'bg-[#1aff9c]',
          lightAccent: 'bg-[#1aff9c]/10',
        }
      case 'warning':
        return {
          border: 'border-[#ffb000]/30 hover:border-[#ffb000]/60',
          shadow: 'shadow-[0_0_20px_rgba(255,176,0,0.15)]',
          bar: 'bg-[#ffb000]',
          lightAccent: 'bg-[#ffb000]/10',
        }
      case 'error':
        return {
          border: 'border-red-500/30 hover:border-red-500/60',
          shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          bar: 'bg-red-500',
          lightAccent: 'bg-red-500/10',
        }
      default: // info
        return {
          border: 'border-[#00f7ff]/30 hover:border-[#00f7ff]/60',
          shadow: 'shadow-[0_0_25px_rgba(0,247,255,0.2)]',
          bar: 'bg-[#00f7ff]',
          lightAccent: 'bg-[#00f7ff]/10',
        }
    }
  }

  const colors = getColors()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative w-80 bg-[#0a0a0a]/90 backdrop-blur-md border-2 border-black rounded-2xl p-4 flex gap-4 items-start ${colors.border} ${colors.shadow} shadow-neobrutalist transition-all duration-300 overflow-hidden pointer-events-auto`}
    >
      {/* Bioluminescent side glow bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar}`} />

      {/* Content wrapper */}
      <div className="flex-1 flex gap-3 min-w-0 pt-0.5">
        <div className={`p-1.5 rounded-xl ${colors.lightAccent} flex-shrink-0 flex items-center justify-center`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          {toast.title && (
            <h4 className="text-xs font-black tracking-widest text-white uppercase leading-none">
              {toast.title}
            </h4>
          )}
          <p className="text-[11px] text-white/70 font-semibold leading-relaxed">
            {toast.message}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => removeToast(toast.id)}
        className="text-white/20 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-all flex-shrink-0"
      >
        <X className="w-4.5 h-4.5" />
      </button>

      {/* Shrinking Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${colors.bar}`}
        />
      </div>
    </motion.div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore(state => state.toasts)

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-[calc(100vw-3rem)] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
