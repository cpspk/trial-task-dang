"use client"

import React, { useState, useEffect } from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  Cross2Icon
} from "@radix-ui/react-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandGroup,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Layout, LayoutWidgets, Widget } from "@prisma/client"
import { useDashboard } from "@/app/providers/dashboardProvider"
import { checkKeyDown } from "@/utils/keyDown"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface DashboardSwitcherProps extends PopoverTriggerProps {
  widgets: Widget[]
}

const FormSchema = z.object({
  dashboardname: z.string().min(2, {
    message: "Dashboard name must be at least 2 characters.",
  }),
  widgets: z.array(z.object({ label: z.string(), value: z.string() }))
})

export default function DashboardSwitcher({ className, widgets }: DashboardSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [showNewDashboardDialog, setShowNewDashboardDialog] = useState(false)
  const { selectedDashboard, setSelectedDashboard, setToggleLayoutEdit } = useDashboard()

  const { data: dashboards, refetch } = useQuery<(Layout & { widgets: LayoutWidgets[] })[]>({
    queryKey: ["layouts"],
    queryFn: () => fetch("/api/layouts").then((res) => res.json()),
  })

  const defaultWidgets: Option[] = widgets ? widgets?.map(widget => {
    return {
      label: widget.widgetName,
      value: widget.id.toString(),
    }
  }) : []

  useEffect(() => {
    if (dashboards !== undefined) {
      if (dashboards.length > 0) {
        setSelectedDashboard({
          id: dashboards[dashboards.length - 1].id,
          layoutName: dashboards[dashboards.length - 1].layoutName,
          layoutConfig: dashboards[dashboards.length - 1].layoutConfig as number[][],
          widgets: dashboards[dashboards.length - 1].widgets
        })
      } else {
        setSelectedDashboard({})
      }
    }
  }, [dashboards])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dashboardname: "",
      widgets: []
    },
  })

  const { mutate: createDashboard } = useMutation({
    mutationFn: (layout: z.infer<typeof FormSchema>) =>
      fetch("/api/layouts", {
        method: "POST",
        body: JSON.stringify({
          ...layout, widgets: layout.widgets.map(widget => { return { id: Number(widget.value) } })
        }),
      }).then(res => {
        refetch()
      }),
  })

  const { mutate: deleteDashboard } = useMutation({
    mutationFn: (id: number) =>
      fetch("/api/layouts/" + id, {
        method: "DELETE",
      }).then(() => {
        refetch()
      }),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createDashboard(data)
    setShowNewDashboardDialog(false)
    setToggleLayoutEdit(false)
    form.reset()
  }

  const handleResetForm = () => {
    form.reset()
    setShowNewDashboardDialog(false)
  }

  const handleDeleteDashboard = (id: number) => {
    deleteDashboard(id)
    setToggleLayoutEdit(false)
  }

  return (
    <Dialog open={showNewDashboardDialog} onOpenChange={setShowNewDashboardDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a dashboard"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedDashboard.layoutName === undefined ? 'Dashboards' : selectedDashboard.layoutName}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search dashboard..." />
              <CommandEmpty>No dashboard found.</CommandEmpty>
              {dashboards?.map((dashboard) => (
                <CommandItem
                  key={dashboard.id}
                  onSelect={() => {
                    setSelectedDashboard({
                      id: dashboard.id,
                      layoutName: dashboard.layoutName,
                      layoutConfig: dashboard.layoutConfig as number[][],
                      widgets: dashboard.widgets
                    })
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <CheckIcon
                    className={cn(
                      "h-4 w-4",
                      selectedDashboard.id === dashboard.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {dashboard.layoutName}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("ml-auto")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Cross2Icon
                          className={cn(
                            "h-4 w-4",
                          )}
                        />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteDashboard(dashboard.id)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CommandItem>

              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewDashboardDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Dashboard
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Dashboard</DialogTitle>
              <DialogDescription>
                Add a new dashboard.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="dashboardname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dashboard name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="widgets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Widgets (Pick order arranges initial layout)</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            defaultOptions={defaultWidgets ? defaultWidgets : []}
                            placeholder="Select widgets"
                            emptyIndicator={
                              <p className="text-center text-lg leading-5 text-gray-600 dark:text-gray-400">
                                no results found.
                              </p>
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleResetForm}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
