'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Settings, Trash } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { ActionModal } from '@/components/shared/ActionModal'
import type { Workflow } from '@/types'

export function WorkflowList() {
  const { workflows = [], updateWorkflow, deleteWorkflow } = useData()
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null)

  const handleStatusToggle = (workflow: Workflow) => {
    updateWorkflow(workflow.id, {
      status: workflow.status === 'active' ? 'paused' : 'active'
    })
  }

  const handleDelete = () => {
    if (workflowToDelete) {
      deleteWorkflow(workflowToDelete)
      setWorkflowToDelete(null)
    }
  }

  if (!workflows?.length) {
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-center py-8 text-white/60">
          No workflows created yet
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{workflow.name}</h3>
              <p className="text-sm text-white/60">{workflow.description}</p>
              <p className="text-xs text-white/40 mt-2">Last run: {workflow.lastRun}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleStatusToggle(workflow)}
                className={workflow.status === 'active' ? 'text-green-400' : 'text-white/60'}
              >
                {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-white/60">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-red-400"
                onClick={() => setWorkflowToDelete(workflow.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {workflowToDelete && (
        <ActionModal
          title="Delete Workflow"
          description="Are you sure you want to delete this workflow? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setWorkflowToDelete(null)}
        />
      )}
    </div>
  )
} 