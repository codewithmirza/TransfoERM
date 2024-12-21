'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface CommandSuggestionsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function CommandSuggestions({ suggestions, onSelect }: CommandSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Suggestions
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              text-sm px-3 py-1.5 rounded-lg
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:border-white/20
              text-white/60 hover:text-white
              transition-colors
            `}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  )
} 