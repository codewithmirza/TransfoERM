import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DashboardModule } from './DashboardModule';
import { AIPrompts } from './AIPrompts';
import { Notifications } from './Notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mic, Settings, Menu, Command } from 'lucide-react';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { CommandInterface } from '@/components/command/CommandInterface';
import { VoiceCommandProvider } from '@/lib/voice/VoiceCommandContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {children}
    </div>
  );
} 