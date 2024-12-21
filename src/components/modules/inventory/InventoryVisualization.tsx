'use client'

import { useInventoryModule } from '@/hooks/useInventoryModule'
import { Chart } from 'chart.js/auto'
import { useEffect, useRef } from 'react'

export function InventoryVisualization() {
  const { stockItems, loading } = useInventoryModule()
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!chartRef.current || loading) return

    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: stockItems.map(item => item.name),
        datasets: [{
          label: 'Stock Levels',
          data: stockItems.map(item => item.quantity),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    return () => chart.destroy()
  }, [stockItems, loading])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  )
} 