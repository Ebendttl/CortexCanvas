"use client"

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  FileText, 
  BrainCircuit, 
  Settings, 
  Plus, 
  ChevronRight,
  Command as CommandIcon 
} from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

import { useCommandPalette } from '@/lib/store'

export function CommandPalette() {
  const { isOpen, setIsOpen, toggle } = useCommandPalette(state => ({
    isOpen: state.isOpen,
    setIsOpen: (open: boolean) => open ? state.open() : state.close(),
    toggle: state.toggle
  }))
  const [query, setQuery] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
// ... rest is same

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const items = [
    { title: 'New Document', icon: Plus, shortcut: 'N' },
    { title: 'AI Assistant', icon: BrainCircuit, shortcut: 'A' },
    { title: 'Settings', icon: Settings, shortcut: ',' },
    { title: 'Search Documents', icon: Search, shortcut: 'F' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <GlassPanel glow className="bg-[#0f0f0f] border border-white/10 shadow-3xl overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40" />
                <input 
                  autoFocus
                  placeholder="Ask anything or search..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40 font-mono">
                  <CommandIcon className="w-3 h-3" /> K
                </div>
              </div>

              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.title}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#00f7ff] group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-black/10 transition-colors">
                          <item.icon className="w-4 h-4 text-white/60 group-hover:text-black" />
                        </div>
                        <span className="font-bold text-white group-hover:text-black tracking-tight">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-mono text-white/20 group-hover:text-black/40 bg-white/5 group-hover:bg-black/5 px-1.5 py-0.5 rounded">
                            {item.shortcut}
                         </span>
                         <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-black/20" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-4 text-[10px] text-white/30">
                    <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">↩</kbd> Select</span>
                    <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">esc</kbd> Close</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00f7ff] font-black italic">Bioluminescent Search</span>
                 </div>
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
