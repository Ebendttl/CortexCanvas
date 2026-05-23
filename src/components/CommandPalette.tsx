"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
import { useRouter } from 'next/navigation'

interface CommandItem {
  title: string
  icon: React.ElementType
  shortcut: string
  href?: string
  action?: () => void
}

export function CommandPalette() {
  const { isOpen, close, toggle } = useCommandPalette(state => ({
    isOpen: state.isOpen,
    close: state.close,
    toggle: state.toggle,
  }))

  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items: CommandItem[] = [
    { title: 'New Document',    icon: Plus,         shortcut: 'N', href: '/documents' },
    { title: 'AI Assistant',   icon: BrainCircuit, shortcut: 'A', href: '/ai-workspace' },
    { title: 'Settings',       icon: Settings,     shortcut: ',', href: '/settings'  },
    { title: 'Search Documents', icon: Search,     shortcut: 'F', href: '/search' },
  ]

  const filteredItems = query.trim()
    ? items.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : items

  // Run an item's action or navigate to its href, then close
  const runItem = useCallback(
    (item: CommandItem) => {
      if (item.action) {
        item.action()
      } else if (item.href) {
        router.push(item.href)
      }
      close()
      setQuery('')
      setSelectedIndex(0)
    },
    [router, close]
  )

  // Global keyboard handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K → toggle
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
        return
      }

      if (!isOpen) {
        // If typing in an input, textarea, or contenteditable editor, ignore global hotkeys
        const activeEl = document.activeElement
        if (
          activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.hasAttribute('contenteditable') ||
            activeEl.closest('[contenteditable="true"]'))
        ) {
          return
        }

        // Do not intercept system shortcuts
        if (e.metaKey || e.ctrlKey || e.altKey) return

        const key = e.key.toLowerCase()
        if (key === 'n') {
          e.preventDefault()
          router.push('/documents')
        } else if (key === 'a') {
          e.preventDefault()
          router.push('/ai-workspace')
        } else if (e.key === ',') {
          e.preventDefault()
          router.push('/settings')
        } else if (key === 'f') {
          e.preventDefault()
          toggle()
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          close()
          setQuery('')
          setSelectedIndex(0)
          break

        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => (i + 1) % filteredItems.length)
          break

        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i =>
            i === 0 ? filteredItems.length - 1 : i - 1
          )
          break

        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            runItem(filteredItems[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, toggle, close, filteredItems, selectedIndex, runItem, router])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to let AnimatePresence mount the element
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              close()
              setQuery('')
              setSelectedIndex(0)
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Palette panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <GlassPanel glow className="bg-[#0f0f0f] border border-white/10 shadow-3xl overflow-hidden rounded-2xl">
              {/* Search input row */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  placeholder="Ask anything or search..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40 font-mono flex-shrink-0">
                  <CommandIcon className="w-3 h-3" /> K
                </div>
              </div>

              {/* Items list */}
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Quick Actions
                </div>

                {filteredItems.length === 0 ? (
                  <div className="px-3 py-6 text-center text-white/30 text-sm">
                    No results for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const isSelected = index === selectedIndex
                      return (
                        <button
                          id={`cmd-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                          key={item.title}
                          onClick={() => runItem(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-3 rounded-xl group transition-all',
                            isSelected
                              ? 'bg-[#00f7ff] text-black'
                              : 'hover:bg-[#00f7ff]/10'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'p-2 rounded-lg transition-colors',
                              isSelected ? 'bg-black/10' : 'bg-white/5 group-hover:bg-[#00f7ff]/10'
                            )}>
                              <item.icon className={cn(
                                'w-4 h-4 transition-colors',
                                isSelected ? 'text-black' : 'text-white/60 group-hover:text-[#00f7ff]'
                              )} />
                            </div>
                            <span className={cn(
                              'font-bold tracking-tight transition-colors',
                              isSelected ? 'text-black' : 'text-white group-hover:text-white'
                            )}>
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors',
                              isSelected
                                ? 'text-black/50 bg-black/10'
                                : 'text-white/20 bg-white/5 group-hover:text-[#00f7ff]/60'
                            )}>
                              {item.shortcut}
                            </span>
                            <ChevronRight className={cn(
                              'w-4 h-4 transition-colors',
                              isSelected ? 'text-black/30' : 'text-white/10 group-hover:text-white/30'
                            )} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer hint bar */}
              <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">↩</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">esc</kbd> Close
                  </span>
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
