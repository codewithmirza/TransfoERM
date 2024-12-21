import { AIService } from '@/lib/ai/AIService'
import { DataSyncEngine } from '@/lib/sync/DataSyncEngine'
import type { StockItem, InventoryAlert, StockMovement } from '@/types/inventory'

export class InventoryVisualizationService {
  private aiService: AIService
  private syncEngine: DataSyncEngine
  private stockData: Map<string, StockItem>
  private movementData: Map<string, StockMovement[]>
  private historicalData: any[] = []

  constructor() {
    this.aiService = AIService.getInstance()
    this.syncEngine = new DataSyncEngine()
    this.stockData = new Map()
    this.movementData = new Map()
  }

  async initialize(): Promise<void> {
    await this.setupAIAnalytics()
    await this.loadHistoricalData()
  }

  private async setupAIAnalytics(): Promise<void> {
    await this.aiService.monitor('inventory_visualization', {
      metrics: ['stock_trends', 'movement_patterns', 'seasonal_variations'],
      actions: ['trend_detection', 'anomaly_detection', 'forecast_generation'],
      interval: '1h'
    })
  }

  async generateStockTrends(timeframe: 'day' | 'week' | 'month' | 'quarter'): Promise<any> {
    const data = Array.from(this.stockData.values())
    const movements = Array.from(this.movementData.values()).flat()

    const analysis = await this.aiService.analyze('inventory_trends', {
      stockData: data,
      movements,
      timeframe,
      type: 'trend_analysis'
    })

    return {
      trends: JSON.parse(analysis.content),
      metadata: {
        generatedAt: new Date(),
        timeframe,
        dataPoints: data.length
      }
    }
  }

  async generateInventoryDashboard(): Promise<{
    summary: any
    trends: any
    recommendations: any
  }> {
    const [summary, trends, recommendations] = await Promise.all([
      this.generateSummaryMetrics(),
      this.generateStockTrends('week'),
      this.generateAIRecommendations()
    ])

    return {
      summary,
      trends,
      recommendations
    }
  }

  private async generateSummaryMetrics(): Promise<any> {
    const data = Array.from(this.stockData.values())
    return {
      totalItems: data.length,
      totalValue: data.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      lowStockItems: data.filter(item => item.quantity <= item.reorderPoint).length,
      categories: data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }

  private async generateAIRecommendations(): Promise<any> {
    const analysis = await this.aiService.analyze('inventory_optimization', {
      stockData: Array.from(this.stockData.values()),
      movements: Array.from(this.movementData.values()).flat(),
      type: 'optimization_recommendation'
    })

    return JSON.parse(analysis.content)
  }

  async getVisualizationData(category?: string): Promise<any> {
    const items = Array.from(this.stockData.values())
    const filteredItems = category 
      ? items.filter(item => item.category === category)
      : items

    return {
      stockLevels: this.prepareStockLevelData(filteredItems),
      movements: this.prepareMovementData(filteredItems.map(item => item.id)),
      trends: await this.generateStockTrends('month')
    }
  }

  private prepareStockLevelData(items: StockItem[]): any {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      reorderPoint: item.reorderPoint,
      category: item.category,
      value: item.price * item.quantity
    }))
  }

  private prepareMovementData(itemIds: string[]): any {
    return itemIds.flatMap(id => 
      this.movementData.get(id) || []
    ).sort((a, b) => {
      const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return bTime - aTime;
    });
  }

  private async loadHistoricalData(): Promise<void> {
    try {
      const response = await fetch('/api/inventory/historical');
      const result = await response.json() as { success: boolean; data: any[] };
      if (result.success) {
        this.historicalData = result.data;
      }
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
} 