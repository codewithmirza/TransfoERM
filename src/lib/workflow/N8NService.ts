import type { Workflow, WorkflowExecution } from '@/types/workflow'

export class N8NService {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.N8N_WEBHOOK_URL!
    this.apiKey = process.env.N8N_API_KEY!
  }

  async createWorkflow(definition: Workflow): Promise<string> {
    const response = await fetch(`${this.apiUrl}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.apiKey
      },
      body: JSON.stringify(definition)
    })

    if (!response.ok) {
      throw new Error('Failed to create workflow')
    }

    const data = await response.json() as { id: string }
    return data.id
  }

  async executeWorkflow(workflowId: string, data: any): Promise<WorkflowExecution> {
    const response = await fetch(`${this.apiUrl}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.apiKey
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to execute workflow')
    }

    return await response.json() as WorkflowExecution
  }
} 