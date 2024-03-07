import React from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'

const FormSchema = z.object({
  url: z.string().url()
})

export const RssSetting: React.FC<WidgetSettingBasicProps> = ({
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
              <Input placeholder="https://rss-url..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </WidgetSetting>
  )
}

export const RssWidget: React.FC<WidgetProps<{ url: string }>> = ({ config }) => {
  const { data, isPending } = useQuery<{
    link: string,
    title: string,
    thumbnail?: string
  }[]>({
    queryKey: ["rss", config.url],
    queryFn: () => fetch(`/api/rss?url=${config.url}`).then(res => res.json())
  })

  if (isPending || !data) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  return (
    <div>
      <ScrollArea className="h-96">
        {data.map((item, index) => (
          <div className='flex p-1' key={index}>
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt=""
                className='w-24 h-fit'
              />
            )}
            <Link
              href={item.link}
              target="_blank"
              className='ml-2 hover:text-gray-500 hover:font-bold'
            >
              {item.title}
            </Link>
          </div>
        ))}
      </ScrollArea>
      <div className='mt-1 bg-slate-300 break-all'>{config.url}</div>
    </div>
  )
}
