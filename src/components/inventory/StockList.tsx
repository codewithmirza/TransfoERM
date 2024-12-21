'use client'

import { StockItem } from '@/types/inventory'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Edit, Trash, Package, AlertTriangle } from 'lucide-react'

interface StockListProps {
  items: StockItem[]
  loading?: boolean
}

export function StockList({ items, loading }: StockListProps) {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  if (loading) {
    return <div className="animate-pulse">Loading stock items...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Stock Items</h2>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td className="flex items-center">
                {item.quantity}
                {item.quantity <= (item.reorderPoint || 0) && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 ml-2" />
                )}
              </td>
              <td>${item.price}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
} 