'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import type { InventoryItem } from '@/types'

interface AddItemModalProps {
  onClose: () => void
  onAdd: (item: InventoryItem) => void
}

export function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    price: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      id: Date.now().toString(),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      status: 'in-stock'
    } as InventoryItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-black/40 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Item</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Item Name</label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/5 border-white/10"
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-white/60 mb-2 block">Quantity</label>
            <Input 
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Category</label>
            <Input 
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Price</label>
            <Input 
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="bg-white/5 border-white/10"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Add Item</Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 