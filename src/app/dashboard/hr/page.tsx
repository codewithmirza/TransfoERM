'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Users, Calendar, FileText, DollarSign } from 'lucide-react'
import { HRDashboard } from '@/components/hr/HRDashboard'
import { EmployeeList } from '@/components/hr/EmployeeList'
import { LeaveManagement } from '@/components/hr/LeaveManagement'

export default function HRPage() {
  const [employees, setEmployees] = useState([
    // Add some dummy data or fetch from your API
  ])

  return (
    <div className="p-6">
      <HRDashboard />
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <EmployeeList employees={employees} />
        <LeaveManagement />
      </div>
    </div>
  )
}
