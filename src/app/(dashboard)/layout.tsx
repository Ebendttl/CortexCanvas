"use client"

import { Sidebar } from "@/components/Sidebar";
import { useCommandPalette } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleSearch = useCommandPalette(state => state.toggle);

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b-2 border-black flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white/90">Dashboard</h2>
          </div>
          <div className="flex items-center gap-6">
             {/* Search trigger */}
             <div 
                onClick={toggleSearch}
                role="button"
                className="hidden md:flex text-sm font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-md border border-white/10 group cursor-pointer hover:border-[#00f7ff]/50 transition-colors"
                title="Cmd + K to search"
             >
                <span className="group-hover:text-[#00f7ff]">Cmd + K to search</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f7ff] to-[#6b00ff] border-2 border-black shadow-neobrutalist"></div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
