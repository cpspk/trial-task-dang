"use client"

import { Layout, Widget } from '@prisma/client';
import React, { createContext, useContext, useState } from 'react';

type DashboardContextType = {
  selectedDashboard: Partial<Layout & { layoutConfig: number[][], widgets: Widget[] }>
  setSelectedDashboard: (value: DashboardContextType['selectedDashboard']) => void
  toggleLayoutEdit: boolean
  setToggleLayoutEdit: (value: boolean) => void
}

const DashboardContext = createContext<DashboardContextType>({
  selectedDashboard: {},
  setSelectedDashboard: () => { },
  toggleLayoutEdit: false,
  setToggleLayoutEdit: () => { }
});

export const useDashboard = () => useContext(DashboardContext)

interface DashboardProviderProps {
  children: React.ReactNode
}

const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardContextType['selectedDashboard']>({})
  const [toggleLayoutEdit, setToggleLayoutEdit] = useState(false)

  return (
    <DashboardContext.Provider value={{ selectedDashboard, setSelectedDashboard, toggleLayoutEdit, setToggleLayoutEdit }}>
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardProvider
