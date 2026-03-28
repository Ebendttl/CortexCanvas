"use client"

import { useRef, useState, useEffect } from "react";
import { 
  FileText, Plus, Clock, MoreVertical, Search, Trash2, 
  Tag as TagIcon, LayoutGrid, List, Filter, Sparkles,
  ChevronRight, Brain, Shield, Info, ArrowUpRight,
  Database, Clock3, HardDrive, Share2, FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { uploadDocument, getDocuments, handleDelete as deleteDocumentAction } from "./actions";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const DocumentViewer = dynamic(() => import("@/components/DocumentViewer").then(mod => mod.DocumentViewer), {
  ssr: false,
});

type ProcessingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Document {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: ProcessingStatus;
  summary?: string;
  keyInsights?: string[];
  tags?: string[];
  category?: string;
  url?: string;
}

const CATEGORIES = ["All", "Legal", "Engineering", "Product", "Research"];
const TAGS = ["AI", "Blockchain", "Strategy", "Contract", "Draft"];

export default function DocumentsPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments();
        // Map Prisma types to our UI Document interface
        const mapped = (data as any[]).map(d => ({
          id: d.id,
          name: d.title,
          size: d.fileSize ? (d.fileSize / 1024).toFixed(1) + " KB" : "Unknown",
          type: d.fileType || "File",
          uploadedAt: new Date(d.createdAt).toLocaleDateString(),
          status: d.status as ProcessingStatus,
          summary: d.summary || undefined,
          keyInsights: typeof d.keyInsights === 'string' ? JSON.parse(d.keyInsights) : d.keyInsights,
          tags: d.tags?.map((t: any) => t.name) || [],
          category: d.category || "General",
          url: d.fileUrl || undefined
        }));
        setDocuments(mapped);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocuments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuId && !(event.target as Element).closest('.document-menu-container')) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  const handleUploadClick = () => {
    console.log("🚀 UPLOAD_TRACE: handleUploadClick executed");
    fileInputRef.current?.click();
  };

  const handleDelete = async (id: string) => {
    const originalDocs = [...documents];
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setActiveMenuId(null);
    try {
      await deleteDocumentAction(id);
    } catch (error) {
      console.error("Failed to delete document:", error);
      setDocuments(originalDocs);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    console.log("🚀 UPLOAD_TRACE: Starting pipeline for", file.name);
    
    // Always show optimistic record even if session is loading, 
    // the server action will handle auth verification.
    const tempId = Math.random().toString(36).substring(2, 9);
    const newDoc: Document = {
      id: tempId,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.name.split('.').pop()?.toUpperCase() || "FILE",
      uploadedAt: "Just now",
      status: "PROCESSING",
      summary: "Initializing context extraction...",
      tags: ["Syncing"],
      category: "Pending"
    };

    console.log("🚀 UPLOAD_TRACE: Triggering optimistic UI update", tempId);
    setDocuments(prev => [newDoc, ...prev]);

    try {
      if (!session) {
         console.warn("🚀 UPLOAD_TRACE: Session not found on client. Trying server-side auth...");
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log("🚀 UPLOAD_TRACE: Calling server action 'uploadDocument'...");
      const result = await uploadDocument(formData) as any;
      console.log("🚀 UPLOAD_TRACE: Server response received", result.id);

      setDocuments(prev => prev.map(d => d.id === tempId ? {
        ...d,
        id: result.id,
        status: result.status as ProcessingStatus,
        summary: result.summary || undefined,
        keyInsights: typeof result.keyInsights === 'string' ? JSON.parse(result.keyInsights) : result.keyInsights,
        uploadedAt: new Date(result.createdAt).toLocaleDateString(),
        category: result.category || "General"
      } : d));
      
      console.log("🚀 UPLOAD_TRACE: Pipeline complete for", result.id);
    } catch (error: any) {
      console.error("🚀 UPLOAD_TRACE: Pipeline crashed", error.message || error);
      setDocuments(prev => prev.filter(d => d.id !== tempId));
      alert(`Synthesis failed: ${error.message || "Network error in intelligence pipeline"}`);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      await handleFileUpload(file);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="flex gap-8 h-[calc(100vh-120px)] relative"
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[60] bg-[#00f7ff]/10 backdrop-blur-[2px] border-4 border-dashed border-[#00f7ff] rounded-3xl flex items-center justify-center pointer-events-none animate-pulse">
          <div className="bg-black border-2 border-[#00f7ff] p-8 rounded-3xl shadow-neobrutalist flex flex-col items-center gap-4">
            <Brain className="w-12 h-12 text-[#00f7ff]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Initiate Knowledge Extraction</h2>
            <p className="text-white/60 font-medium">Drop document into the synthesis engine</p>
          </div>
        </div>
      )}
      <aside className="w-64 flex-shrink-0 flex flex-col space-y-8 animate-in slide-in-from-left duration-500">
        <div className="space-y-4">
          <h2 className="text-[10px] uppercase font-black tracking-widest text-[#00f7ff]/50 px-2">Knowledge Base</h2>
          <nav className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-sm font-bold rounded-xl transition-all",
                  selectedCategory === cat 
                    ? "bg-[#00f7ff] text-black shadow-neobrutalist translate-x-1" 
                    : "text-white/60 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-4 h-4" />
                  {cat}
                </div>
                {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] uppercase font-black tracking-widest text-[#00f7ff]/50 px-2">Popular Tags</h2>
          <div className="flex flex-wrap gap-2 px-2">
            {TAGS.map(tag => (
              <button key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black hover:border-[#00f7ff]/50 hover:text-[#00f7ff] transition-all">
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <GlassPanel className="p-4 mt-auto border-dashed">
          <div className="flex items-center gap-3 text-white/40 mb-3">
            <Brain className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Capacity</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#00f7ff] w-[65%]" />
          </div>
          <p className="text-[10px] text-white/40 font-medium">65% of context window used</p>
        </GlassPanel>
      </aside>

      <main className="flex-1 flex flex-col space-y-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00f7ff] transition-colors" />
            <input 
              type="text"
              placeholder="Search across your knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-2 border-black rounded-2xl py-3 pl-12 pr-32 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f7ff]/50 transition-all shadow-neobrutalist"
            />
            <button 
              onClick={() => setIsSemanticSearch(!isSemanticSearch)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                isSemanticSearch 
                  ? "bg-[#00f7ff] text-black" 
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              SEMANTIC
            </button>
          </div>
          
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-[#00f7ff] text-black font-black px-8 py-3.5 rounded-2xl shadow-neobrutalist hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Upload Document
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {filteredDocuments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center relative">
                  <Database className="w-12 h-12 text-white/10" />
                  <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#00f7ff]/10 border border-[#00f7ff]/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#00f7ff]" />
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-black text-white">No Intelligence Found</h3>
                  <p className="text-white/40 max-w-sm mx-auto mt-2">Upload your first document to unlock AI-powered insights and semantic search capabilities.</p>
               </div>
               <button 
                 onClick={handleUploadClick}
                 className="px-6 py-2 border-2 border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-all"
                >
                  Get Started
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIsViewerOpen(true);
                  }}
                  className="group relative bg-[#0a0a0a] border-2 border-black rounded-3xl p-6 shadow-neobrutalist hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer animate-in fade-in zoom-in duration-500"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-neobrutalist border border-black",
                      doc.status === 'PROCESSING' ? 'bg-[#00f7ff]/20 animate-pulse' : 'bg-white/5'
                    )}>
                      {doc.status === 'PROCESSING' ? (
                        <Brain className="w-6 h-6 text-[#00f7ff]" />
                      ) : (
                        <FileText className="w-6 h-6 text-white/40 group-hover:text-[#00f7ff] transition-colors" />
                      )}
                    </div>
                    
                    <div className="relative document-menu-container" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-white"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {activeMenuId === doc.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border-2 border-black rounded-2xl shadow-neobrutalist-lg z-50 overflow-hidden py-1">
                          <button 
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsViewerOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5 transition-colors text-left font-bold"
                          >
                            <ArrowUpRight className="w-4 h-4 text-[#00f7ff]" />
                            Open Viewer
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/5 transition-colors text-left font-bold">
                            <Share2 className="w-4 h-4" />
                            Share Access
                          </button>
                          <div className="h-[2px] bg-black my-1" />
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                            Purge Records
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <h3 className="font-black text-white truncate text-lg" title={doc.name}>
                        {doc.name}
                      </h3>
                      {doc.status === 'COMPLETED' && <Shield className="w-4 h-4 text-[#00f7ff]" />}
                    </div>
                    
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-medium">
                      {doc.summary || "Pending cryptographic analysis and semantic indexing..."}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {doc.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase tracking-tighter text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t-2 border-black/50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-white/20">
                      <Clock3 className="w-4 h-4" />
                      {doc.uploadedAt}
                    </div>
                    <div className="flex items-center gap-2 text-[#00f7ff]/60">
                      <HardDrive className="w-4 h-4" />
                      {doc.size}
                    </div>
                  </div>

                  {doc.status === 'PROCESSING' && (
                    <div className="absolute bottom-0 left-0 h-[3px] bg-[#00f7ff] animate-progress shadow-[0_0_10px_#00f7ff]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />

      {selectedDoc && (
        <DocumentViewer 
          document={selectedDoc} 
          isOpen={isViewerOpen} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; left: 0; }
          50% { width: 40%; left: 30%; }
          100% { width: 0%; left: 100%; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
