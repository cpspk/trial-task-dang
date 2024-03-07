import React from "react";
import { Widget, WidgetName } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { WidgetSettingBasicProps } from "./setting"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { EmbedWidget, EmbedSetting } from "./embed"
import { StockChartSetting, StockChartWidget } from "./stockchart"

interface WidgetContentProps {
  layoutWidgetId: number,
  widget: Widget,
  settingMode: boolean,
  setSettingMode: (value: boolean) => void
}

export interface WidgetProps<WidgetConfig> {
  config: WidgetConfig
}

const settings: Record<WidgetName, React.FC<WidgetSettingBasicProps>> = {
  EmbedWidget: EmbedSetting,
  RssNewsReader: EmbedSetting,
  StockChart: StockChartSetting,
  PriceTicker: EmbedSetting,
  PortfolioTracker: EmbedSetting,
}

const widgets: Record<WidgetName, React.FC<WidgetProps<any>>> = {
  EmbedWidget: EmbedWidget,
  RssNewsReader: EmbedWidget,
  StockChart: StockChartWidget,
  PriceTicker: EmbedWidget,
  PortfolioTracker: EmbedWidget
}

export const Content: React.FC<WidgetContentProps> = ({
  widget,
  layoutWidgetId,
  settingMode,
  setSettingMode
}) => {
  const {
    toggleLayoutEdit,
    selectedDashboard,
    setSelectedDashboard
  } = useDashboard()

  const layoutWidget = selectedDashboard.widgets?.filter(item => item.id === layoutWidgetId)[0]

  const { mutate: updateLayoutWidget, isPending } = useMutation({
    mutationFn: (widgetConfig) => {
      return fetch("/api/layouts/" + selectedDashboard.id + "/layoutWidgets/" + layoutWidgetId, {
        method: "PUT",
        body: JSON.stringify({
          widgetConfig
        }),
      }).then(res => res.json()).then(res => {
        setSelectedDashboard({
          ...selectedDashboard,
          widgets: selectedDashboard?.widgets?.map(widget => {
            if (widget.id === res.id) {
              return res
            } else {
              return widget
            }
          })
        })

        setSettingMode(false)
      })
    }
  })

  const Setting = settings[widget.widgetName]

  const Widget = widgets[widget.widgetName]

  if (settingMode && toggleLayoutEdit) {
    return <Setting onSubmit={updateLayoutWidget} onBack={() => setSettingMode(false)} isPending={isPending} />
  }

  if (layoutWidget?.widgetConfig) {
    return <Widget config={layoutWidget?.widgetConfig} />
  }

  return (
    <div className='whitespace-pre-line'>{widget.widgetDescription}</div>
  )
}