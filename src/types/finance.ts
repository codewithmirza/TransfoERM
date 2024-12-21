export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  date: string
  amount: number
  description: string
  type: TransactionType
  category?: string
}

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  currency: string
  balance: number
  status: 'active' | 'inactive' | 'frozen'
  metadata?: {
    lastTransaction?: string
    riskLevel?: 'low' | 'medium' | 'high'
    aiInsights?: string[]
  }
}

export interface FinancialReport {
  type: 'balance_sheet' | 'income_statement' | 'cash_flow'
  period: 'monthly' | 'quarterly' | 'yearly'
  generatedAt: string
  data: any
  summary: {
    totalAssets?: number
    totalLiabilities?: number
    netIncome?: number
    cashFlow?: number
  }
  recommendations?: string[]
}

export interface Budget {
  id: string
  name: string
  period: 'monthly' | 'quarterly' | 'yearly'
  categories: {
    [category: string]: {
      planned: number
      actual: number
    }
  }
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'draft'
  metadata?: {
    lastUpdated?: string
    performance?: {
      overBudgetCategories?: string[]
      savingsOpportunities?: string[]
    }
  }
} 