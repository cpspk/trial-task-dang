"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import useWallet from '@/hooks/useWallet'
import { numberFormatter } from '@/lib/utils'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
});

export const PortfolioWidget: React.FC = () => {
  const wallet = useWallet()

  const { data, isPending, } = useQuery<{ totalWalletBalance: number; assets: any[] }>({
    queryKey: ["portfolio"],
    queryFn: () => fetch(`/api/portfolio?wallet=${wallet}`).then(res => res.json()),
    refetchInterval: 3000,
  })



  if (isPending || !data || !data.assets) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  return (
    <div className="space-y-2">
      <div>Total wallet balance: ${formatter.format(data.totalWalletBalance ? data.totalWalletBalance : 0)}</div>
      {data.assets.map((item, key) => (
        <div key={key} className="gap-2 flex items-center flex-wrap">
          <div>{item.name}</div>
          <img src={item.image} alt={item.name} className="w-4 h-4" />
          <div>${numberFormatter.format(item.price)}</div>
          <div>{numberFormatter.format(item.tokenBalance)}</div>
        </div>
      ))}
    </div>
  )
}
