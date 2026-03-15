"use client"

import { ClientOnly } from "@/components/ClientOnly"
import { SessionProvider } from "next-auth/react"
import { CommandPalette } from "@/components/CommandPalette"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ClientOnly>
        <CommandPalette />
      </ClientOnly>
    </SessionProvider>
  )
}
