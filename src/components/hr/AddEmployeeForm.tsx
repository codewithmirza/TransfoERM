'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { MultiSelect } from '@/components/ui/multi-select'
import type { Employee } from '@/types/hr'

interface AddEmployeeFormProps {
  onSubmit: (employee: Omit<Employee, 'id'>) => Promise<void>
}

export function AddEmployeeForm({ onSubmit }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    startDate: new Date(),
    status: 'active' as const,
    manager: '',
    skills: [] as string[]
  })

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ]

  const skillOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Position"
          value={formData.position}
          onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
          required
        />
      </div>
      <div>
        <Select
          value={formData.department}
          onValueChange={value => setFormData(prev => ({ ...prev, department: value }))}
          required
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <DatePicker
          value={formData.startDate}
          onChange={date => setFormData(prev => ({ ...prev, startDate: date || new Date() }))}
          placeholder="Start Date"
          required
        />
      </div>
      <div>
        <MultiSelect
          options={skillOptions}
          value={formData.skills}
          onChange={(newSkills: string[]) => setFormData(prev => ({ ...prev, skills: newSkills }))}
          placeholder="Select Skills"
        />
      </div>
      <Button type="submit" className="w-full">Add Employee</Button>
    </form>
  )
} 