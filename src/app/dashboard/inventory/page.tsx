'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus } from 'lucide-react'
import { InventoryTable, InventoryStats, AddItemModal } from '@/components/inventory'
import { AIInsights } from '@/components/shared/AIInsights'
import { useData } from '@/contexts/DataContext'
import type { InventoryItem } from '@/types'

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { addInventoryItem, inventory = [] } = useData()

  const handleAddItem = (item: InventoryItem) => {
    addInventoryItem(item)
    setShowAddModal(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <InventoryStats />
      
      <div className="grid md:grid-cols-2 gap-6">
        <InventoryTable />
        <AIInsights module="inventory" data={{ inventory }} />
      </div>

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  )
}
