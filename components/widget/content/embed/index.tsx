import { useDashboard } from '@/app/providers/dashboardProvider'
import { WidgetContentProps } from '../index'
import React from 'react'
import Iframe from 'react-iframe'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { checkKeyDown } from "@/utils/keyDown"
import { useMutation } from '@tanstack/react-query'

const FormSchema = z.object({
  url: z.string().url()
})

export const Embed: React.FC<WidgetContentProps> = ({
  layoutWidgetId,
  widget,
  settingMode,
  setSettingMode
}) => {
  const {
    toggleLayoutEdit,
    selectedDashboard,
    setSelectedDashboard
  } = useDashboard()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  })
  const layoutWidget = selectedDashboard.widgets?.filter(item => item.id === layoutWidgetId)[0]

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateLayoutWidget(data)
  }

  const handleBack = () => {
    form.reset()
    setSettingMode(false)
  }

  const { mutate: updateLayoutWidget } = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) => {
      return fetch("/api/layouts/" + selectedDashboard.id + "/layoutWidgets/" + layoutWidgetId, {
        method: "PUT",
        body: JSON.stringify({
          widgetConfig: data
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

        handleBack()
      })
    }
  })

  return (
    <div>
      {settingMode && toggleLayoutEdit ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} className="space-y-6 p-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="https://web-url..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex mt-2'>
              <div className='ml-auto'>
                <Button variant="outline" onClick={handleBack}>&nbsp;Back&nbsp;</Button>
                <Button type="submit" className='ml-2'>Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <div>
          {layoutWidget?.widgetConfig ? (
            <Iframe
              url={(layoutWidget.widgetConfig as { url: string }).url}
              width="100%"
              height="320px"
              id=""
              className=""
              display="block"
              position="relative"
            />
          ) : (
            <div className='whitespace-pre-line'>{widget.widgetDescription}</div>
          )}
        </div>
      )}
    </div>
  )
}