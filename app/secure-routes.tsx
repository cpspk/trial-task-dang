import React from "react"
import { useSession } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"

interface SecureRoutesProps {
  children: React.ReactNode
}

const SecureRoutes: React.FC<SecureRoutesProps> = ({ children }) => {
  const pathname = usePathname()
  const { status } = useSession()

  if (status === "loading") {
    return children
  }

  console.log(pathname, status)
  if (pathname === "/auth" && status === "authenticated") {
    redirect("/dashboard")
  }

  if (pathname !== "/auth" && status !== "authenticated") {
    redirect("/auth")
  }

  return children
}

export default SecureRoutes
