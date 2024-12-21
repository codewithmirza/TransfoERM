'use client'

import { createContext, useContext, ReactNode } from 'react'
import { DESIGN_SYSTEM } from '@/lib/design/constants'

const DesignContext = createContext(DESIGN_SYSTEM)

export function DesignProvider({ children }: { children: ReactNode }) {
  return (
    <DesignContext.Provider value={DESIGN_SYSTEM}>
      {children}
    </DesignContext.Provider>
  )
}

export const useDesign = () => useContext(DesignContext) 