export default function CollaborationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Collaboration</h1>
      <p className="text-white/60">Manage shared workspaces and real-time multiplayer sessions.</p>
      
      <div className="p-8 border-2 border-[#1aff9c]/10 rounded-2xl bg-[#1aff9c]/5">
         <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#1aff9c] animate-pulse"></div>
            <span className="text-[#1aff9c] font-mono text-sm uppercase tracking-widest">Multiplayer Active</span>
         </div>
      </div>
    </div>
  )
}
