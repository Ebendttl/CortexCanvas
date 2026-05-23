"use client"

import { ClientOnly } from "@/components/ClientOnly"
import { SessionProvider } from "next-auth/react"
import { CommandPalette } from "@/components/CommandPalette"
import { ToastContainer } from "@/components/ui/ToastContainer"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ClientOnly>
        <CommandPalette />
        <ToastContainer />
      </ClientOnly>
    </SessionProvider>
  )
}
