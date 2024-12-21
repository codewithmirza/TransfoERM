import type { InventoryAlert, StockItem } from './inventory'
import type { 
  StockManagementService, 
  OrderProcessingService, 
  SupplierManagementService 
} from '@/modules/inventory/services'

export interface UseInventoryModuleReturn {
  alerts: InventoryAlert[]
  updateStockItem: (item: StockItem) => Promise<void>
  stockService: StockManagementService
  orderService: OrderProcessingService
  supplierService: SupplierManagementService
} 