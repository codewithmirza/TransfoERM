'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { useToast } from '@/components/ui/use-toast'
import { Award, Calendar, ChevronRight, Plus } from 'lucide-react'
import type { PerformanceReview, PerformanceMetric } from '@/types/hr'
import { motion } from 'framer-motion'

export function PerformanceReviewComponent() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
    fetchMetrics()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/hr/reviews')
      const result = await response.json() as { success: boolean; data: PerformanceReview[] }
      if (result.success) {
        setReviews(result.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive'
      })
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/hr/metrics')
      const result = await response.json() as { success: boolean; data: PerformanceMetric[] }
      if (result.success) {
        setMetrics(result.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch metrics',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Performance Reviews</h2>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Reviews</h3>
          <div className="space-y-4">
            {reviews
              .filter(review => review.status === 'draft')
              .map(review => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg border border-gray-200 hover:border-purple-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{review.employeeId}</h4>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(review.period.end).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Review Metrics</h3>
          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{metric.name}</p>
                  <p className="text-sm text-gray-500">{metric.category}</p>
                </div>
                <span className="text-sm font-medium">
                  Weight: {metric.weight}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
} 