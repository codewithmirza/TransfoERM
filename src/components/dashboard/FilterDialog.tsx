'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomerFilter, CustomerStatus } from '@/types/crm'

interface FilterDialogProps {
  open: boolean
  onClose: () => void
  onApplyFilters: (filters: CustomerFilter) => void
  currentFilters?: CustomerFilter
}

export function FilterDialog({ open, onClose, onApplyFilters, currentFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<CustomerFilter>(() => ({
    status: currentFilters?.status,
    minValue: currentFilters?.minValue,
    maxValue: currentFilters?.maxValue,
    search: currentFilters?.search,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters(filters)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Customers</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value: string) =>
                setFilters((prev) => ({ ...prev, status: (value as CustomerStatus) || undefined }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">Min Value</Label>
              <Input
                id="minValue"
                type="number"
                value={filters.minValue || ''}
                onChange={(e) => setFilters({ ...filters, minValue: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxValue">Max Value</Label>
              <Input
                id="maxValue"
                type="number"
                value={filters.maxValue || ''}
                onChange={(e) => setFilters({ ...filters, maxValue: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
