export default function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Help & Support</h1>
      <p className="text-white/60">Find guides, documentation, and contact support.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 border-2 border-black bg-white/5 rounded-xl hover:border-[#00f7ff] transition-all cursor-pointer">
           <h3 className="font-bold">Documentation</h3>
           <p className="text-sm text-white/40 mt-1">Read the full guide on how to use CortexCanvas.</p>
        </div>
        <div className="p-6 border-2 border-black bg-white/5 rounded-xl hover:border-[#6b00ff] transition-all cursor-pointer">
           <h3 className="font-bold">Contact Support</h3>
           <p className="text-sm text-white/40 mt-1">Get in touch with our bioluminescent engineers.</p>
        </div>
      </div>
    </div>
  )
}
