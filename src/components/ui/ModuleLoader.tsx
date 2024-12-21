import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ModuleLoaderProps {
  message?: string
  className?: string
}

export function ModuleLoader({ message = "Loading module...", className }: ModuleLoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8",
      "bg-black/40 backdrop-blur-xl rounded-lg border border-white/10",
      className
    )}>
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
      <p className="text-white/60">{message}</p>
    </div>
  )
} 