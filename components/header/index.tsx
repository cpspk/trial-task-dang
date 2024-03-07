"use client"
import DashboardSwitcher from "./DashboardSwitcher"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signOut } from "next-auth/react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { Widget } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"
import useWallet from "@/hooks/useWallet"
import { abbrAddress } from "@/lib/utils"

export const Header = () => {
  const wallet = useWallet()

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

  const { mutate: addWidget, isPending } = useMutation({
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

  return (
    <div className="border-b">
      <div className="flex flex-wrap items-center p-4 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6 p-1"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        {widgets && <DashboardSwitcher widgets={widgets} className="p-1" />}
        {selectedDashboard.id && (
          <div className="flex flex-wrap">
            <div className="flex items-center space-x-2 ml-2 p-1">
              <Switch id="airplane-mode" checked={toggleLayoutEdit} onCheckedChange={setToggleLayoutEdit} />
              <Label htmlFor="airplane-mode">Edit Dashboard</Label>
            </div>
            {toggleLayoutEdit && (
              <div className="ml-3 p-1">
                <Select value={""} onValueChange={id => addWidget(Number(id))}>
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
        {isPending && (
          <>
            <LoaderIcon className="ml-4 mr-2 h-4 w-4 animate-spin" />
            Adding widget...
          </>
        )}
        <div className="ml-auto flex items-center space-x-4 p-1">
          <Select onValueChange={() => signOut()}>
            {wallet && (
              <SelectTrigger>
                <SelectValue placeholder={abbrAddress(wallet)} />
              </SelectTrigger>
            )}
            <SelectContent>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

  )
}