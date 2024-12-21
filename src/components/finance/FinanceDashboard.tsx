import { useFinanceModule } from '@/hooks/useFinanceModule'
import { TransactionList } from './TransactionList'
import { FinancialCharts } from './FinancialCharts'
import { BillingOverview } from './BillingOverview'
import { AIInsights } from '../shared/AIInsights'
import { StatCard } from '../shared/StatCard'

export function FinanceDashboard() {
  const { transactions, loading, error } = useFinanceModule()

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue" value="$250,000" trend="+12%" />
        <StatCard title="Expenses" value="$180,000" trend="-5%" />
        <StatCard title="Profit" value="$70,000" trend="+8%" />
        <StatCard title="Cash Flow" value="Positive" status="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialCharts />
        </div>
        <div>
          <AIInsights module="finance" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionList transactions={transactions} loading={loading} />
        <BillingOverview />
      </div>
    </div>
  )
} 