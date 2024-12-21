'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Package, TrendingUp } from 'lucide-react'

interface SalesData {
  sales: any[]
  items: any[]
  customers: any[]
}

interface SalesMetricsProps {
  data: SalesData
}

export function SalesMetrics({ data }: SalesMetricsProps) {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: 20.1,
      trending: "up"
    },
    {
      title: "New Customers",
      value: data.customers?.length.toString() || "0",
      icon: Users,
      change: 10.5,
      trending: "up"
    },
    {
      title: "Active Products",
      value: data.items?.length.toString() || "0",
      icon: Package,
      change: 5.2,
      trending: "up"
    },
    {
      title: "Sales Growth",
      value: "12.5%",
      icon: TrendingUp,
      change: 12.5,
      trending: "up"
    }
  ]

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.trending === "up" ? (
                <ArrowUpRight className="inline h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="inline h-4 w-4 text-red-500" />
              )}
              <span className={metric.trending === "up" ? "text-green-500" : "text-red-500"}>
                {metric.change}%
              </span>
              {" "}from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
} 