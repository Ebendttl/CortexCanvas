"use client"

import { useState, useEffect } from "react";
import { 
  X, Maximize2, Minimize2, Download, Trash2, 
  Brain, Send, Sparkles, MessageSquare, Info, 
  History, Settings, Share2, ChevronLeft, ChevronRight,
  FileText, ShieldCheck, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";


interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    summary?: string;
    keyInsights?: string[];
    url?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document: doc, isOpen, onClose }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "chat" | "insights">("preview");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  // PDF Rendering States
  const [PDFComponents, setPDFComponents] = useState<{
    Document: any;
    Page: any;
  } | null>(null);

  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([
    { role: "ai", text: `I've finished analyzing **${doc.name}**. How can I help you extract value from this intelligence?` }
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(true);
      
      // Attempt 3: Dynamic Evaluation Bypass
      // Load PDF components only on client-side after mount to avoid Webpack-eval evaluation crash
      const initPDF = async () => {
        try {
          const { Document: PDFDoc, Page: PDFPage, pdfjs } = await import('react-pdf');
          
          // Configure worker
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
          
          setPDFComponents({ Document: PDFDoc, Page: PDFPage });
        } catch (error) {
          console.error("Neural Link Failure: PDF engine could not be initialized.", error);
        }
      };
      
      initPDF();
    }
  }, [isOpen]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Based on the document context, I've identified that the strategic roadmap outlined in section 3 aligns with your objective. Would you like me to synthesize the implementation steps?" 
      }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Viewer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-l-2 border-black h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <header className="h-16 border-b-2 border-black flex items-center justify-between px-6 bg-[#0a0a0a]">
              <div className="flex items-center gap-4 max-w-md">
                <div className="w-10 h-10 bg-[#00f7ff]/10 rounded-xl flex items-center justify-center border border-[#00f7ff]/20">
                  <FileText className="w-5 h-5 text-[#00f7ff]" />
                </div>
                <div className="flex flex-col truncate">
                  <h2 className="text-sm font-black text-white truncate">{doc.name}</h2>
                  <span className="text-[10px] text-white/30 truncate uppercase tracking-widest font-black">{doc.type} • {doc.size}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="w-[2px] h-6 bg-white/10 mx-2" />
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-white/40 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Content Area (Left) */}
              <div className="flex-1 flex flex-col bg-black/40">
                {/* Tabs */}
                <div className="flex items-center gap-6 px-10 border-b-2 border-black bg-[#0a0a0a]/50">
                  {[
                    { id: "preview", label: "Intelligence Preview", icon: Sparkles },
                    { id: "insights", label: "Semantic Insights", icon: Brain },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                        activeTab === tab.id ? "text-[#00f7ff]" : "text-white/40 hover:text-white/60"
                      )}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#00f7ff] shadow-[0_0_10px_#00f7ff]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar flex justify-center">
                   {activeTab === "preview" ? (
                     <div className="w-full max-w-4xl bg-white/5 rounded-3xl border-2 border-white/5 min-h-full p-8 shadow-inner overflow-hidden relative flex flex-col items-center">
                        {!isLoaded ? (
                          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                             <div className="w-20 h-20 bg-[#00f7ff]/10 rounded-3xl flex items-center justify-center animate-pulse">
                                <Zap className="w-10 h-10 text-[#00f7ff]" />
                             </div>
                             <h3 className="text-xl font-black text-white">Advanced Content Engine</h3>
                             <p className="text-white/40 max-w-sm text-sm">Visualizing document streams and extracting core knowledge clusters...</p>
                          </div>
                        ) : doc.url ? (
                          <>
                            <div className="flex-1 w-full flex justify-center overflow-auto custom-scrollbar bg-black/20 rounded-2xl border border-white/5 shadow-2xl">
                                {PDFComponents ? (
                                  <PDFComponents.Document
                                    file={doc.url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                      <div className="flex items-center justify-center p-20">
                                         <Brain className="w-12 h-12 text-[#00f7ff] animate-pulse" />
                                      </div>
                                    }
                                  >
                                    <PDFComponents.Page 
                                      pageNumber={pageNumber} 
                                      width={800}
                                      renderTextLayer={false}
                                      renderAnnotationLayer={false}
                                      className="shadow-2xl"
                                    />
                                  </PDFComponents.Document>
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                     <Zap className="w-12 h-12 text-[#00f7ff] animate-spin" />
                                     <p className="text-[10px] font-black uppercase tracking-widest text-[#00f7ff]/60">Connecting Neural Stream...</p>
                                  </div>
                                )}
                            </div>
                            
                            {/* Pagination Controls */}
                            <div className="mt-6 flex items-center gap-6 bg-black/40 px-6 py-2 rounded-2xl border-2 border-black">
                              <button 
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                className="p-2 hover:bg-[#00f7ff]/20 rounded-lg text-white/40 hover:text-[#00f7ff] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 min-w-20 text-center">
                                Unit {pageNumber} <span className="text-white/20 mx-1">/</span> {numPages || '--'}
                              </span>
                              <button 
                                disabled={pageNumber >= (numPages || 1)}
                                onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
                                className="p-2 hover:bg-[#00f7ff]/20 rounded-lg text-white/40 hover:text-[#00f7ff] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                             <div className="w-20 h-20 bg-[#00f7ff]/10 rounded-3xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-[#00f7ff]" />
                             </div>
                             <h3 className="text-xl font-black text-white">Visual Preview Ready</h3>
                             <p className="text-white/40 max-w-sm text-sm">This document is ready for visualization. Upgrade to the high-bandwidth neural link to enable real-time rendering.</p>
                          </div>
                        )}
                     </div>
                   ) : (
                     <div className="w-full max-w-4xl space-y-8 pb-20">
                        <section className="space-y-4">
                           <div className="flex items-center gap-3">
                              <h2 className="text-xl font-black text-white">Executive Summary</h2>
                              <div className="px-3 py-1 bg-[#00f7ff]/10 rounded-full text-[10px] font-black text-[#00f7ff] border border-[#00f7ff]/20">AI GENERATED</div>
                           </div>
                           <GlassPanel className="p-8 leading-relaxed text-white/70 font-medium border-2 border-black shadow-neobrutalist">
                              {doc.summary || "Summary generation in progress..."}
                           </GlassPanel>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest text-[#00f7ff]">Key Intelligence</h3>
                              <div className="space-y-3">
                                 {doc.keyInsights?.map((insight: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/5 border-2 border-black rounded-2xl hover:border-[#00f7ff]/30 transition-all">
                                       <div className="w-6 h-6 bg-[#00f7ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <ShieldCheck className="w-3.5 h-3.5 text-[#00f7ff]" />
                                       </div>
                                       <p className="text-xs font-bold text-white/60">{insight}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest text-[#00f7ff]">Metadata Attributes</h3>
                              <div className="bg-black/40 border-2 border-black rounded-3xl p-6 space-y-4">
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/20 font-bold uppercase tracking-widest">Confidence Score</span>
                                    <span className="text-[#00f7ff] font-black font-mono">98.4%</span>
                                 </div>
                                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00f7ff] w-[98.4%]" />
                                 </div>
                                 <div className="pt-4 space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                       <span>Sentiment</span>
                                       <span className="text-green-500">Strongly Positive</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                       <span>Entities Found</span>
                                       <span className="text-white/80">14 Key Terms</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </section>
                     </div>
                   )}
                </div>
              </div>

              {/* Chat Sidebar (Right) */}
              <aside className="w-96 border-l-2 border-black flex flex-col bg-[#0a0a0a]">
                <div className="p-6 border-b-2 border-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#00f7ff]" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Knowledge Assistant</h3>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#00f7ff]" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.map((m, i) => (
                    <div key={i} className={cn(
                      "flex flex-col space-y-2",
                      m.role === "ai" ? "items-start" : "items-end"
                    )}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed transition-all shadow-neobrutalist",
                        m.role === "ai" 
                          ? "bg-white/5 text-white/80 border-2 border-black rounded-tl-none font-medium" 
                          : "bg-[#00f7ff] text-black font-black rounded-tr-none"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t-2 border-black">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Query document intelligence..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="w-full bg-white/5 border-2 border-black rounded-2xl py-3 pl-4 pr-12 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f7ff]/50 transition-all shadow-neobrutalist"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00f7ff] text-black rounded-xl hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-4 text-[9px] text-white/20 text-center font-black uppercase tracking-widest">
                    AI can make mistakes. Verify critical records.
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
