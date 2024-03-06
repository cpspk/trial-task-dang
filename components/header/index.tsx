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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { Widget } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"

export const Header = () => {
  const { data } = useSession()
  const walletAddress = data?.user.walletAddress.substring(0, 7) + '...' + data?.user.walletAddress.substring(data?.user.walletAddress.length - 5)
  const {
    selectedDashboard,
    setSelectedDashboard,
    toggleLayoutEdit,
    setToggleLayoutEdit
  } = useDashboard()

  const { data: widgets } = useQuery<(Widget)[]>({
    queryKey: ["widgets"],
    queryFn: () => fetch("/api/widgets").then((res) => res.json()),
  })

  const { mutate: addWidget } = useMutation({
    mutationFn: (id: number) => {
      return fetch("/api/layouts/" + selectedDashboard.id + "/layoutWidgets", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      }).then(res => res.json()).then(res => {
        setSelectedDashboard({
          ...selectedDashboard,
          layoutConfig: res.layoutConfig,
          widgets: res.widgets
        })
      })
    }
  })

  const handleLogout = () => {
    signOut()
  }

  const handleEditDashboard = (value: boolean) => {
    setToggleLayoutEdit(value)
  }

  const handleAddWidget = (id: string) => {
    addWidget(Number(id))
  }

  return (
    <div className="border-b">
      <div className="flex flex-wrap items-center p-4">
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
        {widgets && <DashboardSwitcher widgets={widgets} />}
        {selectedDashboard.id && (
          <div className="flex flex-wrap">
            <div className="flex items-center space-x-2 ml-2">
              <Switch id="airplane-mode" checked={toggleLayoutEdit} onCheckedChange={handleEditDashboard} />
              <Label htmlFor="airplane-mode">Edit Dashboard</Label>
            </div>
            {toggleLayoutEdit && (
              <div className="ml-3">
                <Select value={""} onValueChange={handleAddWidget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a widget" />
                  </SelectTrigger>
                  <SelectContent>
                    {widgets?.map(widget => (
                      <SelectItem key={widget.id} value={widget.id.toString()}>{widget.widgetName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
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