'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { ActionModal } from '@/components/shared/ActionModal'
import type { InventoryItem } from '@/types'

export function InventoryTable() {
  const { inventory = [], deleteInventoryItem } = useData()
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  if (!inventory || inventory.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
        <p className="text-white/60">No inventory items yet</p>
      </div>
    )
  }

  const handleDelete = () => {
    if (itemToDelete) {
      deleteInventoryItem(itemToDelete)
      setItemToDelete(null)
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-4">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Quantity</TableHead>
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Price</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id} className="border-white/10">
              <TableCell className="font-medium text-white">{item.name}</TableCell>
              <TableCell className="text-white">{item.quantity}</TableCell>
              <TableCell className="text-white">{item.category}</TableCell>
              <TableCell className="text-white">${item.price}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'low-stock' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/60 hover:text-red-400"
                    onClick={() => setItemToDelete(item.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {itemToDelete && (
        <ActionModal
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  )
} 