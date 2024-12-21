import { InventoryModule } from '@/modules/inventory/InventoryModule'
import { NextResponse } from 'next/server'
import { StockItem } from '@/types/inventory'
import { Env } from '@/types/env'

export const runtime = 'edge'

interface StockItemRequest {
  name: string
  description?: string
  quantity: number | string
  price: number | string
  category: string
  sku: string
  unit: string
  reorderPoint: number | string
  reorderQuantity: number | string
  location: string
}

// Type guard moved outside the route handler
const isValidStockItemRequest = (data: unknown): data is StockItemRequest => {
  const d = data as StockItemRequest
  return (
    typeof d?.name === 'string' &&
    (typeof d?.description === 'string' || d?.description === undefined) &&
    (typeof d?.quantity === 'number' || typeof d?.quantity === 'string') &&
    (typeof d?.price === 'number' || typeof d?.price === 'string') &&
    typeof d?.category === 'string' &&
    typeof d?.sku === 'string' &&
    typeof d?.unit === 'string' &&
    (typeof d?.reorderPoint === 'number' || typeof d?.reorderPoint === 'string') &&
    (typeof d?.reorderQuantity === 'number' || typeof d?.reorderQuantity === 'string') &&
    typeof d?.location === 'string'
  )
}

export async function GET(request: Request, { env }: { env: Env }) {
  const inventoryModule = new InventoryModule(env)
  
  try {
    await inventoryModule.initialize()
    const services = inventoryModule.getServices()
    const stocks = await services.stock.getAllStockItems()
    
    return NextResponse.json({ success: true, data: stocks })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { env }: { env: Env }) {
  const inventoryModule = new InventoryModule(env)
  
  try {
    await inventoryModule.initialize()
    const services = inventoryModule.getServices()
    const rawData = await request.json()

    if (!isValidStockItemRequest(rawData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stock item data' },
        { status: 400 }
      )
    }
    
    const stockItemData: Omit<StockItem, 'id'> = {
      name: rawData.name,
      description: rawData.description,
      quantity: Number(rawData.quantity),
      price: Number(rawData.price),
      category: rawData.category,
      sku: rawData.sku,
      unit: rawData.unit,
      reorderPoint: Number(rawData.reorderPoint),
      reorderQuantity: Number(rawData.reorderQuantity),
      location: rawData.location,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await services.stock.addStockItem(stockItemData)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add inventory item' },
      { status: 500 }
    )
  }
} 