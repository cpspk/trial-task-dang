"use client"

import { SessionProvider } from "next-auth/react"
import SecureRoutes from "@/app/secure-routes"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <SessionProvider>
    <SecureRoutes>
      {children}
    </SecureRoutes>
  </SessionProvider>
)

export default Layout
