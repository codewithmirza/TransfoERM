import { useModuleRegistry } from '../../hooks/useModuleRegistry'
import { ModuleLoader } from '../ui/ModuleLoader'
import { useState, useEffect } from 'react'

export function ModuleRenderer() {
  const { activeModule } = useModuleRegistry()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeModule) {
      setLoading(true)
      // Simulate module loading
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [activeModule])

  if (loading) {
    return <ModuleLoader />
  }

  if (!activeModule) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/60">Select a module to begin</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Module content will be rendered here */}
    </div>
  )
} 