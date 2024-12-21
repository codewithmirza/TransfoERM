'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export interface BarChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
  color?: string
  options?: {
    responsive?: boolean
    maintainAspectRatio?: boolean
    plugins?: {
      legend?: {
        display?: boolean
      }
    }
    scales?: {
      y?: {
        beginAtZero?: boolean
      }
    }
  }
}

export function BarChart({ 
  data, 
  height = 300,
  color = 'rgb(59, 130, 246)', // Default blue color
  options = {}
}: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: 'Value',
          data: data.map(d => d.value),
          backgroundColor: `${color}33`, // 20% opacity
          borderColor: color,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            ...options.plugins?.legend
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ...options.scales?.y
          }
        },
        ...options
      }
    })

    return () => chart.destroy()
  }, [data, height, color, options])

  return (
    <div style={{ height }}>
      <canvas ref={chartRef} />
    </div>
  )
} 