"use client"

import { useRef, useState, useEffect } from "react";
import { FileText, Plus, Clock, MoreVertical, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
    fileInputRef.current?.click();
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setActiveMenuId(null);

    try {
      await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete document:", error);
      // In a real app, we might want to revert the UI state here or show an error toast
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.name.split('.').pop()?.toUpperCase() || "FILE",
        uploadedAt: "Just now",
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Documents</h1>
          <p className="text-white/60">Manage your private and shared knowledge workspace.</p>
        </div>
        
        {documents.length > 0 && (
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-[#00f7ff] text-black font-black px-6 py-3 rounded-xl shadow-neobrutalist hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Plus className="w-5 h-5" />
            Upload New
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={handleUploadClick}
            className="p-12 border-2 border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] hover:bg-white/5 hover:border-[#00f7ff]/50 transition-all group cursor-pointer"
          >
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#00f7ff]/10 transition-colors">
                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📂</span>
             </div>
             <div>
                <p className="font-bold text-white/80 group-hover:text-[#00f7ff] transition-colors">No documents yet</p>
                <p className="text-sm text-white/40">Create your first document to get started.</p>
             </div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="p-5 border-2 border-black bg-white/5 rounded-2xl flex flex-col space-y-4 hover:border-[#00f7ff]/30 transition-all group relative animate-in fade-in zoom-in duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#00f7ff]/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#00f7ff]" />
                </div>
                <div className="relative document-menu-container">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                    className={cn(
                      "p-1 hover:bg-white/10 rounded-lg transition-colors",
                      activeMenuId === doc.id && "bg-white/10 text-white"
                    )}
                  >
                    <MoreVertical className={cn(
                      "w-5 h-5 transition-colors",
                      activeMenuId === doc.id ? "text-white" : "text-white/40"
                    )} />
                  </button>

                  {activeMenuId === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border-2 border-black rounded-xl shadow-neobrutalist z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-bold">Delete Document</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-white truncate pr-4" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] uppercase font-black tracking-widest text-[#00f7ff]/60">
                  <span>{doc.type}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{doc.size}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {doc.uploadedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
