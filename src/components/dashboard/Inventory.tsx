'use client'

import { Card } from '@/components/ui/card'
import { Package, PackagePlus, PackageMinus, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Inventory() {
  const inventoryStats = [
    {
      title: 'Total Items',
      value: '1,234',
      change: '+12 today',
      icon: Package,
    },
    {
      title: 'Low Stock Items',
      value: '28',
      change: 'Needs attention',
      icon: AlertTriangle,
    },
    {
      title: 'Incoming',
      value: '45',
      change: 'In transit',
      icon: PackagePlus,
    },
    {
      title: 'Outgoing',
      value: '32',
      change: 'Processing',
      icon: PackageMinus,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
        <Button className="bg-teal-600 hover:bg-teal-700">Add New Item</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-teal-600">{stat.change}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <stat.icon className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory List</h3>
        <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Inventory Table Placeholder</p>
        </div>
      </Card>
    </div>
  )
}
