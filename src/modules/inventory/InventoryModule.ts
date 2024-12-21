import { StockManagementService } from './services/StockManagementService'
import { OrderProcessingService } from './services/OrderProcessingService'
import { SupplierManagementService } from './services/SupplierManagementService'
import { AIEngine } from '@/lib/ai/AIEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'
import { Env } from '@/types/env'

export class InventoryModule {
  private stockService: StockManagementService
  private orderService: OrderProcessingService
  private supplierService: SupplierManagementService
  private aiEngine: AIEngine
  private errorHandler: ErrorHandler

  constructor(private env: Env) {
    this.stockService = new StockManagementService(env)
    this.orderService = new OrderProcessingService(env)
    this.supplierService = new SupplierManagementService(env)
    this.aiEngine = AIEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  getServices() {
    return {
      stock: this.stockService,
      order: this.orderService,
      supplier: this.supplierService
    }
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.stockService.initialize(),
      this.orderService.initialize(),
      this.supplierService.initialize()
    ])

    await this.setupAIMonitoring()
  }

  private async setupAIMonitoring(): Promise<void> {
    const startTime = Date.now()
    await this.aiEngine.monitor({
      type: 'performance',
      target: 'inventory',
      interval: 900,
      threshold: 0.8,
      metadata: {
        model: 'gpt-3.5-turbo',
        processingTime: Date.now() - startTime,
        tokens: 0,
        metrics: ['stock_levels', 'order_processing', 'supplier_performance'],
        actions: ['reorder_suggestion', 'supplier_optimization']
      }
    })
  }

  async monitorStockLevels(): Promise<void> {
    await this.aiEngine.monitor({
      type: 'performance',
      target: 'stock_levels',
      interval: 300,
      threshold: 0.8
    })
  }
} 