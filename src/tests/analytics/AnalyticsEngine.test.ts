import { describe, it, expect, beforeEach } from 'vitest'
import { AnalyticsEngine } from '@/lib/analytics/AnalyticsEngine'
import type { TimeFrame } from '@/types/analytics'

describe('AnalyticsEngine', () => {
  let engine: AnalyticsEngine

  beforeEach(() => {
    engine = AnalyticsEngine.getInstance()
  })

  it('should track metrics', async () => {
    await engine.trackMetric('cpu_usage', 45.5, { host: 'server-1' })
    await engine.trackMetric('cpu_usage', 48.2, { host: 'server-1' })

    const report = await engine.generateReport({
      last: 5,
      unit: 'minutes'
    })

    expect(report.metrics.cpu_usage.current).toBeCloseTo(46.85, 1)
    expect(report.metrics.cpu_usage.trend).toBe('up')
  })

  it('should detect anomalies', async () => {
    // Add normal values
    for (let i = 0; i < 10; i++) {
      await engine.trackMetric('memory_usage', 50 + Math.random() * 10)
    }

    // Add anomaly
    await engine.trackMetric('memory_usage', 95)

    const anomalies = await engine.detectAnomalies()
    expect(anomalies).toHaveLength(1)
    expect(anomalies[0].severity).toBe('critical')
  })
}) 