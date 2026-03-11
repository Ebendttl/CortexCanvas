"use client"

import { useCompletion } from "@ai-sdk/react"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { NeobrutalistButton } from "@/components/ui/NeobrutalistButton"
import { Sparkles, X, MessageSquare, Brain } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AIAssistantPanelProps {
  documentId: string;
  onClose: () => void;
}

export function AIAssistantPanel({ documentId, onClose }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [input, setInput] = useState('')

  const { complete, isLoading } = useCompletion({
    api: "/api/ai/rag",
    onFinish: (prompt, completion) => {
        setMessages(prev => [...prev, { role: 'assistant', content: completion }])
    }
  })

  const handleSend = async () => {
    if (!input) return
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    
    await complete(userMessage, { body: { documentId } })
  }

  return (
    <GlassPanel glow className="flex flex-col h-full bg-[#0a0a0a] border-l-2 border-black">
      <div className="p-4 border-b-2 border-black flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
           <Brain className="w-5 h-5 text-[#00f7ff]" />
           <h3 className="text-sm font-black text-white">Knowledge Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 opacity-50">
             <div className="p-4 bg-white/5 rounded-full">
                <Sparkles className="w-8 h-8 text-[#00f7ff]" />
             </div>
             <div>
                <p className="text-sm font-bold text-white">Ask anything about this document</p>
                <p className="text-xs text-white/40 mt-1 italic">"What are the main goals of Project Alpha?"</p>
             </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={cn(
             "max-w-[85%] p-3 rounded-xl",
             m.role === 'user' ? "ml-auto bg-[#00f7ff] text-black font-medium" : "bg-white/5 text-white/90 border border-white/10"
          )}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="bg-white/5 text-white/90 border border-white/10 max-w-[85%] p-3 rounded-xl animate-pulse">
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#00f7ff] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#00f7ff] rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-[#00f7ff] rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-black bg-[#0a0a0a]">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask your notes..."
            className="w-full bg-white/5 border-2 border-black rounded-lg p-3 pr-12 text-sm text-white focus:outline-none focus:border-[#00f7ff] transition-all resize-none shadow-inner custom-scrollbar h-20"
          />
          <button 
            onClick={handleSend}
            disabled={!input || isLoading}
            className="absolute right-3 bottom-3 p-1.5 bg-[#00f7ff] text-black rounded-md hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
