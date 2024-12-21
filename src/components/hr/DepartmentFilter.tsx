'use client'

import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

interface DepartmentFilterProps {
  selected: string | null
  onChange: (department: string | null) => void
}

export function DepartmentFilter({ selected, onChange }: DepartmentFilterProps) {
  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ]

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selected || ''}
        onValueChange={value => onChange(value || null)}
      >
        <option value="">All Departments</option>
        {departments.map(dept => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))}
      </Select>
      {selected && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(null)}
          className="hover:bg-red-500/10 hover:text-red-500"
        >
          <Filter className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
} 