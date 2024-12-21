import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}

export function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" suppressHydrationWarning>
      <div className="text-center" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" suppressHydrationWarning />
        <p className="mt-4" suppressHydrationWarning>Loading...</p>
      </div>
    </div>
  )
} 