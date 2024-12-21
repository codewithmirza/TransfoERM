import { AIEnhancedChart } from '@/components/charts/AIEnhancedChart'

export function FinanceDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Other components */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIEnhancedChart
          moduleId="finance-revenue"
          dataType="finance"
          timeframe="monthly"
          enablePredictions={true}
        />
        
        <AIEnhancedChart
          moduleId="finance-expenses"
          dataType="finance"
          timeframe="monthly"
          enablePredictions={true}
        />
      </div>
      
      {/* Other components */}
    </div>
  )
} 