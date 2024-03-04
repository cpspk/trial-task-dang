import React from "react"
import { Widget as PrismaWidget } from "@prisma/client"
import { Draggable } from "react-beautiful-dnd"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useMutation } from "@tanstack/react-query"

export const Widget: React.FC<{ widget: PrismaWidget, index: number }> = ({ widget, index }) => {
  const { toggleLayoutEdit, selectedDashboard, setSelectedDashboard } = useDashboard()

  const { mutate: removeWidget } = useMutation({
    mutationFn: (id: number) => {
      const layoutConfig = selectedDashboard.layoutConfig?.map(column => column.filter(widgetId => widgetId !== id))

      return fetch("/api/layouts/" + selectedDashboard.id + "/widgets/" + id, {
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

  const handleRemoveWidget = (id: number) => () => {
    removeWidget(id)
  }

  return (
    <Draggable
      draggableId={widget.id.toString()}
      index={index}
      isDragDisabled={!toggleLayoutEdit}
    >
      {provided => (
        <div
          className="border-2 rounded min-h-10 p-1 m-2 select-none"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center">
            <div className="mr-2">
              {widget.widgetName}
            </div>
            {toggleLayoutEdit && (
              <Button
                variant="outline"
                onClick={handleRemoveWidget(widget.id)}
                className={cn("ml-auto")}
              >
                <Cross2Icon />
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}