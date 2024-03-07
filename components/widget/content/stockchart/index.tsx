"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import TVChart from "@/components/tradingView"
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
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'

const FormSchema = z.object({
  symbol: z.string().min(3)
})

export const StockChartSetting: React.FC<WidgetSettingBasicProps> = ({
  onSubmit,
  onBack,
  isPending
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symbol: "",
    },
  })

  return (
    <WidgetSetting form={form} onSubmit={onSubmit} onBack={onBack} isPending={isPending}>
      <FormField
        control={form.control}
        name="symbol"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="token symbol" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </WidgetSetting>
  )
}

export const StockChartWidget: React.FC<WidgetProps<{ symbol: string }>> = ({ config }) => {
  const { data, isPending } = useQuery({
    queryKey: ["pair", config.symbol],
    queryFn: () => fetch(`/api/pair?symbol=${config.symbol}`).then(res => res.json())
  })

  if (isPending || !data) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  return (
    <div>
      <TVChart
        symbol={`${config.symbol.toUpperCase()} / ${data.quoteToken}`}
        pairAddress={data.pair}
        initialPrice="500"
        onChartReady={() => { }}
      />
      <div className='mt-1 bg-slate-300'>{config.symbol}</div>
    </div>
  )
}
