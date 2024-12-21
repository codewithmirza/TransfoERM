import { useAIContext } from '@/contexts/AIContext'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface AIEnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAIComplete?: (suggestion: string) => void
}

export function AIEnhancedInput({ onAIComplete, ...props }: AIEnhancedInputProps) {
  const [loading, setLoading] = useState(false)
  const { complete } = useAIContext()

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      setLoading(true)
      try {
        const suggestion = await complete(e.currentTarget.value)
        onAIComplete?.(suggestion)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Input 
        {...props} 
        onKeyDown={handleKeyDown}
        className={`glass-morphism ${loading ? 'pr-10' : ''}`}
      />
      {loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </motion.div>
      )}
    </motion.div>
  )
} 