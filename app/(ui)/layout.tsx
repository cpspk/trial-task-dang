"use client"

import { SessionProvider } from "next-auth/react"
import SecureRoutes from "../secure-routes"

interface LayoutProps {
  children: React.ReactNode
  session: any
}

const Layout: React.FC<LayoutProps> = ({ children, session }) => (
  <SessionProvider session={session}>
    <SecureRoutes>
      {children}
    </SecureRoutes>
  </SessionProvider>
)

export default Layout
