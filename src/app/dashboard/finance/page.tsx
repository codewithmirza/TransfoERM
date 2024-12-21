'use client'

import { useState, useEffect } from 'react'
import { TransactionList } from '@/components/finance/TransactionList'
import { AIInsights } from '@/components/ai/AIInsights'
import { Transaction } from '@/types/finance'

interface TransactionResponse {
  transactions: Transaction[];
}

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/finance/transactions')
        const data = await response.json() as TransactionResponse
        setTransactions(data.transactions)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <TransactionList 
          transactions={transactions} 
          loading={loading}
        />
        <AIInsights 
          module="finance" 
          data={{ transactions }} 
        />
      </div>
    </div>
  )
}
