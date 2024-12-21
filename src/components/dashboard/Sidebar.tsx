'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  Package,
  GitBranch,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  User,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

const sidebarItems = [
  {
    title: 'Command Center',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    title: 'Workflow',
    href: '/dashboard/workflow',
    icon: GitBranch,
  },
  {
    title: 'HR',
    href: '/dashboard/hr',
    icon: Users,
  },
  {
    title: 'Finance',
    href: '/dashboard/finance',
    icon: DollarSign,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart2,
  }
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "hidden lg:flex h-screen w-80 flex-col fixed left-0 top-0 bottom-0",
        "bg-black/40 backdrop-blur-xl border-r border-white/10"
      )}
    >
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-200">
          TransfoERM
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.li 
                key={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      "hover:bg-white/5",
                      isActive && "bg-blue-500/10 border border-blue-500/20"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-400" : "text-white/60"
                    )} />
                    <span className={cn(
                      "font-medium",
                      isActive ? "text-blue-400" : "text-white/60"
                    )}>
                      {item.title}
                    </span>
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {user?.email || 'Admin User'}
            </p>
            <p className="text-xs text-white/60">
              {user?.email || 'admin@transfoerm.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
