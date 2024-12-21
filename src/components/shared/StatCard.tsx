interface StatCardProps {
  title: string
  value: string | number
  status?: 'success' | 'warning' | 'danger' | 'info'
  trend?: string
}

export function StatCard({ title, value, status, trend }: StatCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'danger': return 'text-red-500'
      case 'info': return 'text-blue-500'
      default: return 'text-gray-700'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className={`text-2xl font-semibold ${getStatusColor()}`}>
          {value}
        </p>
        {trend && (
          <span className={`ml-2 text-sm ${
            trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  )
} 