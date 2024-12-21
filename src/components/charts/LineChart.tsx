'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export interface LineChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

export function LineChart({ data, height = 300 }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: 'Value',
          data: data.map(d => d.value),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })

    return () => chart.destroy()
  }, [data])

  return (
    <div style={{ height }}>
      <canvas ref={chartRef} />
    </div>
  )
} 