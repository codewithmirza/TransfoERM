import { cn } from '@/lib/utils'
import { Navigation } from '@/components/dashboard/Navigation'
import { Logo } from '@/components/ui/Logo'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("w-64 bg-gray-900 h-screen p-4 flex flex-col", className)}>
      <div className="mb-8">
        <Logo />
      </div>
      <Navigation />
      <div className="mt-auto">
        {/* Settings and user profile will go here */}
      </div>
    </aside>
  )
} 