import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface DepartmentProps {
  department: {
    id: string;
    title: string;
    metrics: {
      title: string;
      value: string;
      change: string;
    }[];
    color: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export function DepartmentModule({ department, isActive, onClick }: DepartmentProps) {
  // Sample data for the charts
  const data = Array.from({ length: 20 }, (_, i) => ({
    value: Math.random() * 100 + 50
  }));

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer",
        "bg-black/40 backdrop-blur-md border border-white/10",
        "before:absolute before:inset-0",
        `before:bg-gradient-to-r before:from-${department.color}-500/10 before:to-purple-500/10`,
        isActive ? "h-[500px]" : "h-[300px]"
      )}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-${department.color}-500 animate-pulse`} />
            <h3 className="text-lg font-bold text-white">{department.title}</h3>
          </div>
        </div>

        <div className="h-32 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={`url(#${department.id}-gradient)`}
                strokeWidth={2}
                dot={false}
              />
              <defs>
                <linearGradient id={`${department.id}-gradient`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={`rgb(var(--${department.color}-500))`} />
                  <stop offset="100%" stopColor={`rgb(var(--purple-500))`} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {department.metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
            >
              <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <p className={cn(
                  "text-sm font-medium",
                  metric.change.startsWith('+') ? "text-green-400" : "text-red-400"
                )}>
                  {metric.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 