import React from 'react'
import Iframe from 'react-iframe'
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import type { WidgetProps } from '../index'
import { WidgetSetting, WidgetSettingBasicProps } from '../setting'

const FormSchema = z.object({
  url: z.string().url()
})

export const EmbedSetting: React.FC<WidgetSettingBasicProps> = ({
  onSubmit,
  onBack,
  isPending
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  })

  return (
    <WidgetSetting form={form} onSubmit={onSubmit} onBack={onBack} isPending={isPending}>
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
    </WidgetSetting>
  )
}

export const EmbedWidget: React.FC<WidgetProps<{ url: string }>> = ({ config }) => (
  <Iframe
    url={config.url}
    width="100%"
    height="100%"
    display="block"
    position="relative"
  />
)
