'use client'

import { createContext, useContext, useState } from 'react'
import type { InventoryItem, Workflow, Transaction } from '@/types'

// Add initial demo data
const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Demo Product',
    quantity: 100,
    category: 'Electronics',
    price: 299.99,
    status: 'in-stock'
  }
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    description: 'Product Sale',
    amount: 299.99,
    date: new Date().toISOString(),
    category: 'Sales'
  }
]

const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Demo Workflow',
    description: 'Automated inventory check',
    status: 'active',
    lastRun: 'Just now',
    org_id: 'demo',
    config: { steps: [] },
    created_by: 'demo@user.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

interface DataContextType {
  inventory: InventoryItem[]
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  workflows: Workflow[]
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

const DataContext = createContext<DataContextType>({} as DataContextType)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item])
  }

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item } : i))
  }

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id))
  }

  const addWorkflow = (workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow])
  }

  const updateWorkflow = (id: string, workflow: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...workflow } : w))
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id))
  }

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction])
  }

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transaction } : t))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return (
    <DataContext.Provider value={{
      inventory,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      workflows,
      addWorkflow,
      updateWorkflow,
      deleteWorkflow,
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext) 