"use client"

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { cn } from '@/lib/utils'

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <GlassPanel glow className="w-72 bg-[#111] border border-white/10 p-2 overflow-hidden shadow-2xl">
      <div className="flex flex-col gap-1 max-h-80 overflow-y-auto custom-scrollbar">
        {props.items.length ? (
          props.items.map((item: any, index: number) => (
            <button
              key={index}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all",
                index === selectedIndex ? "bg-[#00f7ff] text-black" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
              onClick={() => selectItem(index)}
            >
              <div className={cn(
                  "p-2 rounded-md",
                  index === selectedIndex ? "bg-black/10" : "bg-white/5"
              )}>
                 <item.icon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black">{item.title}</span>
                <span className={cn(
                    "text-[10px] truncate max-w-[180px]",
                    index === selectedIndex ? "text-black/60" : "text-white/40"
                )}>{item.description}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-white/40">No results found</div>
        )}
      </div>
    </GlassPanel>
  )
})

CommandList.displayName = 'CommandList'
