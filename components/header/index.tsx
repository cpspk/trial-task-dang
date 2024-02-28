import DashboardSwitcher from "./DashboardSwitcher"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export const Header = () => {
  const { data } = useSession()
  const walletAddress = data?.user.walletAddress.substring(0, 7) + '...' + data?.user.walletAddress.substring(data?.user.walletAddress.length - 5)

  const handleLogout = () => {
    signOut()
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <DashboardSwitcher />
        <div className="ml-auto flex items-center space-x-4">
          <Select onValueChange={handleLogout}>
            <SelectTrigger>
              <SelectValue placeholder={walletAddress} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

  )
}