import { AIRulesEngine } from '../ai/AIRulesEngine';
import { Rule, Goal } from '@/types/ai';

export class BusinessRulesEngine {
  private rules: Map<string, Rule> = new Map();
  private aiEngine: AIRulesEngine;

  constructor() {
    this.aiEngine = new AIRulesEngine();
  }

  async addRule(rule: Rule): Promise<void> {
    const validation = await this.aiEngine.validateRule(rule, Array.from(this.rules.values()));
    
    if (validation.isValid) {
      this.rules.set(rule.id, rule);
    } else {
      throw new Error(`Invalid rule: ${validation.reason}`);
    }
  }

  async evaluateContext(context: any): Promise<any> {
    const applicableRules = Array.from(this.rules.values())
      .filter(rule => rule.condition(context))
      .sort((a, b) => b.priority - a.priority);

    const results = [];
    for (const rule of applicableRules) {
      results.push(await rule.action(context));
    }

    return this.aiEngine.optimizeResults(results, context);
  }

  async generateGoals(insights: any): Promise<Goal[]> {
    return this.aiEngine.generateSmartGoals(insights);
  }
} 