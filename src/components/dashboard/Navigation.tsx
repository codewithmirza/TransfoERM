'use client'

import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  BoxesIcon, 
  DollarSign, 
  Users2, 
  LayoutDashboard,
  Settings 
} from 'lucide-react'

const modules = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'HR',
    href: '/dashboard/hr',
    icon: Users
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory',
    icon: BoxesIcon
  },
  {
    name: 'Finance',
    href: '/dashboard/finance',
    icon: DollarSign
  },
  {
    name: 'CRM',
    href: '/dashboard/crm',
    icon: Users2
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {modules.map((module) => {
        const isActive = pathname === module.href
        const Icon = module.icon
        
        return (
          <Link
            key={module.href}
            href={module.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
              "hover:bg-white/10",
              isActive && "bg-white/10 text-purple-400"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{module.name}</span>
          </Link>
        )
      })}
    </nav>
  )
} 