'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowRight, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface FinanceModuleProps {
  data: {
    cashFlow: number[];
    revenue: number[];
    expenses: number[];
    projections: number[];
  };
  isExpanded: boolean;
}

export function FinanceModule({ data, isExpanded }: FinanceModuleProps) {
  const [activeView, setActiveView] = useState<'cashFlow' | 'projections'>('cashFlow');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [0, 400], [5, -5]), {
    stiffness: 100,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 400], [-5, 5]), {
    stiffness: 100,
    damping: 30
  });

  function handleMouseMove({ clientX, clientY, currentTarget }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Transform data for charts
  const chartData = data.cashFlow.map((value, index) => ({
    name: `Week ${index + 1}`,
    value,
    projection: data.projections[index]
  }));

  return (
    <motion.div
      className={cn(
        "relative w-full rounded-xl overflow-hidden",
        "bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10",
        isExpanded ? "h-[600px]" : "h-[300px]"
      )}
      onMouseMove={handleMouseMove}
      style={{
        perspective: "1000px"
      }}
    >
      {/* Holographic container */}
      <motion.div
        className="relative h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Financial Overview</h3>
            </div>
            <div className="flex space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Chart Section */}
          <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Revenue"
              value="$1.2M"
              change="+15%"
              icon={TrendingUp}
            />
            <MetricCard
              title="Expenses"
              value="$450K"
              change="-5%"
              icon={PieChart}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({ title, value, change, icon: Icon }: {
  title: string;
  value: string;
  change: string;
  icon: any;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-blue-400" />
        <p className="text-sm text-gray-400">{title}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {change}
        </p>
      </div>
    </div>
  );
} 