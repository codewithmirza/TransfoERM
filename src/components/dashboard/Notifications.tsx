import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface NotificationsProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  timestamp: Date;
}

export function Notifications({ onClose }: NotificationsProps) {
  const [notifications] = React.useState<Notification[]>([
    {
      id: 1,
      message: "New customer inquiry received from Apple Inc.",
      type: "info",
      timestamp: new Date()
    },
    {
      id: 2,
      message: "Sales target achieved for Q2 2024!",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: 3,
      message: "Supply chain disruption detected in APAC region",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: 4,
      message: "Payment processing system needs attention",
      type: "error",
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          border: 'border-emerald-500/20',
          hoverBorder: 'hover:border-emerald-500/40',
          bg: 'bg-emerald-500/10'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          border: 'border-amber-500/20',
          hoverBorder: 'hover:border-amber-500/40',
          bg: 'bg-amber-500/10'
        };
      case 'error':
        return {
          icon: <X className="w-5 h-5 text-red-500" />,
          border: 'border-red-500/20',
          hoverBorder: 'hover:border-red-500/40',
          bg: 'bg-red-500/10'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          border: 'border-blue-500/20',
          hoverBorder: 'hover:border-blue-500/40',
          bg: 'bg-blue-500/10'
        };
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes < 120) return '1 hour ago';
    return `${Math.floor(minutes / 60)} hours ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="fixed left-0 top-0 h-screen w-96 bg-black/60 backdrop-blur-xl border-r border-white/10 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium text-blue-400">Notifications</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {notifications.map((notification) => {
          const style = getNotificationStyle(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={cn(
                "p-4 rounded-lg backdrop-blur-sm",
                "border transition-all duration-300",
                style.border,
                style.hoverBorder,
                style.bg
              )}
            >
              <div className="flex items-start gap-3">
                {style.icon}
                <div className="flex-1">
                  <p className="text-sm text-white/90">{notification.message}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                <button className="text-white/40 hover:text-white/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
} 