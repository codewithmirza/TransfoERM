import { AIResponse, WorkflowSuggestion, AIAssistantContext } from '@/types/ai'
import { AIEngine } from '@/lib/ai/AIEngine'
import { CacheManager } from '@/lib/ai/CacheManager'
import { Env } from '@/types/env'

export class WorkflowSuggestionService {
  constructor(
    private env: Env,
    private aiEngine: AIEngine,
    private cacheManager: CacheManager
  ) {}

  async suggestWorkflows(context: AIAssistantContext): Promise<WorkflowSuggestion[]> {
    const cacheKey = `workflow:suggestions:${JSON.stringify(context)}`
    const cached = await this.cacheManager.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const patterns = await this.analyzePatterns(context)
    const prompt = this.buildSuggestionPrompt(patterns, context)
    
    const response = await this.aiEngine.analyzeCode(prompt)

    const suggestions = this.processSuggestions(response, context)
    const rankedSuggestions = this.rankSuggestions(suggestions, context)

    await this.cacheManager.set(cacheKey, JSON.stringify(rankedSuggestions), {
      ttl: 3600 // 1 hour
    })

    return rankedSuggestions
  }

  private async analyzePatterns(context: AIAssistantContext) {
    const [userPatterns, modulePatterns, industryPatterns] = await Promise.all([
      this.getUserPatterns(context.userId),
      this.getModulePatterns(context.currentModule),
      this.getIndustryPatterns(context.companyContext.industry)
    ])

    return {
      user: userPatterns,
      module: modulePatterns,
      industry: industryPatterns,
      frequentActions: this.getFrequentActions(context.recentActions)
    }
  }

  private async getUserPatterns(userId: string) {
    const userActions = await this.env.KV.get(`user:${userId}:actions`)
    return userActions ? this.processUserActions(JSON.parse(userActions)) : []
  }

  private async getModulePatterns(module: string): Promise<any[]> {
    const moduleStats = await this.env.KV.get(`module:${module}:stats`)
    return moduleStats ? JSON.parse(moduleStats) : []
  }

  private getFrequentActions(actions: any[]): string[] {
    const actionCounts = new Map<string, number>()
    
    actions.forEach(action => {
      const count = actionCounts.get(action.type) || 0
      actionCounts.set(action.type, count + 1)
    })

    return Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([action]) => action)
      .slice(0, 5)
  }

  private buildSuggestionPrompt(patterns: any, context: AIAssistantContext): string {
    return `
      Analyze the following patterns and suggest workflows:
      User Patterns: ${JSON.stringify(patterns.user)}
      Module Patterns: ${JSON.stringify(patterns.module)}
      Industry Patterns: ${JSON.stringify(patterns.industry)}
      Frequent Actions: ${JSON.stringify(patterns.frequentActions)}
      Context: ${JSON.stringify(context)}
    `;
  }

  private processSuggestions(response: AIResponse, context: AIAssistantContext): WorkflowSuggestion[] {
    if (!response.content) return [];
    
    return response.content.split('\n')
      .filter(line => line.trim())
      .map(suggestion => ({
        type: 'automation',
        description: suggestion,
        confidence: response.confidence || 0.8,
        context: {
          module: context.currentModule,
          action: 'automate',
          triggers: []
        },
        automationPotential: 0.7
      }));
  }

  private rankSuggestions(
    suggestions: WorkflowSuggestion[], 
    context: AIAssistantContext
  ): WorkflowSuggestion[] {
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private processUserActions(actions: any[]): any[] {
    return actions.map(action => ({
      type: action.type,
      frequency: action.count || 1,
      lastUsed: new Date(action.timestamp || Date.now())
    }))
  }

  private async getIndustryPatterns(industry: string): Promise<any[]> {
    const industryStats = await this.env.KV.get(`industry:${industry}:patterns`)
    return industryStats ? JSON.parse(industryStats) : []
  }
} 