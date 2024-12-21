'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WidgetProps } from '@/types/widget'

export function StatsWidget({ widget }: WidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{widget.config.value}</div>
        <p className="text-xs text-muted-foreground">{widget.config.description}</p>
      </CardContent>
    </Card>
  )
}
