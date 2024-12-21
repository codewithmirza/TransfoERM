'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import type { Workflow } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface AddWorkflowModalProps {
  onClose: () => void
  onAdd: (workflow: Workflow) => void
}

export function AddWorkflowModal({ onClose, onAdd }: AddWorkflowModalProps): JSX.Element {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    
    onAdd({
      ...formData,
      id: Date.now().toString(),
      status: 'draft',
      lastRun: 'Never',
      org_id: user?.email?.split('@')[0] || 'default-org',
      config: {
        steps: []
      },
      created_by: user?.email || 'anonymous',
      created_at: now,
      updated_at: now
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-black/40 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Create New Workflow</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Workflow Name</label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-white/60 mb-2 block">Description</label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Create Workflow</Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 