import { useState, useEffect } from 'react'
import { InventoryModule } from '@/modules/inventory/InventoryModule'
import { useEnv } from './useEnv'
import type { StockItem } from '@/types/inventory'

interface StockResponse {
  success: boolean
  data: StockItem[]
}

export function useInventoryModule() {
  const env = useEnv()
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const inventoryModule = new InventoryModule(env)

  useEffect(() => {
    loadStockItems()
  }, [])

  const loadStockItems = async () => {
    try {
      const items = await inventoryModule.getServices().stock.getAllStockItems()
      setStockItems(items)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const addStockItem = async (item: Omit<StockItem, 'id'>) => {
    try {
      const newItem = await inventoryModule.getServices().stock.addStockItem(item)
      setStockItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
    try {
      const response = await fetch(`/api/inventory/stock/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const result = await response.json() as { success: boolean; data: StockItem }
      if (result.success) {
        setStockItems(prev => prev.map(item => item.id === id ? result.data : item))
        return result.data
      }
      throw new Error('Failed to update stock item')
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteStockItem = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/stock/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setStockItems(prev => prev.filter(item => item.id !== id))
      } else {
        throw new Error('Failed to delete stock item')
      }
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    stockItems,
    loading,
    error,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    inventoryModule
  }
} 