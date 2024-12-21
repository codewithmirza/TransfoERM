export function BillingOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Billing Overview</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Outstanding Invoices</span>
          <span className="font-medium">$12,500</span>
        </div>
        <div className="flex justify-between">
          <span>Overdue Payments</span>
          <span className="font-medium text-red-500">$3,200</span>
        </div>
        <div className="flex justify-between">
          <span>Paid This Month</span>
          <span className="font-medium text-green-500">$45,800</span>
        </div>
      </div>
    </div>
  )
} 