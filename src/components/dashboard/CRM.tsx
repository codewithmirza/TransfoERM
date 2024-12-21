'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react'
import { CustomerDialog } from './CustomerDialog'
import { FilterDialog } from './FilterDialog'
import { useToast } from '@/components/ui/use-toast'
import type { Customer, CustomerFilter, CustomerFormData } from '@/types/crm'
import type { APIResponse } from '@/types/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://transfoerm.160422733171.workers.dev'

export default function CRM() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CustomerFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | undefined>(undefined)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers({ ...filters, search: searchTerm })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, filters])

  async function fetchCustomers(filter?: CustomerFilter) {
    try {
      setLoading(true)
      const response = await fetch('/api/crm/customers?' + new URLSearchParams(filter as any))
      const data = await response.json() as APIResponse<Customer[]>

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch customers')
      }

      setCustomers(data.data || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch customers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomer = async (data: CustomerFormData) => {
    try {
      setLoading(true)

      const isEditing = !!editingCustomer
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing && editingCustomer.id
        ? `${API_BASE}/api/crm/customers/${editingCustomer.id}`
        : `${API_BASE}/api/crm/customers`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json() as APIResponse<{ customer: Customer }>
      if (!result.success) {
        throw new Error(result.error || 'Failed to save customer')
      }

      toast({
        title: isEditing ? 'Customer Updated' : 'Customer Created',
        description: `Successfully ${isEditing ? 'updated' : 'created'} customer ${data.name}`,
      })

      // Refresh the customer list
      await fetchCustomers({ ...filters, search: searchTerm })

      // Close the dialog and reset editing state
      setShowAddCustomer(false)
      setEditingCustomer(undefined)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save customer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomerDialog
      open={showAddCustomer || !!editingCustomer}
      onClose={() => {
        setShowAddCustomer(false)
        setEditingCustomer(undefined)
      }}
      customer={editingCustomer}
      onSave={handleSaveCustomer}
    />
  )
}
