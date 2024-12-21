'use client'

import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Transaction } from '@/types/finance'

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export function TransactionList({ transactions, loading }: TransactionListProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' ? 'bg-green-500/20' :
                transaction.type === 'expense' ? 'bg-red-500/20' :
                'bg-blue-500/20'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : transaction.type === 'expense' ? (
                  <ArrowDownLeft className="w-4 h-4 text-red-500" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{transaction.description}</p>
                <p className="text-xs text-white/60">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                transaction.type === 'income' ? 'text-green-400' :
                transaction.type === 'expense' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </p>
              <p className="text-xs text-white/60">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 