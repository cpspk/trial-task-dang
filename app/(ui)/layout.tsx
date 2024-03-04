"use client"

import SecureRoutes from "@/app/secure-routes"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"
import DashboardProvider from '../providers/dashboardProvider'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <SecureRoutes>
      <DashboardProvider>
        {pathname !== "/auth" && (
          <Header />
        )}
        {children}
      </DashboardProvider>
    </SecureRoutes>
  )
}
export default Layout
