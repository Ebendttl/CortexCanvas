import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeobrutalistButton } from "@/components/ui/NeobrutalistButton";
import { Plus, FileText, BrainCircuit, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">Welcome back, Explorer</h1>
          <p className="text-white/60 mt-2 text-lg">Your AI-powered knowledge workspace is ready.</p>
        </div>
        <NeobrutalistButton variant="primary" size="lg" className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Document
        </NeobrutalistButton>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassPanel glow className="p-6 border-l-4 border-l-[#00f7ff]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#00f7ff]/10 rounded-xl">
              <FileText className="text-[#00f7ff] w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Recent Documents</h3>
          </div>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                <span className="text-white/80 font-medium group-hover:text-[#00f7ff]">Strategic Planning 2026</span>
                <span className="text-white/40 text-xs text-right">2h ago</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel glow className="p-6 border-l-4 border-l-[#6b00ff]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#6b00ff]/10 rounded-xl">
              <BrainCircuit className="text-[#6b00ff] w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <p className="text-white/70 text-sm leading-relaxed">
              Based on your recent notes, I can help you synthesize the "Project Alpha" milestones into a timeline.
            </p>
            <NeobrutalistButton variant="outline" size="sm" className="w-full">
              Try it now
            </NeobrutalistButton>
          </div>
        </GlassPanel>

        <GlassPanel glow className="p-6 border-l-4 border-l-[#1aff9c]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#1aff9c]/10 rounded-xl">
              <Activity className="text-[#1aff9c] w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">System Status</h3>
          </div>
          <div className="flex items-center gap-2 text-[#1aff9c] font-mono text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1aff9c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1aff9c]"></span>
            </span>
            All systems bioluminescent
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/40 text-xs uppercase font-black">Latency</div>
              <div className="text-white font-mono">14ms</div>
            </div>
            <div>
              <div className="text-white/40 text-xs uppercase font-black">Embeddings</div>
              <div className="text-white font-mono">1.2k</div>
            </div>
          </div>
        </GlassPanel>
      </div>

      <section>
        <h2 className="text-2xl font-black text-white mb-6">Upcoming Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <GlassPanel className="p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-all border-dashed border-2 border-white/10 group">
              <h4 className="font-bold text-[#00f7ff] group-hover:underline cursor-pointer">Visual Graph View</h4>
              <p className="text-white/50 text-sm mt-1">Navigate your knowledge through a 3D bioluminescent node graph.</p>
           </GlassPanel>
           <GlassPanel className="p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-all border-dashed border-2 border-white/10 group">
              <h4 className="font-bold text-[#6b00ff] group-hover:underline cursor-pointer">Multi-model Chat</h4>
              <p className="text-white/50 text-sm mt-1">Switch between Claude 3.5, GPT-4o, and Llama 3 instantly.</p>
           </GlassPanel>
        </div>
      </section>
    </div>
  );
}
