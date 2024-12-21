import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react'
import type { AiCommandResult } from '@/types'

interface AiResponsePanelProps {
  result: AiCommandResult
  onAction?: (action: string) => void
}

export function AiResponsePanel({ result, onAction }: AiResponsePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Bot className="w-6 h-6 text-blue-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={result.confidence > 0.8 ? "bg-green-500" : "bg-yellow-500"}>
              {(result.confidence * 100).toFixed(0)}% Confident
            </Badge>
            <Badge>{result.module}</Badge>
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap">
            {isExpanded ? result.output : result.output.slice(0, 200)}
            {result.output.length > 200 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 hover:underline ml-2"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>

          {result.suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Suggested Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onAction?.(suggestion)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 