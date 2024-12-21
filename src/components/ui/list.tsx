'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: any[]
  renderItem?: (item: any) => React.ReactNode
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, items = [], renderItem, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {items.map((item, index) => (
          <li key={index}>
            {renderItem ? renderItem(item) : item}
          </li>
        ))}
      </ul>
    )
  }
)
List.displayName = 'List'

export { List } 