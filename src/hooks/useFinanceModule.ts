import { useState, useEffect } from 'react'
import { FinanceModule } from '@/modules/finance/FinanceModule'
import { useEnv } from './useEnv'
import type { Transaction } from '@/types/finance'

interface TransactionResponse {
  success: boolean
  transactions: Transaction[]
}

export function useFinanceModule() {
  const env = useEnv()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const financeModule = new FinanceModule(env)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/finance/transactions')
      const data = await response.json() as TransactionResponse
      if (data.success) {
        setTransactions(data.transactions)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    transactions,
    loading,
    error,
    financeModule
  }
} 