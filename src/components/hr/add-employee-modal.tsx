'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  joinDate: string
  status: 'active' | 'on-leave' | 'terminated'
}

interface AddEmployeeModalProps {
  onClose: () => void
  onAdd: (employee: Employee) => void
}

export function AddEmployeeModal({ onClose, onAdd }: AddEmployeeModalProps): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-black/40 border border-white/10">
        {/* Form implementation */}
      </Card>
    </div>
  )
} 