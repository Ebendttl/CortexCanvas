"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Search, 
  Settings, 
  HelpCircle, 
  PlusCircle, 
  LayoutDashboard,
  BrainCircuit,
  Users
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "AI Workspace", href: "/ai-workspace", icon: BrainCircuit },
  { name: "Collaboration", href: "/collaboration", icon: Users },
  { name: "Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r-2 border-black bg-[#0a0a0a] flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b-2 border-black">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f7ff] to-[#6b00ff]">
          CortexCanvas
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border-2 border-transparent",
              pathname === item.href
                ? "bg-[#00f7ff] text-black border-black shadow-neobrutalist"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t-2 border-black space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all font-bold">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all font-bold">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </button>
      </div>
    </aside>
  );
}
