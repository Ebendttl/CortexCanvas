"use client"

import { useRef } from "react";

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // Logic for processing/uploading would go here
      alert(`File "${file.name}" selected for upload!`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Documents</h1>
      <p className="text-white/60">Your private and shared knowledge documents will appear here.</p>
      
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
