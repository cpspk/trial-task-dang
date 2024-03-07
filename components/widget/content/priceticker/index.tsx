"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import clsx from 'clsx'
import { numberFormatter } from '@/lib/utils'

export type TrendingType = {
  name: string,
  avatar: string,
  price: number,
  price_change_percentage_24h: number
}

export const PriceTickerWidget: React.FC = () => {
  const { data, isPending } = useQuery<TrendingType[]>({
    queryKey: ["trending"],
    queryFn: () => fetch("/api/trending").then(res => res.json()),
    refetchInterval: 3000
  })

  if (isPending || !data) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  return (
    <div className="space-y-2">
      <p>Price & change in 24h of trending tokens</p>
      {data.map((item) => (
        <div key={item.name} className="gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div>{item.name}</div>
            <img src={item.avatar} alt={item.name} className="w-4 h-4" />
            <div>{numberFormatter.format(item.price)}</div>
            <div className={clsx(item.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600")}>
              {numberFormatter.format(item.price_change_percentage_24h)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
