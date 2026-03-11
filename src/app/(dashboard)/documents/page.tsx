export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Documents</h1>
      <p className="text-white/60">Your private and shared knowledge documents will appear here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-12 border-2 border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02]">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <span className="text-2xl opacity-50">📂</span>
           </div>
           <div>
              <p className="font-bold text-white/80">No documents yet</p>
              <p className="text-sm text-white/40">Create your first document to get started.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
