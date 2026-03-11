"use client"

import { NeobrutalistButton } from "@/components/ui/NeobrutalistButton";
import { BlockEditor } from "@/features/editor/BlockEditor";
import { ChevronLeft, MoreHorizontal, Sparkles } from "lucide-react";
import { AIAssistantPanel } from "@/features/ai-assistant/AIAssistantPanel";
import { useState, use } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      {/* Editor Header */}
      <header className="h-14 border-b-2 border-black flex items-center justify-between px-6 bg-[#0a0a0a] z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-white/50" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white hover:bg-white/5 px-2 py-0.5 rounded cursor-pointer transition-colors">
              Strategic Planning 2026
            </h1>
            <span className="text-[10px] text-white/30 px-2">Edited 4m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NeobrutalistButton 
            variant={isAssistantOpen ? "primary" : "outline"}
            size="sm" 
            className="flex items-center gap-2 h-9 px-3"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          >
            <Sparkles className={cn("w-4 h-4", isAssistantOpen ? "text-black" : "text-[#00f7ff]")} />
            AI Assist
          </NeobrutalistButton>
          <NeobrutalistButton variant="primary" size="sm" className="h-9 px-4">
            Share
          </NeobrutalistButton>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors border-2 border-black shadow-neobrutalist bg-white/5">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area with Sidebar for AI */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
             {/* Cover / Icon placeholder */}
             <div className="group relative w-full h-48 rounded-2xl bg-gradient-to-r from-black via-[#00f7ff]/20 to-black border-2 border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="absolute bottom-6 left-10 flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#0a0a0a] border-4 border-black shadow-neobrutalist rounded-2xl flex items-center justify-center text-4xl">
                     📁
                  </div>
                </div>
             </div>

             <div className="px-4">
                <BlockEditor 
                  documentId={id} 
                  user={{
                    name: "Visitor" + Math.floor(Math.random() * 100),
                    color: "#" + Math.floor(Math.random()*16777215).toString(16)
                  }}
                />
             </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {isAssistantOpen && (
          <aside className="w-96 flex-shrink-0 animate-in slide-in-from-right duration-300">
            <AIAssistantPanel 
              documentId={id} 
              onClose={() => setIsAssistantOpen(false)} 
            />
          </aside>
        )}
      </div>
    </div>
  );
}
