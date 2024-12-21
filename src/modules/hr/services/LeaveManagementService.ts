import type { LeaveRequest } from '@/types/hr'
import { DataSyncEngine } from '@/lib/sync/DataSyncEngine'
import { WorkflowEngineProvider } from '@/lib/workflow/WorkflowEngineProvider'
import { RealtimeService } from '@/lib/realtime/RealtimeService'
import { WorkflowFactory } from '@/lib/workflow/WorkflowFactory'
import { AIEngine } from '@/lib/ai/AIEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'

export class LeaveManagementService {
  private syncEngine: DataSyncEngine
  private workflowEngine = WorkflowEngineProvider.getInstance()
  private realtimeService: RealtimeService
  private leaveRequests: Map<string, LeaveRequest>
  private aiEngine: AIEngine
  private errorHandler: ErrorHandler

  constructor() {
    this.syncEngine = new DataSyncEngine()
    this.realtimeService = RealtimeService.getInstance()
    this.leaveRequests = new Map()
    this.aiEngine = AIEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  async initialize(): Promise<void> {
    // Set up realtime handlers
    this.realtimeService.on('leave:update', this.handleLeaveUpdate.bind(this))
    
    // Load initial data
    await this.loadInitialData()
    
    // Set up workflows
    await this.setupWorkflows()
  }

  private async loadInitialData(): Promise<void> {
    try {
      const response = await fetch('/api/hr/leave-requests')
      const data = await response.json()
      if (Array.isArray(data)) {
        data.forEach(request => {
          this.leaveRequests.set(request.id, request)
        })
      }
    } catch (error) {
      console.error('Failed to load leave requests:', error)
    }
  }

  private async setupWorkflows(): Promise<void> {
    const workflow = WorkflowFactory.createWorkflow({
      name: 'Leave Request Processing',
      version: 1,
      triggers: [{
        type: 'event' as const,
        config: { eventType: 'leave:request' }
      }],
      steps: [
        {
          id: crypto.randomUUID(),
          name: 'Manager Approval',
          type: 'action' as const,
          config: {
            action: 'approveLeave',
            context: {
              assignee: 'manager',
              timeoutHours: 48
            }
          }
        },
        {
          id: crypto.randomUUID(),
          name: 'HR Review',
          type: 'action' as const,
          config: {
            action: 'reviewLeave',
            context: {
              assignee: 'hr',
              timeoutHours: 24
            }
          }
        },
        {
          id: crypto.randomUUID(),
          name: 'Send Notification',
          type: 'action' as const,
          config: {
            action: 'sendNotification',
            context: {
              template: 'leave-request-status'
            }
          }
        }
      ]
    })

    await this.workflowEngine.registerWorkflow(workflow)
  }

  private async handleLeaveUpdate(message: any): Promise<void> {
    const { leaveId, update } = message.payload
    const request = this.leaveRequests.get(leaveId)
    if (request) {
      this.leaveRequests.set(leaveId, { ...request, ...update })
      await this.syncEngine.syncData('leave-requests', Array.from(this.leaveRequests.values()))
    }
  }

  async submitLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> {
    const newRequest: LeaveRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.leaveRequests.set(newRequest.id, newRequest)
    await this.syncEngine.syncData('leave-requests', Array.from(this.leaveRequests.values()))

    // Start approval workflow
    await this.workflowEngine.startWorkflow({
      id: crypto.randomUUID(),
      name: 'Leave Request Process',
      version: 1,
      triggers: [{
        type: 'event',
        config: { eventType: 'leave:submitted' }
      }],
      steps: [
        {
          id: 'process-request',
          type: 'action',
          name: 'Process Request',
          config: {
            action: 'processLeaveRequest',
            context: {
              leaveRequest: newRequest,
              employeeId: newRequest.employeeId
            }
          }
        }
      ],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Notify relevant parties
    await this.realtimeService.broadcast({
      type: 'leave:created',
      payload: newRequest,
      userId: 'system',
      timestamp: Date.now()
    })

    return newRequest
  }

  async updateLeaveRequest(id: string, update: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const request = this.leaveRequests.get(id)
    if (!request) {
      throw new Error('Leave request not found')
    }

    const updatedRequest = {
      ...request,
      ...update,
      updatedAt: new Date()
    }

    this.leaveRequests.set(id, updatedRequest)
    await this.syncEngine.syncData('leave-requests', Array.from(this.leaveRequests.values()))

    await this.realtimeService.broadcast({
      type: 'leave:updated',
      payload: updatedRequest,
      userId: 'system',
      timestamp: Date.now()
    })

    return updatedRequest
  }

  async getLeaveRequest(id: string): Promise<LeaveRequest | null> {
    return this.leaveRequests.get(id) || null
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values())
  }

  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values())
      .filter(request => request.employeeId === employeeId)
  }

  async cancelLeaveRequest(id: string): Promise<void> {
    const request = this.leaveRequests.get(id)
    if (!request) {
      throw new Error('Leave request not found')
    }

    if (request.status !== 'pending') {
      throw new Error('Can only cancel pending requests')
    }

    await this.updateLeaveRequest(id, { status: 'cancelled' })
  }
} 