"use client"

import { BubbleMenu, Editor } from '@tiptap/react'
import { 
  Sparkles, 
  Type, 
  AlignLeft, 
  HelpCircle, 
  RotateCcw,
  Check
} from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AIBubbleMenuProps {
  editor: Editor;
  onAction: (action: string) => void;
}

export function AIBubbleMenu({ editor, onAction }: AIBubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAction = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, from, to }) => {
        // Only show when there is a selection
        return from !== to
      }}
    >
      <GlassPanel glow className="flex items-center gap-1 p-1 bg-[#111] border border-white/10 shadow-2xl rounded-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all font-bold text-sm",
            isOpen ? "bg-[#00f7ff] text-black" : "text-[#00f7ff] hover:bg-[#00f7ff]/10"
          )}
        >
          <Sparkles size={16} />
          AI Assist
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        <button 
          onClick={() => handleAction('improve')}
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          title="Improve writing"
        >
          <Type size={16} />
        </button>
        <button 
          onClick={() => handleAction('summarize')}
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          title="Summarize"
        >
          <AlignLeft size={16} />
        </button>
        <button 
          onClick={() => handleAction('explain')}
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          title="Explain"
        >
          <HelpCircle size={16} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-[#111] border border-white/10 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
             {[
               { id: 'summarize', label: 'Summarize', icon: AlignLeft },
               { id: 'improve', label: 'Improve writing', icon: Type },
               { id: 'explain', label: 'Explain this', icon: HelpCircle },
               { id: 'fix-grammar', label: 'Fix grammar', icon: Check },
               { id: 'rewrite', label: 'Rewrite', icon: RotateCcw },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => handleAction(item.id)}
                 className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white/70 hover:bg-[#00f7ff] hover:text-black transition-colors text-left"
               >
                 <item.icon size={14} />
                 {item.label}
               </button>
             ))}
          </div>
        )}
      </GlassPanel>
    </BubbleMenu>
  )
}
