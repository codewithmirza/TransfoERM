'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Sale {
  id: string
  amount: number
  customer: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

interface RecentSalesProps {
  data: Sale[]
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${sale.customer}`} alt={sale.customer} />
                <AvatarFallback>{sale.customer.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(sale.date).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto font-medium">
                +${sale.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 