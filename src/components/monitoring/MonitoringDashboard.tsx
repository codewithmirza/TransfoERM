'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { MonitoringDashboard as DashboardType } from '@/types/monitoring'
import { MonitoringPanel } from './MonitoringPanel'

interface MonitoringDashboardProps {
  dashboard: DashboardType
}

export function MonitoringDashboard({ dashboard }: MonitoringDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Setup real-time updates
    const interval = setInterval(() => {
      // Update dashboard data
    }, dashboard.refreshInterval)

    return () => clearInterval(interval)
  }, [dashboard])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{dashboard.name}</h2>
        <div className="flex items-center gap-4">
          {/* Add dashboard controls */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboard.panels.map(panel => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MonitoringPanel panel={panel} />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 