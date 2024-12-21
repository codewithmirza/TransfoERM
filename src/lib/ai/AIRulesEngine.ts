import { AIRulesEngineInterface, ValidationResult, Rule, Goal } from '@/types/ai';
import { AIService } from './AIService';

export class AIRulesEngine implements AIRulesEngineInterface {
  private aiService: AIService;

  constructor() {
    this.aiService = AIService.getInstance();
  }

  async validateRule(rule: Rule, existingRules: Rule[]): Promise<ValidationResult> {
    const analysis = await this.aiService.analyze('Validate business rule', {
      rule,
      existingRules,
      context: {
        ruleCount: existingRules.length,
        priorities: existingRules.map(r => r.priority),
        conditions: existingRules.map(r => r.condition.toString())
      }
    });

    return {
      isValid: analysis.isValid,
      reason: analysis.reason
    };
  }

  async optimizeResults(results: any[], context: any): Promise<any> {
    const optimized = await this.aiService.analyze('Optimize rule results', {
      results,
      context,
      metadata: {
        resultCount: results.length,
        contextType: typeof context,
        timestamp: new Date()
      }
    });

    return {
      optimizedResults: optimized.results,
      metrics: optimized.metrics,
      suggestions: optimized.suggestions
    };
  }

  async generateSmartGoals(insights: any): Promise<Goal[]> {
    const goals = await this.aiService.analyze('Generate smart goals', {
      insights,
      context: {
        timestamp: new Date(),
        insightTypes: Object.keys(insights)
      }
    });

    return goals.map((goal: any) => ({
      id: crypto.randomUUID(),
      title: goal.title,
      description: goal.description,
      targetDate: new Date(goal.targetDate),
      metrics: {
        current: goal.metrics.current,
        target: goal.metrics.target
      },
      status: 'pending'
    }));
  }
} 