export default function SearchPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Search</h1>
      <p className="text-white/60">Global search across all your documents and AI insights.</p>
      
      <div className="relative max-w-2xl">
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="w-full bg-white/5 border-2 border-black p-4 rounded-xl text-white focus:border-[#00f7ff] transition-all outline-none"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 font-mono text-xs">
           CMD + K
        </div>
      </div>
    </div>
  )
}
