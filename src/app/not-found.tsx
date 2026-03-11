import Link from "next/link";
import { NeobrutalistButton } from "@/components/ui/NeobrutalistButton";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] space-y-8 p-4">
      <div className="relative">
        <h1 className="text-9xl font-black text-white/10 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f7ff] to-[#6b00ff] italic tracking-tighter uppercase">
            Coordinates Lost in Space
          </span>
        </div>
      </div>
      
      <div className="text-center max-w-md space-y-4">
        <p className="text-white/60">
          The knowledge node you're looking for has either been shifted to another dimension or never existed.
        </p>
        <Link href="/dashboard" className="inline-block">
          <NeobrutalistButton variant="primary">
            Return to Dashboard
          </NeobrutalistButton>
        </Link>
      </div>
    </div>
  )
}
