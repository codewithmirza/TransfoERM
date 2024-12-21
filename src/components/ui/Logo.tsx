import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-purple-400" />
      </div>
      <span className="font-bold text-xl text-white">TransfoERM</span>
    </div>
  )
} 