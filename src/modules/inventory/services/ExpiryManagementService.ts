import { AIEngine } from '@/lib/ai/AIEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'
import { AnalyticsEngine } from '@/lib/analytics/AnalyticsEngine'

interface ExpiryAlert {
  id: string
  itemId: string
  batchId: string
  expiryDate: Date
  daysUntilExpiry: number
  quantity: number
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'acknowledged' | 'resolved'
  metadata?: Record<string, any>
}

export class ExpiryManagementService {
  private aiEngine: AIEngine
  private analyticsEngine: AnalyticsEngine
  private errorHandler: ErrorHandler
  private alerts: Map<string, ExpiryAlert>

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.analyticsEngine = AnalyticsEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.alerts = new Map()
  }

  async monitorExpiry(): Promise<void> {
    await this.analyticsEngine.startMonitoring('expiry_tracking', {
      metrics: ['days_until_expiry', 'expiry_risk', 'waste_prediction'],
      interval: 86400000, // Daily
      aggregation: 'min'
    })
  }

  async createAlert(data: Omit<ExpiryAlert, 'id'>): Promise<ExpiryAlert> {
    const id = crypto.randomUUID()
    const alert: ExpiryAlert = { ...data, id }

    // Use AI to analyze expiry patterns
    const aiAnalysis = await this.aiEngine.analyzeCode(JSON.stringify({
      type: 'expiry_analysis',
      data: alert
    }))

    this.alerts.set(id, {
      ...alert,
      metadata: {
        aiInsights: aiAnalysis.content,
        recommendations: aiAnalysis.metadata
      }
    })

    return alert
  }

  async getActiveAlerts(): Promise<ExpiryAlert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active')
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }
} 