export interface MetricData {
  name: string
  value: number
  timestamp: Date
  metadata?: Record<string, any>
} 