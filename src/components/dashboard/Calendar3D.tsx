import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Calendar3D() {
  const events = [
    { id: 1, title: 'Team Meeting', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Project Review', time: '2:00 PM', type: 'review' },
    { id: 3, title: 'Client Call', time: '4:30 PM', type: 'call' }
  ];

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-black/40 backdrop-blur-md border border-white/10",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-indigo-500/10 before:to-purple-500/10"
      )}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Today's Schedule</h3>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-white font-medium">{event.title}</p>
                <p className="text-sm text-gray-400">{event.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 