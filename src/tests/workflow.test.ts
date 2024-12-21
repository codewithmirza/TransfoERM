import { describe, it, expect, beforeEach } from 'vitest'
import { WorkflowEngine } from '../lib/workflow/WorkflowEngine'
import type { WorkflowDefinition } from '../types/workflow'

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine

  beforeEach(() => {
    engine = WorkflowEngine.getInstance()
  })

  it('should register a valid workflow', async () => {
    const workflow: WorkflowDefinition = {
      id: 'test-workflow',
      name: 'Test Workflow',
      version: '1.0',
      steps: [
        {
          id: 'step1',
          type: 'task',
          action: 'logMessage',
          params: { message: 'Hello' }
        }
      ]
    }

    await expect(engine.registerWorkflow(workflow)).resolves.not.toThrow()
  })

  it('should execute a simple workflow', async () => {
    const workflow: WorkflowDefinition = {
      id: 'test-workflow',
      name: 'Test Workflow',
      version: '1.0',
      steps: [
        {
          id: 'step1',
          type: 'task',
          action: 'logMessage',
          params: { message: 'Hello' }
        }
      ]
    }

    await engine.registerWorkflow(workflow)
    const instanceId = await engine.startWorkflow('test-workflow')
    expect(instanceId).toBeDefined()
  })
}) 