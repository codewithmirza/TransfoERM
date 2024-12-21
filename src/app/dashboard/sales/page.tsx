'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SalesAI } from '@/components/ai/SalesAI'
import { RecentSales, SalesMetrics } from '@/components/dashboard'
import { useToast } from '@/components/ui/use-toast'

interface SalesData {
  sales: any[]
  items: any[]
  customers: any[]
}

export default function SalesPage() {
  const [data, setData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch('/api/sales/metrics')
        if (!response.ok) {
          throw new Error('Failed to fetch sales data')
        }
        const salesData = await response.json() as SalesData
        setData(salesData)
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load sales data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [toast])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data && <SalesMetrics data={data} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data && (
          <Card className="col-span-2">
            <RecentSales data={data.sales} />
          </Card>
        )}
        
        {data && (
          <Card className="lg:col-span-2">
            <SalesAI />
          </Card>
        )}
      </div>
    </div>
  )
} 