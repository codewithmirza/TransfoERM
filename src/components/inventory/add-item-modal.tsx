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

export function AddItemModal({ onClose, onAdd }: AddItemModalProps): JSX.Element {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Rest of the JSX */}
    </div>
  )
} 