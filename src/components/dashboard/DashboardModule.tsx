import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface DashboardModuleProps {
  title: string;
  type: 'sales' | 'finance' | 'hr' | 'operations';
  visible?: boolean;
}

export function DashboardModule({ title, type, visible = true }: DashboardModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!visible) return null;

  // Sample data for the charts
  const data = Array.from({ length: 20 }, (_, i) => ({
    value: Math.random() * 100 + 50
  }));

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "bg-[#0A0A0A]/80 backdrop-blur-md",
          "border border-[#333]/50",
          isExpanded ? "h-[600px]" : "h-[300px]"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Holographic effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        
        {/* Glow effects */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
            </div>
          </div>
          
          <ModuleContent type={type} isExpanded={isExpanded} data={data} />
        </div>
      </Card>
    </motion.div>
  );
}

function ModuleContent({ type, isExpanded, data }: { type: string, isExpanded: boolean, data: any[] }) {
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Chart Section */}
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#gradient)"
              strokeWidth={2}
              dot={false}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Module-specific content */}
      <div className="grid grid-cols-2 gap-4">
        {type === 'sales' && (
          <>
            <MetricCard title="Revenue" value="$52,000" trend="+15%" />
            <MetricCard title="Customers" value="1,234" trend="+8%" />
          </>
        )}
        
        {type === 'finance' && (
          <>
            <MetricCard title="Cash Flow" value="$123,456" trend="+12%" />
            <MetricCard title="Expenses" value="$45,678" trend="-5%" />
          </>
        )}
        
        {type === 'hr' && (
          <>
            <MetricCard title="Employees" value="89" trend="+3%" />
            <MetricCard title="Satisfaction" value="94%" trend="+2%" />
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {trend}
        </p>
      </div>
    </div>
  );
} 