'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { DollarSign, Download, Filter, Plus, Search } from 'lucide-react'
import type { PayrollInfo, Employee } from '@/types/hr'
import { useHRModule } from '@/hooks/useHRModule'

export function PayrollManagement() {
  const [payrollData, setPayrollData] = useState<PayrollInfo[]>([])
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const { employees } = useHRModule()

  useEffect(() => {
    fetchPayrollData()
  }, [selectedMonth])

  const fetchPayrollData = async () => {
    try {
      const response = await fetch(`/api/hr/payroll?month=${selectedMonth.toISOString()}`)
      const result = await response.json() as { success: boolean; data: PayrollInfo[] }
      if (result.success) {
        setPayrollData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch payroll data:', error)
    }
  }

  const calculateTotalPayroll = () => {
    return payrollData.reduce((total, record) => total + record.salary, 0)
  }

  const generatePayrollReport = async () => {
    try {
      const response = await fetch('/api/hr/payroll/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payroll-report-${selectedMonth.toISOString().slice(0, 7)}.pdf`
      a.click()
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Payroll Management</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={generatePayrollReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-purple-500 hover:bg-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-semibold">{employees.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Payroll</span>
              <span className="font-semibold">
                ${calculateTotalPayroll().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Salary</span>
              <span className="font-semibold">
                ${(calculateTotalPayroll() / employees.length || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Payroll Records</h3>
            <div className="flex gap-2">
              <Input
                type="month"
                value={selectedMonth.toISOString().slice(0, 7)}
                onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                className="w-40"
              />
              <Button variant="outline">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {payrollData.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{record.employeeId}</h4>
                    <p className="text-sm text-gray-500">
                      Base Salary: ${record.salary.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Deductions: ${record.deductions.reduce((total, d) => total + d.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Benefits: ${record.benefits.reduce((total, b) => total + b.cost, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
} 