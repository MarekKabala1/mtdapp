import { TanstackQueryProvider } from "@/lib/tanstack-query/provider"
import React from "react"
import { ThemeProvider } from "./theme-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </ThemeProvider>
  )
}
