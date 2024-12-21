import * as React from 'react'

export type ToastProps = {
  id?: string
  variant?: 'default' | 'destructive'
  title?: string
  description?: string
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement
