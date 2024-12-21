import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkflowBuilderProps {
  onClose: () => void;
}

export function WorkflowBuilder({ onClose }: WorkflowBuilderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-screen w-96 bg-black/60 backdrop-blur-xl border-l border-white/10 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Workflow Builder</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Placeholder for workflow builder content */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <p className="text-white/60 text-sm">Drag components here to start building your workflow</p>
        </div>
      </div>
    </motion.div>
  );
} 