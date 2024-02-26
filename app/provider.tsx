"use client"

import React from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"

const queryClient = new QueryClient()

interface ProvidersProps {
  children: React.ReactNode
}

export const Provider: React.FC<ProvidersProps> = ({ children }) => (
  <SessionProvider refetchInterval={0}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </SessionProvider>
)
