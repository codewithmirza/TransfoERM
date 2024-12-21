'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import type { Transaction } from '@/types'

interface AddTransactionModalProps {
  onClose: () => void
  onAdd: (transaction: Transaction) => void
}

interface TransactionFormData {
  description: string
  amount: string
  category: string
  type: Transaction['type']
}

export function AddTransactionModal({ onClose, onAdd }: AddTransactionModalProps): JSX.Element {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    category: '',
    type: 'income'
  })

  const categories = {
    income: ['Sales', 'Investment', 'Services', 'Other Income'],
    expense: ['Operations', 'Marketing', 'Payroll', 'Equipment', 'Other Expense']
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      id: Date.now().toString(),
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  const handleTypeChange = (value: Transaction['type']) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      category: ''
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-black/40 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Transaction</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Type</label>
            <Select 
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Description</label>
            <Input 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Category</label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Amount</label>
            <Input 
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              className={`${
                formData.type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Add {formData.type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 