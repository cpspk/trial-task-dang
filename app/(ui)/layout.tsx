"use client"

import { SessionProvider } from "next-auth/react"
import SecureRoutes from "../secure-routes"

interface LayoutProps {
  children: React.ReactNode
  session: any
}

const Layout: React.FC<LayoutProps> = ({ children, session }) => (
  <SessionProvider session={session}>
    <main className="md:container">
      <SecureRoutes>
        {children}
      </SecureRoutes>
    </main>
  </SessionProvider>
)

export default Layout
