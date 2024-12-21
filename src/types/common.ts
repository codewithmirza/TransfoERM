export type TimeframeType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'last-30-days'

export type DataStatus = 'loading' | 'error' | 'success' | 'idle'

export interface BaseResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    timestamp: number
    processingTime?: number
    source?: string
  }
}

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResult<T> extends BaseResponse<T[]> {
  pagination: {
    total: number
    pages: number
    current: number
    hasMore: boolean
  }
} 