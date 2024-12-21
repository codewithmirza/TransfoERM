'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  RefreshCw,
  Brain,
  Lightbulb,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useModuleAI } from '@/hooks/useModuleAI'
import { subscribeToUpdates } from '@/lib/ai/analysis'
import type { AIAnalysisResult } from '@/types/ai'
import type { ModuleType } from '@/types/modules'
import type { TimeframeType } from '@/types/common'

export interface InsightProps {
  data: AIAnalysisResult | null;
  timeframe: TimeframeType;
  onRefresh: () => Promise<void>;
  module: ModuleType;
}

export function ModuleInsights({ data, timeframe, onRefresh, module }: InsightProps) {
  const [localInsights, setLocalInsights] = useState<AIAnalysisResult | null>(null);
  const { insights, loading, error, refresh } = useModuleAI({
    module: module,
    data: data,
    timeframe: timeframe
  });

  useEffect(() => {
    if (insights) {
      setLocalInsights(insights);
    }
  }, [insights]);

  // Add real-time updates handling
  useEffect(() => {
    const subscription = subscribeToUpdates(module, (update) => {
      if (!localInsights) return;

      if (update.type === 'insight') {
        setLocalInsights(prev => prev ? ({
          ...prev,
          insights: [
            ...prev.insights,
            {
              ...update.data,
              timestamp: new Date().toISOString(),
              isNew: true
            }
          ].sort((a, b) => b.confidence - a.confidence)
        }) : null);
      } else if (update.type === 'alert') {
        setLocalInsights(prev => prev ? ({
          ...prev,
          alerts: [
            ...prev.alerts,
            {
              ...update.data,
              timestamp: new Date().toISOString(),
              isNew: true
            }
          ].sort((a, b) => 
            b.level === 'critical' ? 1 : 
            a.level === 'critical' ? -1 : 
            0
          )
        }) : null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [localInsights]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 animate-pulse" />
          <span>Analyzing data...</span>
        </div>
      </Card>
    )
  }

  if (!localInsights) return null;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Insights */}
      <div className="space-y-6">
        {localInsights.insights.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Key Insights</h4>
            <div className="space-y-3">
              {localInsights.insights.map((insight, index) => (
                <div key={insight.id || index} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-1" />
                  <p className="text-sm">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends */}
        {localInsights.trends.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Trends</h4>
            <div className="space-y-3">
              {localInsights.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm">{trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {localInsights.alerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Alerts</h4>
            <div className="space-y-3">
              {localInsights.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-1 text-yellow-500" />
                  <p className="text-sm">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {localInsights.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Recommendations</h4>
            <div className="space-y-3">
              {localInsights.recommendations.map((rec, index) => (
                <div key={rec.id || index} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-teal-500 mt-1" />
                  <p className="text-sm">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confidence Score */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500">
          AI Confidence Score: {(localInsights.confidence * 100).toFixed(1)}%
        </p>
      </div>
    </Card>
  )
} 