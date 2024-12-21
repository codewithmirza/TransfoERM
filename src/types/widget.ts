export interface Widget {
  id: string
  type: 'chart' | 'stats' | 'list' | 'alerts'
  title: string
  size: 'small' | 'medium' | 'large'
  position: number
  config: any
}

export interface WidgetProps {
  widget: Widget
  onEdit?: () => void
  onDelete?: () => void
  onResize?: (size: Widget['size']) => void
}
