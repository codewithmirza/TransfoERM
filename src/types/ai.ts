import type { ModuleType } from './modules'
import type { TimeframeType } from './common'

// Core AI Types
export interface AIContext {
  module: string
  timestamp: string
  user?: string
  previousActions?: string[]
  relevantData?: Record<string, any>
  companyContext?: {
    industry: string
    size: string
    region: string
  }
  filters?: Record<string, any>
  timeframe?: TimeframeType
}

export interface BaseAIRequest {
  prompt: string
  context: AIContext
  options?: {
    temperature?: number
    maxTokens?: number
    model?: string
    metadata?: Record<string, any>
  }
}

// Knowledge Base Request Types
export interface AIQueryRequest {
  type: 'query'
  content: string
}

export interface AIKnowledgeRequest {
  type: 'add_knowledge'
  content: string
  metadata: Record<string, any>
}

export type KnowledgeRequest = AIQueryRequest | AIKnowledgeRequest

export interface AIResponse<T = any> {
  success: boolean
  data: T
  error?: string
  metadata?: {
    timestamp: number
    processingTime: number
    model: string
  }
}

// Command-related Types
export interface AICommandRequest {
  command: string
  userId?: string
  context: AIContext
  options?: BaseAIRequest['options']
}

export interface AICommandResponse {
  success: boolean
  result?: {
    action?: string
    module?: string
    suggestions?: string[]
    parameters?: Record<string, any>
    metadata?: Record<string, any>
  }
  error?: string
}

export type AiCommandResult = {
  action: string
  module?: string
  parameters?: Record<string, any>
  suggestedResponse?: string
}

// Insight Types
export interface AIInsight {
  id: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  source: string
  confidence: number
  metadata?: Record<string, any>
}

export interface AIAnalysisResult {
  status: 'success' | 'error'
  insights: AIInsight[]
  confidence: number
  metadata?: {
    model?: string
    processingTime?: number
    tokens?: number
  }
}

// Customization Types
export interface CustomizationRequest {
  moduleType: ModuleType
  industry: string
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  requirements: string[]
  compliance?: string[]
  integrations?: string[]
}

export interface CustomizationResult {
  code: string
  tests: string
  documentation: string
  integrationTests: string
  deploymentSteps: string[]
  securityAnalysis: SecurityAnalysisResult
}

export interface SecurityAnalysisResult {
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  recommendations: string[]
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  metrics: {
    current: number;
    target: number;
  };
  status: 'pending' | 'in-progress' | 'completed';
}

export interface AIRulesEngineInterface {
  validateRule: (rule: Rule, existingRules: Rule[]) => Promise<ValidationResult>;
  optimizeResults: (results: any[], context: any) => Promise<any>;
  generateSmartGoals: (insights: any) => Promise<Goal[]>;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export interface Rule {
  id: string;
  condition: (context: any) => boolean;
  action: (context: any) => Promise<any>;
  priority: number;
}

export interface CodeAnalysisResult {
  quality: {
    maintainability: number
    reliability: number
    security: number
    performance: number
  }
  issues: CodeIssue[]
  suggestions: string[]
  complexity: {
    cognitive: number
    cyclomatic: number
    halstead: number
  }
  metrics: {
    linesOfCode: number
    commentLines: number
    duplicateLines: number
  }
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  line?: number
  column?: number
  severity: number
  rule?: string
}

export interface OptimizationSuggestion {
  type: 'performance' | 'memory' | 'security' | 'maintainability'
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  code?: string
}

export interface SecurityRisk {
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  location?: string
  remediation?: string
  cwe?: string
}

export interface TestCase {
  name: string
  description: string
  input: any
  expectedOutput: any
  type: 'unit' | 'integration' | 'e2e'
  dependencies?: string[]
  setup?: string
  teardown?: string
}

export interface AIMetric {
  name: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'stable'
}

export interface RAGResponse {
  answer: string;
  confidence: number;
  sources: string[];
  metadata: {
    processingTime: number;
    modelUsed: string;
    tokensUsed: number;
  };
}

export interface QueryContext {
  user: {
    role: string;
    department: string;
    permissions: string[];
  };
  module: string;
  timeframe?: string;
  filters?: Record<string, any>;
  namespace?: string;
  startTime?: number;
}

export interface DocumentChunk {
  id: string;
  text: string;
  type: string;
  metadata?: {
    language?: string;
    source?: string;
    timestamp?: Date;
    [key: string]: any;
  };
}

export interface KnowledgeDocument {
  id: string;
  content: string;
  type: 'text' | 'code' | 'documentation';
  metadata: {
    language?: string;
    source?: string;
    lastUpdated: Date;
    [key: string]: any;
  };
}

export interface PatternAnalysis {
  temporal: TemporalPattern[];
  behavioral: BehavioralPattern[];
  anomalies: Anomaly[];
  correlations: Correlation[];
  insights?: string[];
  confidence?: number;
}

export interface TemporalPattern {
  type: string;
  frequency: number;
  timeframe: string;
  confidence: number;
}

export interface BehavioralPattern {
  type: string;
  frequency: number;
  context: string;
  confidence: number;
}

export interface Anomaly {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
}

export interface Correlation {
  source: string;
  target: string;
  strength: number;
  type: string;
}

export interface AIRecommendation {
  id: string
  action: string
  confidence: number
  type: string
  impact: 'high' | 'medium' | 'low'
  priority?: 'low' | 'medium' | 'high'
  effort?: string
  metadata?: Record<string, any>
}

export interface WorkflowSuggestion {
  type: string
  description: string
  confidence: number
  context: {
    module: string
    action: string
    triggers: string[]
  }
  automationPotential: number
}

export interface AIAssistantContext {
  userId: string;
  currentModule: string;
  userRole: string;
  recentActions: Array<{
    type: string;
    timestamp: Date;
    context: Record<string, any>;
  }>;
  companyContext: {
    industry: string;
    size: string;
    region: string;
  };
}

export type ModelType = 
  | '@cf/meta/llama-2-7b-chat-int8'
  | '@cf/baai/bge-base-en-v1.5'
  | '@cf/meta/llama-2-13b-chat-int8';

export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    content: string;
    [key: string]: any;
  };
  score?: number;
}

export interface CommandHistory {
  id: string
  command: string
  timestamp: number
  response: string
  status: 'success' | 'error' | 'pending'
  metadata?: {
    source: string
    confidence?: number
    executionTime?: number
    context?: Record<string, any>
  }
}

export interface CommandSuggestion {
  id: string
  text: string
  description?: string
  category?: string
  confidence: number
  context?: Record<string, any>
}

export interface CommandResponse {
  success: boolean
  response: string
  data?: any
  error?: string
  suggestions?: CommandSuggestion[]
  metadata?: {
    processingTime: number
    model: string
    confidence: number
  }
} 