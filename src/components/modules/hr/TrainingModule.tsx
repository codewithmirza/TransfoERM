'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import { Book, Play, CheckCircle, Clock, Award, Plus, BarChart } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface TrainingCourse {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  category: 'technical' | 'soft-skills' | 'compliance' | 'leadership'
  status: 'not-started' | 'in-progress' | 'completed'
  modules: TrainingModule[]
}

interface TrainingModule {
  id: string
  title: string
  duration: string
  completed: boolean
}

interface APIResponse<T> {
  success: boolean
  data: T
}

export function TrainingModule() {
  const [courses, setCourses] = useState<TrainingCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TrainingCourse['category'] | 'all'>('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/hr/training/courses')
      const data = await response.json() as APIResponse<TrainingCourse[]>
      if (data.success) {
        setCourses(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: TrainingCourse['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'in-progress': return 'bg-blue-500/20 text-blue-400'
      case 'not-started': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "h-[600px]"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Training & Development</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              {['all', 'technical', 'soft-skills', 'compliance', 'leadership'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as typeof selectedCategory)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm transition-all",
                    selectedCategory === category ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            <button className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-3 gap-6">
          {courses
            .filter(course => selectedCategory === 'all' || course.category === selectedCategory)
            .map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(course.status)
                  )}>
                    {course.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{course.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1" />

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-white">Continue Learning</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {course.modules.filter(m => m.completed).length} / {course.modules.length} modules
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </Card>
  )
} 