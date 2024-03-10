import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import type { WidgetProps } from '../index'
import { WidgetSetting, WidgetSettingBasicProps } from '../setting'
import Clock from 'react-clock'
import 'react-clock/dist/Clock.css'
import 'moment-timezone'
import moment from 'moment'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { cn } from "@/lib/utils"

const FormSchema = z.object({
  clock1: z
    .string({
      required_error: "Please select timezone.",
    }),
  clock2: z
    .string({
      required_error: "Please select timezone.",
    })
})

export const AnalogClockSetting: React.FC<WidgetSettingBasicProps> = ({
  onSubmit,
  onBack,
  isPending
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const timezones = moment.tz.names()

  return (
    <WidgetSetting form={form} onSubmit={onSubmit} onBack={onBack} isPending={isPending}>
      <FormField
        control={form.control}
        name="clock1"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Clock 1</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? timezones.find(
                        (timezone) => timezone === field.value
                      )
                      : "Select timezone"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search timezone"
                    className="h-9"
                  />
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup>
                    {timezones.map((timezone) => (
                      <CommandItem
                        value={timezone}
                        key={timezone}
                        onSelect={() => {
                          form.setValue("clock1", timezone)
                        }}
                      >
                        {timezone}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="clock2"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Clock 2</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? timezones.find(
                        (timezone) => timezone === field.value
                      )
                      : "Select timezone"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search timezone"
                    className="h-9"
                  />
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup>
                    {timezones.map((timezone) => (
                      <CommandItem
                        value={timezone}
                        key={timezone}
                        onSelect={() => {
                          form.setValue("clock2", timezone)
                        }}
                      >
                        {timezone}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </WidgetSetting>
  )
}

export const AnalogClockWidget: React.FC<WidgetProps<{ clock1: string, clock2: string }>> = ({ config }) => {
  const clock1Offset = moment.tz.zone(config.clock1)?.utcOffset(Date.now()) as number
  const clock2Offset = moment.tz.zone(config.clock2)?.utcOffset(Date.now()) as number
  const now = new Date()
  const offset1 = now.getTimezoneOffset() - clock1Offset
  const offset2 = now.getTimezoneOffset() - clock2Offset

  const [clock1Value, setClock1Value] = useState(new Date(now.getTime() + offset1 * 60000))
  const [clock2Value, setClock2Value] = useState(new Date(now.getTime() + offset2 * 60000))

  useEffect(() => {
    const interval = setInterval(() => {
      setClock1Value(new Date(new Date().getTime() + offset1 * 60000))
      setClock2Value(new Date(new Date().getTime() + offset2 * 60000))
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [])

  return (
    <div className='flex flex-wrap justify-between'>
      <div>
        <p>{config.clock1}</p>
        <Clock value={clock1Value} />
        <p>{clock1Value.toLocaleString()}</p>
      </div>
      <div>
        <p>{config.clock2}</p>
        <Clock value={clock2Value} />
        <p>{clock2Value.toLocaleString()}</p>
      </div>
    </div>
  )
}
