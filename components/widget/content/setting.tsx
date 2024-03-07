import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { LoaderIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"

export interface WidgetSettingBasicProps {
  onSubmit: (data: any) => void
  onBack: () => void
  isPending?: boolean
}

interface WidgetSettingProps extends WidgetSettingBasicProps {
  form: UseFormReturn<any>
  children: React.ReactNode
}

export const WidgetSetting: React.FC<WidgetSettingProps> = ({
  form,
  children,
  onSubmit,
  onBack,
  isPending
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
      {children}
      <div className='flex mt-2'>
        <div className='ml-auto'>
          <Button type="button" variant="outline" onClick={() => { form.reset(); onBack(); }}>&nbsp;Back&nbsp;</Button>
          <Button type="submit" className='ml-2' disabled={isPending}>
            {isPending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </div>
    </form>
  </Form>
)
