'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Users2, DollarSign, ShoppingCart, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { useState } from 'react'
import { DepartmentModule } from './DepartmentModule'
import { AICommandCenter } from './AICommandCenter'
import { Calendar3D } from './Calendar3D'

export default function DashboardHome() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const departments = [
    {
      id: 'sales',
      title: 'Sales Command',
      metrics: [
        { title: 'Revenue', value: '$52,000', change: '+15%' },
        { title: 'Pipeline', value: '$1.2M', change: '+8%' },
        { title: 'Conversion', value: '24%', change: '+3%' },
        { title: 'Active Deals', value: '45', change: '+12%' }
      ],
      color: 'blue'
    },
    {
      id: 'finance',
      title: 'Financial Hub',
      metrics: [
        { title: 'Cash Flow', value: '$123,456', change: '+12%' },
        { title: 'Expenses', value: '$45,678', change: '-5%' },
        { title: 'Profit Margin', value: '28%', change: '+2%' },
        { title: 'Forecasted Growth', value: '15%', change: '+3%' }
      ],
      color: 'emerald'
    },
    {
      id: 'hr',
      title: 'HR Command',
      metrics: [
        { title: 'Employees', value: '89', change: '+3%' },
        { title: 'Satisfaction', value: '94%', change: '+2%' },
        { title: 'Time to Hire', value: '18 days', change: '-15%' },
        { title: 'Training Progress', value: '92%', change: '+5%' }
      ],
      color: 'purple'
    }
  ];

  const handleVoiceCommand = () => {
    setIsListening(true);
    // Voice command logic here
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* AI Command Center */}
      <AICommandCenter isListening={isListening} onVoiceCommand={handleVoiceCommand} />

      {/* Department Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <DepartmentModule
                department={dept}
                isActive={activeModule === dept.id}
                onClick={() => setActiveModule(activeModule === dept.id ? null : dept.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3D Calendar Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Calendar3D />
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-xl",
          "bg-black/40 backdrop-blur-md border border-white/10",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-500/10"
        )}
      >
        <div className="relative z-10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* AI insights content will go here */}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
