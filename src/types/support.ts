export interface SupportTicketMetadata {
  browser?: string;
  os?: string;
  url?: string;
  customFields?: Record<string, any>;
  resolution?: string;
}

export interface SupportTicket {
  id: string
  title: string
  content: string
  category: 'technical' | 'billing' | 'general' | 'feature_request'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdBy: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  metadata?: SupportTicketMetadata
  tags?: string[]
  attachments?: Array<{
    id: string
    name: string
    type: string
    url: string
    size: number
  }>
}

export interface AutomatedResponse {
  ticketId: string
  content: string
  confidence: number
  metadata: {
    generatedBy: 'ai' | 'template' | 'human'
    timestamp: string
    model?: string
    template?: string
  }
  suggestedActions?: Array<{
    type: 'escalate' | 'close' | 'assign' | 'tag'
    value: string
    confidence: number
  }>
}

export interface SupportMetrics {
  responseTime: {
    average: number
    percentile95: number
  }
  resolutionTime: {
    average: number
    percentile95: number
  }
  satisfaction: {
    score: number
    responses: number
  }
  volume: {
    total: number
    byCategory: Record<string, number>
    byPriority: Record<string, number>
  }
  automation: {
    rate: number
    successRate: number
    avgConfidence: number
  }
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: string
  createdAt: Date
  updatedAt: Date
  viewCount: number
  helpfulCount: number
  metadata?: {
    relatedArticles?: string[]
    keywords?: string[]
    customFields?: Record<string, any>
  }
}

export interface SupportTemplate {
  id: string
  name: string
  category: string
  content: string
  variables: string[]
  metadata?: {
    usage: number
    successRate: number
    lastUsed?: Date
  }
}

export interface SupportAgent {
  id: string
  name: string
  email: string
  role: 'agent' | 'supervisor' | 'admin'
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  currentLoad: number
  metrics: {
    responseTime: number
    resolutionTime: number
    satisfaction: number
    ticketsResolved: number
  }
}

export interface SupportTeam {
  id: string
  name: string
  members: string[]
  supervisor: string
  categories: string[]
  schedule: {
    timezone: string
    shifts: Array<{
      start: string
      end: string
      agents: string[]
    }>
  }
  metrics: {
    performance: number
    workload: number
    backlog: number
  }
}

export interface SupportEscalation {
  id: string
  ticketId: string
  reason: string
  priority: 'normal' | 'urgent' | 'critical'
  escalatedBy: string
  escalatedTo: string
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: Date
  resolvedAt?: Date
  notes?: string[]
} 