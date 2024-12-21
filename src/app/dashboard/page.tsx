'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  Mic, 
  Package, 
  Users, 
  DollarSign, 
  GitBranch,
  Send,
  Sparkles
} from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { AIInsights } from '@/components/shared/AIInsights'

export default function DashboardPage() {
  const [command, setCommand] = useState('')
  const [isListening, setIsListening] = useState(false)
  const { inventory = [], transactions = [], workflows = [] } = useData()

  const quickStats = [
    {
      title: 'Inventory Items',
      value: inventory?.length || 0,
      icon: Package,
      color: 'text-blue-500',
      link: '/dashboard/inventory'
    },
    {
      title: 'Active Workflows',
      value: workflows?.filter(w => w?.status === 'active')?.length || 0,
      icon: GitBranch,
      color: 'text-purple-500',
      link: '/dashboard/workflow'
    },
    {
      title: 'Today\'s Transactions',
      value: transactions?.filter(t => t?.date?.startsWith(new Date().toISOString().split('T')[0]))?.length || 0,
      icon: DollarSign,
      color: 'text-green-500',
      link: '/dashboard/finance'
    }
  ]

  const handleCommand = async () => {
    if (!command.trim()) return
    // Implement AI command processing
    console.log('Processing command:', command)
    setCommand('')
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Implement voice recognition
  }

  return (
    <div className="p-6 space-y-6">
      {/* Command Center */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">AI Command Center</h2>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ask anything or type a command..."
              className="bg-black/20 border-white/10 text-white pr-24"
              onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className={`${isListening ? 'text-red-400' : 'text-white/60'}`}
                onClick={toggleVoice}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCommand}
                disabled={!command.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="ghost" size="sm" className="text-white/60">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60">
            <Brain className="w-4 h-4 mr-2" />
            Analyze Data
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <Card 
            key={index} 
            className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-white/60">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <AIInsights module="inventory" data={{ inventory }} />
        <AIInsights module="finance" data={{ transactions }} />
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        {/* Add activity feed here */}
      </Card>
    </div>
  )
}
