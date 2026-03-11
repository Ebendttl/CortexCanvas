export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Settings</h1>
      <p className="text-white/60">Manage your profile, theme, and API integrations.</p>
      
      <div className="space-y-4 max-w-xl">
        <div className="p-4 border-2 border-black bg-white/5 rounded-xl flex justify-between items-center">
           <span className="font-bold">Dark Mode</span>
           <div className="w-12 h-6 bg-[#00f7ff] rounded-full relative shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-neobrutalist"></div>
           </div>
        </div>
      </div>
    </div>
  )
}
