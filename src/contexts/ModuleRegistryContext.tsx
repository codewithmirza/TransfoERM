import { createContext, useCallback, useState, ReactNode } from 'react'

export type ModuleType = 'hr' | 'inventory' | 'finance' | 'crm'

interface ModuleRegistryContextType {
  activeModule: ModuleType | null
  setActiveModule: (module: ModuleType | null) => void
  registerModule: (module: ModuleType) => void
  unregisterModule: (module: ModuleType) => void
}

export const ModuleRegistryContext = createContext<ModuleRegistryContextType | null>(null)

interface ModuleRegistryProviderProps {
  children: ReactNode
}

export function ModuleRegistryProvider({ children }: ModuleRegistryProviderProps) {
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null)
  const [registeredModules, setRegisteredModules] = useState<Set<ModuleType>>(new Set())

  const registerModule = useCallback((module: ModuleType) => {
    setRegisteredModules(prev => new Set(prev).add(module))
  }, [])

  const unregisterModule = useCallback((module: ModuleType) => {
    setRegisteredModules(prev => {
      const next = new Set(prev)
      next.delete(module)
      return next
    })
  }, [])

  return (
    <ModuleRegistryContext.Provider 
      value={{
        activeModule,
        setActiveModule,
        registerModule,
        unregisterModule
      }}
    >
      {children}
    </ModuleRegistryContext.Provider>
  )
} 