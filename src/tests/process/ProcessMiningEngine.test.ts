import { describe, it, expect, beforeEach } from 'vitest'
import { ProcessMiningEngine } from '@/lib/process/ProcessMiningEngine'
import type { ProcessEvent } from '@/types/process'

describe('ProcessMiningEngine', () => {
  let engine: ProcessMiningEngine

  beforeEach(() => {
    engine = ProcessMiningEngine.getInstance()
  })

  it('should discover process from events', async () => {
    const events: ProcessEvent[] = [
      {
        id: '1',
        type: 'start',
        timestamp: new Date(),
        activity: 'receive_order',
        resource: 'system',
        case: 'order-123',
        attributes: {}
      },
      {
        id: '2',
        type: 'activity',
        timestamp: new Date(),
        activity: 'verify_payment',
        resource: 'payment-service',
        case: 'order-123',
        attributes: {}
      },
      {
        id: '3',
        type: 'end',
        timestamp: new Date(),
        activity: 'ship_order',
        resource: 'warehouse',
        case: 'order-123',
        attributes: {}
      }
    ]

    const model = await engine.discoverProcess(events)
    expect(model.nodes).toHaveLength(3)
    expect(model.edges).toHaveLength(2)
  })

  it('should optimize discovered process', async () => {
    const events: ProcessEvent[] = [
      // ... similar events as above
    ]

    const model = await engine.discoverProcess(events)
    const optimized = await engine.optimizeProcess(model)

    expect(optimized.metrics.throughputTime).toBeLessThan(model.metrics.throughputTime)
  })
}) 