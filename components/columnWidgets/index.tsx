import React from "react"
import { Widget } from '@/components/widget'
import { useQuery } from '@tanstack/react-query'
import { Widget as PrismaWidgets } from "@prisma/client"
import { Droppable } from "react-beautiful-dnd"
import { useDashboard } from "@/app/providers/dashboardProvider"

export const ColumnWidgets: React.FC<{ layoutWidgetIds: number[], index: number }> = ({ layoutWidgetIds, index }) => {
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  const { selectedDashboard } = useDashboard()

  const { data: widgets, isPending } = useQuery<PrismaWidgets[]>({
    queryKey: ["widgets"],
    queryFn: () => fetch("/api/widgets").then((res) => res.json()),
  })

  if (isPending || !widgets || !Array.isArray(widgets)) {
    return <></>
  }

  const widgetMap = Object.fromEntries(widgets.map(widget => ([widget.id, widget])))

  return (
    <div className="p-2 min-w-32 min-h-32 w-1/4">
      <Droppable droppableId={index.toString()}>
        {(provided, snapshot) => {

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={snapshot.isDraggingOver ? "bg-green-200 w-full h-full" : "bg-inherit w-full h-full"}
            >
              {
                layoutWidgetIds.map((layoutWidgetId, index) => {
                  const widgetId = selectedDashboard?.widgets?.find(layoutWidget => layoutWidget.id === layoutWidgetId)?.widgetId

                  return widgetId && (
                    <Widget
                      key={layoutWidgetId}
                      index={index}
                      widget={widgetMap[widgetId]}
                      layoutWidgetId={layoutWidgetId}
                    />
                  )
                })
              }
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>

  )
}
