'use client'

import { useInventoryModule } from '@/hooks/useInventoryModule'
import { StockList } from '@/components/inventory/StockList'
import { OrdersList } from '@/components/inventory/OrdersList'
import { SupplierList } from '@/components/inventory/SupplierList'
import { AIInsights } from '@/components/shared/AIInsights'
import { StockAlerts } from '@/components/inventory/StockAlerts'
import { StatCard } from '@/components/shared/StatCard'
import { StockManagement } from './StockManagement'
import { InventoryVisualization } from './InventoryVisualization'

export function InventoryDashboard() {
  const { 
    stockItems, 
    loading, 
    error,
    inventoryModule 
  } = useInventoryModule()

  if (!inventoryModule) {
    return <div>Loading module...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const totalValue = stockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const lowStockItems = stockItems.filter(item => item.quantity <= (item.reorderPoint || 0))

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={stockItems.length} />
        <StatCard title="Low Stock" value={lowStockItems.length} status="warning" />
        <StatCard title="Pending Orders" value="3" status="info" />
        <StatCard title="Stock Value" value={`$${totalValue.toLocaleString()}`} status="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockList items={stockItems} loading={loading} />
          <div className="mt-6">
            <InventoryVisualization />
          </div>
        </div>
        <div>
          <AIInsights module="inventory" />
          <StockAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrdersList />
        <SupplierList />
      </div>

      <StockManagement />
    </div>
  )
} 