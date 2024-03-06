import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"

export interface WidgetSettingBasicProps {
  onSubmit: (data: any) => void
  onBack: () => void
}

interface WidgetSettingProps extends WidgetSettingBasicProps {
  form: UseFormReturn<any>
  children: React.ReactNode
}

export const WidgetSetting: React.FC<WidgetSettingProps> = ({
  form,
  children,
  onSubmit,
  onBack
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
      {children}
      <div className='flex mt-2'>
        <div className='ml-auto'>
          <Button variant="outline" onClick={() => { form.reset(); onBack(); }}>&nbsp;Back&nbsp;</Button>
          <Button type="submit" className='ml-2'>Submit</Button>
        </div>
      </div>
    </form>
  </Form>
)
