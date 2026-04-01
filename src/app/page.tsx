import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f7ff] to-[#6b00ff] drop-shadow-glow">
        CortexCanvas
      </h1>
      <p className="mt-4 text-xl text-white/70">
        AI-Powered Knowledge Workspace
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/auth/signup">
          <button className="px-6 py-3 bg-[#00f7ff] text-black font-bold border-2 border-black shadow-neobrutalist hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neobrutalist-hover transition-all text-sm uppercase tracking-wider">
            Get Started
          </button>
        </Link>
        <Link href="/auth/login">
          <button className="px-6 py-3 glass rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm uppercase tracking-wider text-white/70 hover:text-white">
            Sign In
          </button>
        </Link>
      </div>
    </main>
  );
}
