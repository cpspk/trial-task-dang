import React from "react";
import { Widget } from "@prisma/client"
import { Embed } from "./embed"

export interface WidgetContentProps {
  layoutWidgetId: number,
  widget: Widget,
  settingMode: boolean,
  setSettingMode: (value: boolean) => void
}

export const Content: React.FC<WidgetContentProps> = ({
  widget,
  layoutWidgetId,
  settingMode,
  setSettingMode
}) => {
  switch (widget.widgetName) {
    case "Embed Widget":
      return <Embed
        widget={widget}
        layoutWidgetId={layoutWidgetId}
        settingMode={settingMode}
        setSettingMode={setSettingMode}
      />
    default:
      return <></>
  }
}