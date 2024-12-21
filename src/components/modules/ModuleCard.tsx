import { Card, CardHeader, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import type { Module } from '@/types/modules'

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'inactive' | 'error'
  onActivate?: () => void
  onConfigure?: () => void
}

export function ModuleCard({
  title,
  description,
  icon,
  status,
  onActivate,
  onConfigure
}: ModuleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'active' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        </div>
      </div>
      <div className="mt-4 flex space-x-3">
        {onActivate && (
          <button
            onClick={onActivate}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Activate
          </button>
        )}
        {onConfigure && (
          <button
            onClick={onConfigure}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            Configure
          </button>
        )}
      </div>
    </div>
  )
} 