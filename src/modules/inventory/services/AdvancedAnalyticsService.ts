import { AIEngine } from '@/lib/ai/AIEngine'
import { AnalyticsEngine } from '@/lib/analytics/AnalyticsEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'

interface InventoryInsight {
  type: 'trend' | 'anomaly' | 'recommendation'
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  metadata?: Record<string, any>
}

export class AdvancedAnalyticsService {
  private aiEngine: AIEngine
  private analyticsEngine: AnalyticsEngine
  private errorHandler: ErrorHandler

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.analyticsEngine = AnalyticsEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  async generateInsights(): Promise<InventoryInsight[]> {
    try {
      const [stockTrends, demandPatterns] = await Promise.all([
        this.analyzeStockTrends(),
        this.analyzeDemandPatterns()
      ])

      const aiAnalysis = await this.aiEngine.analyzeCode(JSON.stringify({
        type: 'inventory_insights',
        trends: stockTrends,
        patterns: demandPatterns
      }))

      return this.processAIInsights(aiAnalysis)
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  private async analyzeStockTrends() {
    return await this.analyticsEngine.generateReport([
      'stock_turnover',
      'inventory_aging',
      'stockout_frequency'
    ])
  }

  private async analyzeDemandPatterns() {
    return await this.analyticsEngine.generateReport([
      'demand_forecast',
      'seasonal_patterns',
      'customer_behavior'
    ])
  }

  private processAIInsights(aiAnalysis: any): InventoryInsight[] {
    return JSON.parse(aiAnalysis.content).map((insight: any) => ({
      type: insight.type,
      description: insight.description,
      confidence: insight.confidence,
      impact: insight.impact,
      metadata: insight.metadata
    }))
  }
} 