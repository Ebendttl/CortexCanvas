"use client"

import { ClientOnly } from "@/components/ClientOnly"
import { CommandPalette } from "@/components/CommandPalette"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ClientOnly>
        <CommandPalette />
      </ClientOnly>
    </>
  )
}
