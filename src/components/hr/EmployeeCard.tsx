'use client'

import { motion } from 'framer-motion'
import { Edit, Trash, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Employee } from '@/types/hr'

interface EmployeeCardProps {
  employee: Employee
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function EmployeeCard({ employee, onUpdate, onDelete }: EmployeeCardProps) {
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500'
      case 'on_leave':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const handleUpdate = async () => {
    try {
      await onUpdate(employee.id, {})
    } catch (error) {
      console.error('Failed to update employee:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(employee.id)
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            {employee.metadata?.avatar ? (
              <img
                src={employee.metadata.avatar}
                alt={employee.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">{employee.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-white/60">{employee.position}</p>
              <span className="text-white/40">•</span>
              <p className="text-sm text-white/60">{employee.department}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(employee.status)}>
            {employee.status.replace('_', ' ')}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpdate}
              className="hover:bg-white/5"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 