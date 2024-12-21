import { AIEngine } from '@/lib/ai/AIEngine'
import { AnalyticsEngine } from '@/lib/analytics/AnalyticsEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'

export class InventoryAnalyticsService {
  private aiEngine: AIEngine
  private analyticsEngine: AnalyticsEngine
  private errorHandler: ErrorHandler

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.analyticsEngine = AnalyticsEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  async generateAdvancedAnalytics() {
    try {
      await this.analyticsEngine.startMonitoring('inventory_advanced', {
        metrics: [
          'stock_turnover',
          'inventory_aging',
          'demand_forecast',
          'stockout_risk'
        ],
        interval: 3600000, // 1 hour
        aggregation: 'avg'
      })

      const aiInsights = await this.aiEngine.analyzeCode(JSON.stringify({
        type: 'inventory_optimization',
        scope: 'advanced_analytics'
      }))

      return {
        insights: aiInsights,
        metrics: await this.analyticsEngine.generateReport([
          'stock_turnover',
          'inventory_aging'
        ])
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }
} 