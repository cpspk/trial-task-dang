import React from "react";
import { Widget, WidgetName } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { WidgetSettingBasicProps } from "./setting"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { EmbedWidget, EmbedSetting } from "./embed"
import { StockChartSetting, StockChartWidget } from "./stockchart"
import { PriceTickerWidget } from "./priceticker"
import { LoaderIcon } from "lucide-react"
import { PortfolioWidget } from "./portfolio"

interface WidgetContentProps {
  layoutWidgetId: number,
  widget: Widget,
  settingMode: boolean,
  isDeletePending?: boolean,
  setSettingMode: (value: boolean) => void
}

export interface WidgetProps<WidgetConfig> {
  config: WidgetConfig
}

const settings: Record<WidgetName, React.FC<WidgetSettingBasicProps> | null> = {
  EmbedWidget: EmbedSetting,
  RssNewsReader: EmbedSetting,
  StockChart: StockChartSetting,
  PriceTicker: null,
  PortfolioTracker: null,
}

const widgets: Record<WidgetName, React.FC<WidgetProps<any>>> = {
  EmbedWidget: EmbedWidget,
  RssNewsReader: EmbedWidget,
  StockChart: StockChartWidget,
  PriceTicker: PriceTickerWidget,
  PortfolioTracker: PortfolioWidget
}

export const Content: React.FC<WidgetContentProps> = ({
  widget,
  layoutWidgetId,
  settingMode,
  setSettingMode,
  isDeletePending
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

  if (isDeletePending) {
    return (
      <div className="flex">
        {isDeletePending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
        Deleting
      </div>
    )
  }
  if (settingMode && toggleLayoutEdit && Setting) {
    return <Setting onSubmit={updateLayoutWidget} onBack={() => setSettingMode(false)} isPending={isPending} />
  }

  if (layoutWidget?.widgetConfig) {
    return <Widget config={layoutWidget?.widgetConfig} />
  }

  if (widget.widgetName === "PriceTicker" || widget.widgetName === "PortfolioTracker") {
    return <Widget config={layoutWidget?.widgetConfig} />
  }

  return (
    <div className='whitespace-pre-line'>{widget.widgetDescription}</div>
  )
}