export interface StockItemMetadata {
  dimensions?: {
    width: number
    height: number
    depth: number
    unit: string
  }
  weight?: {
    value: number
    unit: string
  }
  customFields?: Record<string, any>
  aiRecommendations?: {
    insights: string[]
    optimizations: {
      reorderPoint?: number
      reorderQuantity?: number
      storageLocation?: string
    }
  }
  lastAnalysis?: string
  lastUpdated?: string
}

export interface StockItem {
  id: string
  name: string
  description?: string
  quantity: number
  price: number
  category: string
  sku: string
  unit: string
  reorderPoint: number
  reorderQuantity: number
  location: string
  supplier?: string
  cost?: number
  status?: 'in_stock' | 'out_of_stock' | 'low_stock'
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface StockMovement {
  id: string
  itemId: string
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment'
  quantity: number
  fromLocation?: string
  toLocation?: string
  reference: string
  reason?: string
  performedBy: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled'
  items: PurchaseOrderItem[]
  totalAmount: number
  currency: string
  orderDate: Date
  expectedDeliveryDate: Date
  actualDeliveryDate?: Date
  terms?: string
  notes?: string
  approvedBy?: string
  metadata?: Record<string, any>
}

export interface PurchaseOrderItem {
  id: string
  itemId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  receivedQuantity?: number
  status: 'pending' | 'partial' | 'complete' | 'cancelled'
}

export interface Supplier {
  id: string
  name: string
  code: string
  status: 'active' | 'inactive' | 'pending' | 'blacklisted'
  contacts: SupplierContact[]
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  rating: {
    score: number
    lastUpdated: string
    metrics: Record<string, any>
  }
  paymentTerms: {
    type: 'prepaid' | 'net30' | 'net60' | 'net90'
    discount?: {
      percentage: number
      days: number
    }
  }
  metadata?: {
    aiInsights?: string[]
    riskAssessment?: {
      level: 'low' | 'medium' | 'high'
      factors: string[]
    }
    lastAnalysis?: string
    statusLastUpdated?: string
  }
}

export interface SupplierContact {
  id: string
  name: string
  role: string
  email: string
  phone: string
  primary: boolean
}

export interface SupplierRating {
  score: number
  lastUpdated: string
  metrics: {
    deliveryTime?: number
    quality?: number
    communication?: number
    priceCompetitiveness?: number
    reliability?: number
  }
}

export interface InventoryAdjustment {
  id: string
  itemId: string
  quantity: number
  reason: string
  notes?: string
  performedBy: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface InventoryCount {
  id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  startDate: Date
  endDate?: Date
  location: string
  items: InventoryCountItem[]
  performedBy: string[]
  notes?: string
  metadata?: Record<string, any>
}

export interface InventoryCountItem {
  itemId: string
  expectedQuantity: number
  actualQuantity: number
  discrepancy: number
  notes?: string
  countedBy: string
  timestamp: Date
}

export interface InventoryAlert {
  id: string
  type: 'low_stock' | 'overstock' | 'expiring' | 'price_change'
  itemId: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved'
  createdAt: Date
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolvedBy?: string
  resolvedAt?: Date
  metadata?: Record<string, any>
}

export interface Order {
  id: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt: Date
  metadata?: {
    aiRecommendations?: string[]
    optimizationScore?: number
    lastAnalysis?: string
  }
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
}

export interface StockManagementState {
  stockItems: StockItem[]
  loading: boolean
  error: string | null
} 