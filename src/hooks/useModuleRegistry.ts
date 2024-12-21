import { useContext } from 'react'
import { ModuleRegistryContext } from '../contexts/ModuleRegistryContext'

export function useModuleRegistry() {
  const context = useContext(ModuleRegistryContext)
  
  if (!context) {
    throw new Error('useModuleRegistry must be used within ModuleRegistryProvider')
  }
  
  return context
} 