import { StockItem } from '@/types/inventory'
import { AIEngine } from '@/lib/ai/AIEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'
import { Env, D1Database } from '@/types/env'

export class StockManagementService {
  private aiEngine: AIEngine
  private errorHandler: ErrorHandler
  private db: D1Database

  constructor(env: Env) {
    this.db = env.DB
    this.aiEngine = AIEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  async getAllStockItems(): Promise<StockItem[]> {
    try {
      const items = await this.db.prepare(
        'SELECT * FROM stock_items ORDER BY created_at DESC'
      ).all<StockItem>()
      
      return items
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async addStockItem(item: Omit<StockItem, 'id'>): Promise<StockItem> {
    try {
      const id = crypto.randomUUID()
      
      await this.db.prepare(`
        INSERT INTO stock_items (
          id, name, description, quantity, price, category, 
          sku, unit, reorder_point, reorder_quantity, location, 
          supplier, cost, status, metadata, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, ?, 
          ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `).bind(
        id,
        item.name,
        item.description,
        item.quantity,
        item.price,
        item.category,
        item.sku,
        item.unit,
        item.reorderPoint,
        item.reorderQuantity,
        item.location,
        item.supplier,
        item.cost,
        item.status || 'in_stock',
        JSON.stringify(item.metadata || {})
      ).run()

      // Get the inserted item
      const items = await this.db.prepare(
        'SELECT * FROM stock_items WHERE id = ?'
      ).bind(id).all<StockItem>()

      if (!items.length) {
        throw new Error('Failed to retrieve inserted item')
      }

      const newItem = items[0]

      // Use AI to analyze stock levels and make recommendations
      const analysis = await this.aiEngine.analyzeCode(JSON.stringify({
        type: 'stock_analysis',
        item: newItem
      }))

      // Update metadata with AI insights
      if (analysis.confidence > 0.8) {
        await this.db.prepare(`
          UPDATE stock_items 
          SET metadata = json_set(
            COALESCE(metadata, '{}'), 
            '$.aiInsights', 
            ?
          )
          WHERE id = ?
        `).bind(
          JSON.stringify(analysis.content),
          id
        ).run()
      }

      return newItem
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async initialize(): Promise<void> {
    // Any initialization logic
  }
} 