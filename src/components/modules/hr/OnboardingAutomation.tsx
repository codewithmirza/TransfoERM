'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import { Users, FileCheck, Calendar, Mail, Book, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DynamicUIGenerator } from '@/lib/ui/DynamicUIGenerator'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'

interface OnboardingTask {
  id: string
  title: string
  type: 'document' | 'training' | 'setup' | 'meeting'
  status: 'pending' | 'completed' | 'in-progress'
  dueDate: Date
  assignee: string
}

interface OnboardingTemplate {
  id: string
  name: string
  tasks: OnboardingTask[]
  department: string
}

export function OnboardingAutomation() {
  const [uiComponents, setUiComponents] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  useEffect(() => {
    const generator = new DynamicUIGenerator()
    
    const moduleConfig = {
      id: 'onboarding',
      name: 'Onboarding Process',
      type: 'hr',
      moduleType: 'hr' as const,
      version: '1.0',
      dataStructure: [
        {
          name: 'employeeName',
          type: 'string' as const,
          label: 'Employee Name',
          required: true
        },
        {
          name: 'startDate',
          type: 'date' as const,
          label: 'Start Date',
          required: true
        },
        {
          name: 'department',
          type: 'string' as const,
          label: 'Department',
          required: true
        }
      ],
      interactions: [],
      customizations: []
    }

    generator.generateUIFromModule(moduleConfig)
      .then(schema => {
        console.log('Generated UI Components:', schema.components)
        setUiComponents(schema.components)
      })
      .catch(console.error)
  }, [])

  const templates: OnboardingTemplate[] = [
    {
      id: 'dev',
      name: 'Developer Onboarding',
      department: 'Engineering',
      tasks: [
        {
          id: 't1',
          title: 'Setup Development Environment',
          type: 'setup',
          status: 'pending',
          dueDate: new Date(),
          assignee: 'IT Team'
        },
        {
          id: 't2',
          title: 'Code Repository Access',
          type: 'setup',
          status: 'pending',
          dueDate: new Date(),
          assignee: 'DevOps'
        },
        // Add more tasks...
      ]
    },
    // Add more templates...
  ]

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "h-[500px]"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Onboarding Automation</h2>
          </div>
          <button className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Templates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/60">Templates</h3>
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer",
                  "bg-white/5 border-white/10",
                  selectedTemplate === template.id && "border-purple-500/50 bg-purple-500/5"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-white/60 text-sm">{template.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/60">5 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/60">{template.tasks.length} tasks</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Form */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-medium text-white/60">Onboarding Details</h3>
              <Form className="space-y-4">
                {uiComponents.map((component, index) => {
                  const ComponentType = component.type === 'input' ? Input :
                                      component.type === 'date-picker' ? DatePicker :
                                      component.type === 'toggle' ? Toggle :
                                      Input // default to Input

                  return (
                    <div key={index} className="space-y-2">
                      <label className="text-sm text-white/60">
                        {component.props.label}
                      </label>
                      <ComponentType
                        {...component.props}
                        className={cn(
                          "w-full bg-white/5 border border-white/10 rounded-lg p-2",
                          "text-white placeholder:text-white/40",
                          "focus:border-purple-500/50 focus:ring-0",
                          "transition-all duration-200"
                        )}
                      />
                    </div>
                  )
                })}
                <Button 
                  type="submit"
                  className="w-full bg-purple-500/20 border border-purple-500/30 
                             text-purple-400 hover:bg-purple-500/30"
                >
                  Start Onboarding
                </Button>
              </Form>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  )
} 