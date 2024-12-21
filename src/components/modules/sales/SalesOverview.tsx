'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DollarSign,
  ShoppingCart,
  Users as CustomersIcon,
  TrendingUp,
  Plus,
  FileText,
  RefreshCw,
  Star,
  Clock
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface SalesStats {
  totalSales: number
  monthlyRevenue: number
  activeCustomers: number
  recentSales: {
    id: string
    customer: string
    amount: number
    items: number
    status: 'pending' | 'completed' | 'cancelled'
    date: string
  }[]
  topCustomers: {
    id: string
    name: string
    totalPurchases: number
    totalSpent: number
    lastPurchase: string
  }[]
  performanceMetrics: {
    period: string
    revenue: number
    orders: number
    averageOrderValue: number
    growth: number
  }[]
}

export function SalesOverview() {
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    monthlyRevenue: 0,
    activeCustomers: 0,
    recentSales: [],
    topCustomers: [],
    performanceMetrics: []
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSalesStats()
  }, [])

  const fetchSalesStats = async () => {
    try {
      const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/sales/summary')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalSales: data.totalSales || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
          activeCustomers: data.activeCustomers || 0,
          recentSales: data.recentSales || [],
          topCustomers: data.topCustomers || [],
          performanceMetrics: data.performanceMetrics || []
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sales statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold">{stats.totalSales}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <h3 className="text-2xl font-bold">{stats.activeCustomers}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CustomersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Recent Sales */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
          <Button variant="ghost" size="sm" onClick={fetchSalesStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-4">
          {stats.recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{sale.customer}</p>
                <p className="text-sm text-gray-500">
                  {sale.items} items • {new Date(sale.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  sale.status === 'completed' ? 'bg-green-100 text-green-700' :
                  sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                </span>
                <span className="font-medium">${sale.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Customers */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Top Customers</h3>
        </div>
        <div className="space-y-4">
          {stats.topCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">
                  {customer.totalPurchases} orders • Last purchase: {new Date(customer.lastPurchase).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${customer.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total spent</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </div>
        <div className="space-y-4">
          {stats.performanceMetrics.map((metric) => (
            <div key={metric.period} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{metric.period}</p>
                <p className="text-sm text-gray-500">
                  {metric.orders} orders • Avg. ${metric.averageOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${metric.revenue.toLocaleString()}</p>
                <p className={`text-sm ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.growth >= 0 ? '+' : ''}{metric.growth}% growth
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 