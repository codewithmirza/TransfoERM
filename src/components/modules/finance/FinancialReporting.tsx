'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

interface FinancialReport {
  id: string
  type: string
  data: any
  generatedAt: string
}

type ReportType = 'income' | 'balance' | 'cashflow' | 'tax'

interface ReportControlsProps {
  onGenerate: (type: ReportType) => Promise<void>
}

function ReportControls({ onGenerate }: ReportControlsProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-2">
        <Button onClick={() => onGenerate('income')}>Income Statement</Button>
        <Button onClick={() => onGenerate('balance')}>Balance Sheet</Button>
        <Button onClick={() => onGenerate('cashflow')}>Cash Flow</Button>
        <Button onClick={() => onGenerate('tax')}>Tax Report</Button>
      </div>
    </Card>
  )
}

function ReportList({ reports }: { reports: FinancialReport[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
      <div className="space-y-2">
        {reports.map(report => (
          <div key={report.id} className="p-2 border rounded">
            <span>{report.type} - {new Date(report.generatedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function FinancialReporting() {
  const [reports, setReports] = useState<FinancialReport[]>([])
  
  async function generateReport(type: ReportType) {
    try {
      const response = await fetch(`https://transfoerm.manwaarullahb.workers.dev/api/finance/reports/${type}`, {
        method: 'POST'
      })
      const report = await response.json() as FinancialReport
      setReports(prev => [...prev, report])
      toast.success(`${type} report generated successfully`)
    } catch (error) {
      toast.error(`Failed to generate ${type} report`)
    }
  }

  return (
    <div className="space-y-6">
      <ReportControls onGenerate={generateReport} />
      <ReportList reports={reports} />
    </div>
  )
} 