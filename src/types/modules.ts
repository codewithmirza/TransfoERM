import type { Env } from '@/types/env'

// Core module types
export type ModuleType = 'finance' | 'inventory' | 'hr' | 'sales' | 'custom'

export interface ModuleConfig {
  type: ModuleType
  name: string
  version: string
  settings?: Record<string, any>
}

// Shared types for all modules
export interface BaseRecord {
  id: string
  created_at: string
  updated_at?: string
  created_by?: string
}

// Finance Module Types
export interface FinancialTransaction extends BaseRecord {
  type: 'income' | 'expense' | 'investment'
  amount: number
  category: string
  description?: string
  date: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface Budget extends BaseRecord {
  category: string
  amount: number
  spent: number
  start_date: string
  end_date: string
}

// Inventory Module Types
export interface InventoryItem extends BaseRecord {
  name: string
  sku: string
  quantity: number
  reorder_point: number
  category: string
  location: string
  unit_price: number
  supplier_id?: string
  last_ordered_date?: string
}

export interface InventoryMovement extends BaseRecord {
  item_id: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reference_number?: string
  notes?: string
}

// HR Module Types
export interface Employee extends BaseRecord {
  user_id: string
  department: string
  position: string
  status: 'active' | 'inactive' | 'on_leave'
  salary: number
  hire_date: string
  last_review?: string
  next_review?: string
  manager_id?: string
}

export interface LeaveRequest extends BaseRecord {
  employee_id: string
  type: 'vacation' | 'sick' | 'personal' | 'other'
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  approved_by?: string
}

// Sales Module Types
export interface Sale extends BaseRecord {
  customer_id: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded'
  payment_method?: string
  notes?: string
}

export interface SaleItem extends BaseRecord {
  sale_id: string
  item_id: string
  quantity: number
  unit_price: number
  discount_amount: number
}

export interface Customer extends BaseRecord {
  name: string
  email: string
  company: string
  status: 'active' | 'inactive' | 'pending'
  type: 'retail' | 'wholesale' | 'distributor'
  credit_limit?: number
}

// Response Types
export interface ModuleResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface SummaryResponse {
  success: boolean
  data: {
    stats: Record<string, number>
    recent: any[]
    [key: string]: any
  }
  error?: string
}

// Database Result Types
export interface D1QueryResult<T = any> {
  results?: T[]
  success: boolean
  error?: string
}

export interface D1Row {
  [key: string]: any
}

// Cache Types
export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
}

export interface ModuleDataField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  validation?: {
    pattern?: string
    min?: number
    max?: number
    custom?: string
  }
}

export interface ModuleInteraction {
  type: 'click' | 'input' | 'submit' | 'hover'
  target: string
  action: string
  params?: Record<string, any>
}

export interface CustomizationRequest {
  moduleType: ModuleType
  industry: string
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  requirements: string[]
  compliance?: string[]
  integrations?: string[]
  type: 'style' | 'behavior' | 'layout'
  target: string
  value: any
}

export interface ModuleData {
  id: string
  type: string
  data: any
  metadata: {
    created: Date
    updated: Date
    version: string
    status: 'active' | 'archived' | 'draft'
  }
}

export interface ModuleAction {
  type: string
  payload: any
  metadata: {
    userId: string
    timestamp: Date
    source: 'user' | 'system' | 'automation'
  }
}

export interface BaseModuleState {
  data: ModuleData[]
  loading: boolean
  error: Error | null
  lastUpdate: Date
  customizations: CustomizationRequest[]
}

export interface ModuleState {
  initialized: boolean
  status: 'active' | 'inactive' | 'error'
  error: Error | null
  lastUpdate: Date
}

export interface Module {
  id: string
  name: string
  type: 'finance' | 'hr' | 'inventory' | 'sales' | 'custom'
  description: string
  status: 'active' | 'inactive' | 'error'
  version: string
  features: string[]
  customizations?: Record<string, any>
  metadata: {
    created: Date
    updated: Date
    lastActive?: Date
  }
}

export interface AnalyticsResult {
  metrics: {
    performance: {
      responseTime: number
      throughput: number
      errorRate: number
    }
    usage: {
      activeUsers: number
      transactions: number
      storage: number
    }
    custom: Record<string, number>
  }
  trends: Array<{
    metric: string
    value: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }>
  alerts: Array<{
    level: 'info' | 'warning' | 'critical'
    message: string
    timestamp: Date
    context?: Record<string, any>
  }>
}

export interface ModuleHandler {
  id: string
  type: ModuleType
  initialize(): Promise<void>
  handleAction(action: string, payload?: any): Promise<void>
  getCode(): Promise<string>
}

export interface ModuleMetadata {
  id: string
  name: string
  version: string
  description?: string
  dependencies?: string[]
  permissions?: string[]
}

export abstract class Module {
  protected config: ModuleConfig

  constructor(config: ModuleConfig) {
    this.config = config
  }

  abstract initialize(): Promise<void>
  abstract destroy(): Promise<void>
}

export interface ModuleDataStructure {
  name: string
  type: string
  fields: ModuleDataField[]
  relations?: {
    model: string
    type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany'
  }[]
}

export interface ModuleMetrics {
  type: ModuleType
  metrics: string[]
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'
} 