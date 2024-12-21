'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  AlertTriangle,
  Plus,
  FileText,
  RefreshCw,
  Truck,
  BarChart
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface InventoryStats {
  totalItems: number
  lowStockItems: number
  totalValue: number
  categories: {
    name: string
    itemCount: number
    stockValue: number
  }[]
  recentMovements: {
    id: string
    item: string
    type: 'in' | 'out' | 'adjustment'
    quantity: number
    date: string
  }[]
  alerts: {
    id: string
    item: string
    currentStock: number
    reorderPoint: number
  }[]
}

export function InventoryOverview() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    categories: [],
    recentMovements: [],
    alerts: []
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInventoryStats()
  }, [])

  const fetchInventoryStats = async () => {
    try {
      const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/inventory/summary')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalItems: data.totalItems || 0,
          lowStockItems: data.lowStockItems || 0,
          totalValue: data.totalValue || 0,
          categories: data.categories || [],
          recentMovements: data.recentMovements || [],
          alerts: data.alerts || []
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold">{stats.lowStockItems}</h3>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <h3 className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        <Button variant="outline">
          <Truck className="h-4 w-4 mr-2" />
          Record Movement
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Low Stock Alerts */}
      {stats.alerts.length > 0 && (
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
          </div>
          <div className="space-y-4">
            {stats.alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.item}</p>
                  <p className="text-sm text-gray-500">
                    Current Stock: {alert.currentStock} (Reorder at {alert.reorderPoint})
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Movements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Movements</h3>
          <Button variant="ghost" size="sm" onClick={fetchInventoryStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-4">
          {stats.recentMovements.map((movement) => (
            <div key={movement.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{movement.item}</p>
                <p className="text-sm text-gray-500">
                  {new Date(movement.date).toLocaleDateString()}
                </p>
              </div>
              <div className={`flex items-center gap-2 font-medium ${
                movement.type === 'in' ? 'text-green-600' : 
                movement.type === 'out' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}
                {movement.quantity}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 