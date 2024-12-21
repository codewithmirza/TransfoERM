import { useState, useEffect, useCallback } from 'react'
import type { Employee } from '@/types/hr'
import { HRModule } from '@/modules/hr/HRModule'
import { useEnv } from '@/hooks/useEnv'

export function useHRModule() {
  const env = useEnv()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const hrModule = new HRModule({
    id: 'hr',
    type: 'hr',
    name: 'HR Module',
    version: '1.0.0',
    moduleType: 'hr',
    dataStructure: [],
    customizations: [],
    env
  })

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/hr/employees')
      const result = await response.json() as { success: boolean; data: Employee[] }
      if (result.success) {
        setEmployees(result.data)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const addEmployee = useCallback(async (employee: Omit<Employee, 'id'>) => {
    try {
      const response = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      })
      const result = await response.json() as { success: boolean; data: Employee }
      if (result.success) {
        setEmployees(prev => [...prev, result.data])
        return result.data
      }
      throw new Error('Failed to add employee')
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const updateEmployee = useCallback(async (id: string, updates: Partial<Employee>) => {
    try {
      const response = await fetch(`/api/hr/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const result = await response.json() as { success: boolean; data: Employee }
      if (result.success) {
        setEmployees(prev => prev.map(emp => emp.id === id ? result.data : emp))
        return result.data
      }
      throw new Error('Failed to update employee')
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/hr/employees/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setEmployees(prev => prev.filter(emp => emp.id !== id))
      } else {
        throw new Error('Failed to delete employee')
      }
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [])

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }
} 