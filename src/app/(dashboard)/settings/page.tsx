"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">Settings</h1>
      <p className="text-white/60">Manage your profile, theme, and API integrations.</p>
      
      <div className="space-y-4 max-w-xl">
        <div className="p-4 border-2 border-black bg-white/5 rounded-xl flex justify-between items-center">
           <span className="font-bold">Dark Mode</span>
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className={cn(
               "w-12 h-6 rounded-full relative shadow-inner transition-colors",
               isDarkMode ? "bg-[#00f7ff]" : "bg-white/20"
             )}
           >
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-black rounded-full shadow-neobrutalist transition-all",
                isDarkMode ? "right-1" : "left-1"
              )}></div>
           </button>
        </div>
      </div>
    </div>
  )
}
