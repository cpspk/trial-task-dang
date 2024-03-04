"use client"

import { useDashboard } from "@/app/providers/dashboardProvider"
import React, { useCallback } from "react"
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { ColumnWidgets } from "@/components/columnWidgets"
import { useMutation } from "@tanstack/react-query"

const Dashboard = () => {
  const { selectedDashboard, setSelectedDashboard } = useDashboard()

  const { mutate: updateDashboard } = useMutation({
    mutationFn: (layoutConfig: number[][]) => (
      fetch("/api/layouts/" + selectedDashboard.id, {
        method: "PUT",
        body: JSON.stringify({
          layoutConfig
        }),
      }).then(res => res.json()).then(res => {
        setSelectedDashboard({
          ...selectedDashboard,
          layoutConfig: res.layoutConfig
        })
      })
    )
  })

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    let newLayoutConfig

    if (source.droppableId === destination.droppableId) {
      const newWidgetIds = Array.from(selectedDashboard.layoutConfig?.[Number(source.droppableId)] ?? [])
      newWidgetIds.splice(source.index, 1)
      newWidgetIds.splice(destination.index, 0, Number(draggableId))

      newLayoutConfig = selectedDashboard.layoutConfig as number[][]
      newLayoutConfig[Number(source.droppableId)] = newWidgetIds
    } else {
      const startWidgetIds = Array.from(selectedDashboard.layoutConfig?.[Number(source.droppableId)] ?? [])
      startWidgetIds.splice(source.index, 1)

      const finishWidgetIds = Array.from(selectedDashboard.layoutConfig?.[Number(destination.droppableId)] ?? [])
      finishWidgetIds.splice(destination.index, 0, Number(draggableId))

      newLayoutConfig = selectedDashboard.layoutConfig as number[][]
      newLayoutConfig[Number(source.droppableId)] = startWidgetIds
      newLayoutConfig[Number(destination.droppableId)] = finishWidgetIds
    }

    updateDashboard(newLayoutConfig)
  }, [selectedDashboard]);

  return (
    <div>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-wrap justify-between m-2">
          {selectedDashboard.layoutConfig?.map((columnWidgetsIds, index) =>
            <ColumnWidgets
              key={index}
              widgetIds={columnWidgetsIds}
              index={index}
            />
          )}
        </div>
      </DragDropContext>
    </div>
  )
};

export default Dashboard