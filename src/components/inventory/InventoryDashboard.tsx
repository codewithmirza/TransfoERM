import { useInventoryModule } from '@/hooks/useInventoryModule'
import { StockList } from './StockList'
import { OrdersList } from './OrdersList'
import { SupplierList } from './SupplierList'
import { AIInsights } from '../shared/AIInsights'
import { StockAlerts } from './StockAlerts'
import { StatCard } from '../shared/StatCard'

export function InventoryDashboard() {
  const { 
    stockItems, 
    loading, 
    error,
    inventoryModule 
  } = useInventoryModule()

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
    </div>
  )
} 