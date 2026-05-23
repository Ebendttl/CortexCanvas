"use client"

import { Sidebar } from "@/components/Sidebar";
import { useCommandPalette } from "@/lib/store";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleSearch = useCommandPalette(state => state.toggle);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex flex-shrink-0" />

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Slide-over menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              {/* Close Button inside mobile drawer */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-4 z-[60] p-1.5 bg-black border border-white/10 rounded-lg hover:border-[#00f7ff]/50 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <Sidebar className="w-full h-full border-r-2 border-black" onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b-2 border-black flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:border-[#00f7ff]/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
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
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
