'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData as ChartJSData
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface AIEnhancedChartProps {
  moduleId: string
  dataType: 'finance' | 'inventory' | 'hr' | 'sales'
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  enablePredictions?: boolean
  height?: number
}

interface ChartData {
  name: string
  value: number
}

interface AIResponse {
  predictions: ChartData[]
  insights: string[]
}

export function AIEnhancedChart({
  moduleId,
  dataType,
  timeframe = 'monthly',
  enablePredictions = true,
  height = 300
}: AIEnhancedChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<ChartJS | null>(null)
  const [data, setData] = useState<ChartData[]>([])
  const [predictions, setPredictions] = useState<ChartData[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Chart options with proper typing
  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          afterBody: (tooltipItems: any) => {
            const idx = tooltipItems[0].dataIndex
            return insights[idx] ? `AI Insight: ${insights[idx]}` : ''
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical data
        const response = await fetch(`/api/${dataType}/metrics?timeframe=${timeframe}&moduleId=${moduleId}`)
        const historicalData = await response.json() as ChartData[]
        setData(historicalData)

        if (enablePredictions) {
          // Get AI predictions
          const aiResponse = await fetch(`/api/ai/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moduleId,
              dataType,
              historicalData,
              timeframe
            })
          })
          const { predictions, insights } = await aiResponse.json() as AIResponse
          setPredictions(predictions)
          setInsights(insights)
        }
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load chart data. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [moduleId, dataType, timeframe, enablePredictions])

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        const chartData: ChartJSData<'line', number[]> = {
          labels: data.map(d => d.name),
          datasets: [
            {
              label: 'Actual',
              data: data.map(d => d.value),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            ...(enablePredictions ? [{
              label: 'Predicted',
              data: predictions.map(d => d.value),
              borderColor: 'rgb(255, 99, 132)',
              borderDash: [5, 5],
              tension: 0.1
            }] : [])
          ]
        }

        chartInstance.current = new ChartJS(ctx, {
          type: 'line',
          data: chartData,
          options
        })
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, predictions, enablePredictions, options])

  if (loading) {
    return <div>Loading chart data...</div>
  }

  return (
    <Card className="p-4">
      <Tabs defaultValue="line">
        <TabsList>
          <TabsTrigger value="line">Line</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <div style={{ height }}>
            <canvas ref={chartRef} />
          </div>
        </TabsContent>
        <TabsContent value="bar">
          {/* Similar bar chart implementation */}
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function getColorForModule(type: string): string {
  const colors = {
    finance: 'rgb(34, 197, 94)', // green
    inventory: 'rgb(59, 130, 246)', // blue
    hr: 'rgb(168, 85, 247)', // purple
    sales: 'rgb(249, 115, 22)' // orange
  }
  return colors[type as keyof typeof colors] || 'rgb(59, 130, 246)'
} 