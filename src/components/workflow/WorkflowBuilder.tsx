'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, ArrowRight } from 'lucide-react'
import type { Workflow, WorkflowStep } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'

interface WorkflowBuilderProps {
  onClose: () => void
}

export function WorkflowBuilder({ onClose }: WorkflowBuilderProps) {
  const { user } = useAuth()
  const { addWorkflow } = useData()
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: 'action',
      config: {}
    }
    setSteps([...steps, newStep])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    
    const workflow: Workflow = {
      ...formData,
      id: Date.now().toString(),
      status: 'draft',
      lastRun: 'Never',
      org_id: user?.email?.split('@')[0] || 'default-org',
      config: {
        steps
      },
      created_by: user?.email || 'anonymous',
      created_at: now,
      updated_at: now
    }

    addWorkflow(workflow)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl p-6 bg-black/40 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Create New Workflow</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-white">Workflow Steps</h4>
              <Button 
                type="button"
                onClick={handleAddStep}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={step.id} className="p-4 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      {index + 1}
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <div className="flex-1">
                      <Input
                        placeholder="Step name"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Create Workflow</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
