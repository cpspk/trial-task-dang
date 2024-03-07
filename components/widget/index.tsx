import React, { useState } from "react"
import { Widget as PrismaWidget } from "@prisma/client"
import { Draggable } from "react-beautiful-dnd"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { Button } from "@/components/ui/button"
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons"
import { useMutation } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"
import { Content } from "./content"

export const Widget: React.FC<{
  widget: PrismaWidget,
  index: number,
  layoutWidgetId: number
}> = ({ widget, index, layoutWidgetId }) => {
  const {
    toggleLayoutEdit,
    selectedDashboard,
    setSelectedDashboard
  } = useDashboard()

  const { mutate: removeWidget, isPending } = useMutation({
    mutationFn: (id: number) => {
      const layoutConfig = selectedDashboard.layoutConfig?.map(column => column.filter(widgetId => widgetId !== id))

      return fetch("/api/layouts/" + selectedDashboard.id + "/layoutWidgets/" + id, {
        method: "DELETE",
        body: JSON.stringify({
          layoutConfig
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

  const [settingMode, setSettingMode] = useState(false)

  return (
    <Draggable
      draggableId={layoutWidgetId.toString()}
      index={index}
      isDragDisabled={!toggleLayoutEdit}
    >
      {provided => (
        <div
          className="border-2 rounded p-1 m-2 select-none"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center flex-wrap">
            <div className="mr-2">{widget.widgetName}</div>
            {toggleLayoutEdit && (
              <div className="flex ml-auto">
                {widget.widgetName !== "PriceTicker" && widget.widgetName !== "PortfolioTracker" && (
                  <Button
                    variant="outline"
                    onClick={() => setSettingMode(true)}
                  >
                    <GearIcon />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => removeWidget(layoutWidgetId)}
                  className="ml-1"
                >
                  <Cross2Icon />
                </Button>
              </div>
            )}
          </div>
          <Separator className="my-1" />
          <Content
            widget={widget}
            layoutWidgetId={layoutWidgetId}
            settingMode={settingMode}
            setSettingMode={setSettingMode}
            isDeletePending={isPending}
          />
        </div>
      )}
    </Draggable>
  )
}