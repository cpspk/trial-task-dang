import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SymbolIcon } from "@radix-ui/react-icons"
import type { WidgetProps } from '../index'
import { getRandomInt } from '@/lib/utils'

export const QuoteWidget: React.FC<WidgetProps<{ layoutWidgetId: number }>> = ({ config }) => {
  const { data, isPending } = useQuery({
    queryKey: ["quote", config.layoutWidgetId],
    queryFn: () => fetch(`/api/quote`).then(res => res.json()).then(res => {
      setQuote(res[getRandomInt(res.length)])
      return res
    }),
  })

  const [quote, setQuote] = useState(data?.[getRandomInt(data?.length)])

  if (isPending || !data) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  const handleRefresh = () => {
    setQuote(data[getRandomInt(data.length)])
  }

  return (
    <div className="space-y-2">
      <div>{quote?.text}</div>
      <div>— {quote?.author?.split(',')[0]}</div>
      <div className='flex'>
        <Button variant="outline" size="icon" className='ml-auto' onClick={handleRefresh}>
          <SymbolIcon className="h-2 w-2" />
        </Button>
      </div>
    </div>
  )
}
