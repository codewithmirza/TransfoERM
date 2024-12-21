'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { Users, Plus, Search } from 'lucide-react'
import { useHRModule } from '@/hooks/useHRModule'
import { AddEmployeeForm } from '@/components/hr/AddEmployeeForm'
import { DepartmentFilter } from '@/components/hr/DepartmentFilter'
import { EmployeeCard } from '@/components/hr/EmployeeCard'
import type { Employee } from '@/types/hr'

export function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHRModule()
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((employee: Employee) => 
        (searchQuery === '' || 
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchQuery.toLowerCase())
        ) &&
        (selectedDepartment === null || employee.department === selectedDepartment)
      )
    )
  }, [employees, searchQuery, selectedDepartment])

  const handleAddEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      await addEmployee(employee)
    } catch (error) {
      console.error('Failed to add employee:', error)
    }
  }

  const handleUpdateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      await updateEmployee(id, updates)
    } catch (error) {
      console.error('Failed to update employee:', error)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id)
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Employee Management</h2>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onSubmit={handleAddEmployee} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DepartmentFilter
            selected={selectedDepartment}
            onChange={setSelectedDepartment}
          />
        </div>

        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}