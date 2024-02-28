"use client"

import { SessionProvider } from "next-auth/react"
import SecureRoutes from "@/app/secure-routes"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <SessionProvider>
      <SecureRoutes>
        {pathname !== "/auth" && (
          <Header />
        )}
        {children}
      </SecureRoutes>
    </SessionProvider>
  )
}
export default Layout
