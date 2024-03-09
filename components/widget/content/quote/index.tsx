import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SymbolIcon } from "@radix-ui/react-icons"
import type { WidgetProps } from '../index'

export const QuoteWidget: React.FC<WidgetProps<{ layoutWidgetId: number }>> = ({ config }) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["quote", config.layoutWidgetId],
    queryFn: () => fetch(`/api/quote`).then(res => res.json()),
  })

  if (isPending || !data) {
    return (
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
    )
  }

  return (
    <div className="space-y-2">
      <div>{data.text}</div>
      <div>— {data.author}</div>
      <div className='flex'>
        <Button variant="outline" size="icon" className='ml-auto' onClick={() => refetch()}>
          <SymbolIcon className="h-2 w-2" />
        </Button>
      </div>
    </div>
  )
}
