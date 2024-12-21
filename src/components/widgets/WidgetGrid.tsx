'use client'

import { useState } from 'react'
import { Widget } from '@/types/widget'
import { StatsWidget } from './StatsWidget'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WidgetGridProps {
  widgets: Widget[]
  onAddWidget?: () => void
  onUpdateWidgets?: (widgets: Widget[]) => void
}

export function WidgetGrid({ widgets, onAddWidget, onUpdateWidgets }: WidgetGridProps) {
  const [layout, setLayout] = useState(widgets)

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'stats':
        return <StatsWidget key={widget.id} widget={widget} />
      // Add more widget types here
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dashboard Widgets</h2>
        <Button onClick={onAddWidget}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{layout.map(renderWidget)}</div>
    </div>
  )
}
