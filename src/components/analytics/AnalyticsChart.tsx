'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/contexts/DataContext'

export function AnalyticsChart() {
  const { transactions = [] } = useData()

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
        <div className="h-[300px] w-full flex items-center justify-center text-white/60">
          No data available
        </div>
      </Card>
    )
  }

  // Process transactions for chart data
  const chartData = transactions.reduce((acc: any[], transaction) => {
    const date = transaction.date.split('T')[0]
    const existingDay = acc.find(d => d.date === date)
    
    if (existingDay) {
      if (transaction.type === 'income') {
        existingDay.income += transaction.amount
      } else {
        existingDay.expense += transaction.amount
      }
    } else {
      acc.push({
        date,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0
      })
    }
    
    return acc
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="date" 
              stroke="#ffffff60"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis stroke="#ffffff60" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#000000dd',
                border: '1px solid #ffffff20',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e' }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444' }}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 