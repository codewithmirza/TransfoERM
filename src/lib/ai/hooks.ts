import { useState, useCallback } from 'react';
import { AIService } from './AIService';
import { AIResponse, Goal } from '@/types/ai';
import { PerformanceMetrics } from '@/types/hr';

interface AIAnalysisResult {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  sentiment: number;
  confidence: number;
}

export function useAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AIAnalysisResult | null>(null);
  const aiService = AIService.getInstance();

  const generateInsights = useCallback(async (data: any) => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyze('Generate performance insights', {
        data,
        context: {
          timestamp: new Date(),
          dataType: typeof data
        }
      });
      
      const result = {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        opportunities: analysis.opportunities,
        risks: analysis.risks,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence
      };

      setLastAnalysis(result);
      return result;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [aiService]);

  const predictPerformance = useCallback(async (data: any) => {
    try {
      const prediction = await aiService.predict(data, {
        context: {
          timestamp: new Date(),
          dataType: typeof data
        }
      });
      
      return {
        predictedScore: prediction.score,
        confidenceLevel: prediction.confidence,
        recommendations: prediction.recommendations
      };
    } catch (error) {
      console.error('Performance prediction failed:', error);
      throw error;
    }
  }, [aiService]);

  const generateCustomCode = useCallback(async (
    prompt: string,
    context: Record<string, any>
  ): Promise<AIResponse> => {
    try {
      const response = await aiService.analyze('Generate custom code', {
        prompt,
        context,
        metadata: {
          timestamp: new Date(),
          contextType: typeof context
        }
      });

      return {
        code: response.code,
        tests: response.tests,
        documentation: {
          usage: response.documentation.usage,
          examples: response.documentation.examples,
          limitations: response.documentation.limitations
        }
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      throw error;
    }
  }, [aiService]);

  return {
    generateInsights,
    predictPerformance,
    generateCustomCode,
    isAnalyzing,
    lastAnalysis
  };
} 