export interface MonitoringMetric {
  id: string
  name: string
  value: number
  timestamp: Date
  type: 'gauge' | 'counter' | 'histogram'
  labels: Record<string, string>
}

export interface Alert {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  source: string
  timestamp: Date
  status: 'active' | 'acknowledged' | 'resolved'
  metadata: Record<string, any>
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastCheck: Date
  details: {
    latency: number
    uptime: number
    errors: number
  }
}

export interface MonitoringDashboard {
  id: string
  name: string
  panels: MonitoringPanel[]
  refreshInterval: number
  timeRange: {
    start: Date
    end: Date
  }
}

export interface MonitoringPanel {
  id: string
  title: string
  type: 'graph' | 'gauge' | 'table' | 'heatmap'
  metrics: string[]
  options: Record<string, any>
}

export type TimeFrame = {
  start: Date
  end: Date
} | {
  last: number
  unit: 'minutes' | 'hours' | 'days' | 'weeks'
}

export interface MetricValue {
  value: number
  timestamp: Date
  tags?: Record<string, string>
} 