// Custom notification type for our application
export interface AppNotification {
  id: string
  type: 'info' | 'warning' | 'critical'
  module: 'finance' | 'inventory' | 'hr' | 'sales' | 'system'
  message: string
  details: Record<string, any>
  timestamp: Date
  read: boolean
  user_id?: string
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook' | 'sms'
  target: string
  template?: string
  priority: 'low' | 'medium' | 'high'
  retryCount?: number
  metadata?: Record<string, any>
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationCategory = 
  | 'system'
  | 'user'
  | 'performance'
  | 'task'
  | 'alert';

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface UserContext {
  id: string;
  preferences: {
    notificationChannels: string[];
    workHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}

export interface OptimizedConfig {
  timing: Date;
  channel: string;
  priority: Priority;
  category: NotificationCategory;
  content: NotificationContent;
}

export interface AINotificationEngineInterface {
  optimizeDelivery: (config: any) => Promise<OptimizedConfig>;
  predictBestTime: (userContext: UserContext) => Promise<Date>;
  selectOptimalChannel: (userContext: UserContext) => Promise<string>;
  enhanceContent: (content: NotificationContent, userContext: UserContext) => Promise<NotificationContent>;
} 