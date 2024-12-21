import { performance } from 'perf_hooks'
import { WorkflowEngine } from '@/lib/workflow/WorkflowEngine'
import { ProcessMiningEngine } from '@/lib/process/ProcessMiningEngine'
import { AIEngine } from '@/lib/ai/AIEngine'

export async function runLoadTest() {
  const results = {
    workflow: await testWorkflowPerformance(),
    processMining: await testProcessMiningPerformance(),
    ai: await testAIPerformance()
  }

  console.table(results)
}

async function testWorkflowPerformance() {
  const engine = WorkflowEngine.getInstance()
  const startTime = performance.now()
  
  // Run 1000 parallel workflows
  await Promise.all(
    Array(1000).fill(0).map(() => engine.startWorkflow('test-workflow'))
  )

  return {
    operation: 'Workflow Execution',
    duration: performance.now() - startTime,
    throughput: '1000 workflows'
  }
}

async function testProcessMiningPerformance() {
  const engine = ProcessMiningEngine.getInstance()
  const startTime = performance.now()

  // Generate test events
  const events = Array(1000).fill(0).map((_, i) => ({
    id: `event-${i}`,
    type: 'process-event',
    timestamp: new Date(),
    activity: 'test-activity',
    resource: 'test-resource',
    case: `case-${Math.floor(i / 10)}`,
    attributes: {}
  }))

  await engine.discoverProcess(events)

  return {
    operation: 'Process Mining',
    duration: performance.now() - startTime,
    throughput: '1000 events'
  }
}

async function testAIPerformance() {
  const engine = AIEngine.getInstance()
  const startTime = performance.now()

  // Run 100 parallel code analyses
  const testCode = 'function test() { return true; }'
  await Promise.all(
    Array(100).fill(0).map(() => engine.analyzeCode(testCode))
  )

  return {
    operation: 'AI Analysis',
    duration: performance.now() - startTime,
    throughput: '100 analyses'
  }
}