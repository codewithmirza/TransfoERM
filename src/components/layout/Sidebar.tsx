import { useRouter } from 'next/router'
import { 
  Home,
  Bot,
  Book,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BarChart,
  Users,
  UserCircle,
  Calendar,
  Target,
  Wallet,
  DollarSign,
  Receipt,
  CreditCard,
  FileText,
  Brain,
  Files,
  Mic,
  LineChart
} from 'lucide-react'

export function Sidebar() {
  const router = useRouter()
  
  const iconMap = {
    Home,
    Bot,
    Book,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Truck,
    BarChart,
    Users,
    UserCircle,
    Calendar,
    Target,
    Wallet,
    DollarSign,
    Receipt,
    CreditCard,
    FileText,
    Brain,
    Files,
    Mic,
    LineChart
  }
  
  const navigationItems = [
    {
      section: 'Core',
      items: [
        { name: 'Dashboard', icon: 'Home', href: '/' },
        { name: 'AI Assistant', icon: 'Bot', href: '/ai' },
        { name: 'Knowledge Base', icon: 'Book', href: '/knowledge' }
      ]
    },
    {
      section: 'Inventory',
      items: [
        { name: 'Overview', icon: 'LayoutDashboard', href: '/inventory' },
        { name: 'Stock Management', icon: 'Package', href: '/inventory/stock' },
        { name: 'Orders', icon: 'ShoppingCart', href: '/inventory/orders' },
        { name: 'Suppliers', icon: 'Truck', href: '/inventory/suppliers' },
        { name: 'Analytics', icon: 'BarChart', href: '/inventory/analytics' }
      ]
    },
    {
      section: 'HR',
      items: [
        { name: 'Overview', icon: 'Users', href: '/hr' },
        { name: 'Employees', icon: 'UserCircle', href: '/hr/employees' },
        { name: 'Leave Management', icon: 'Calendar', href: '/hr/leave' },
        { name: 'Performance', icon: 'Target', href: '/hr/performance' },
        { name: 'Payroll', icon: 'Wallet', href: '/hr/payroll' }
      ]
    },
    {
      section: 'Finance',
      items: [
        { name: 'Overview', icon: 'DollarSign', href: '/finance' },
        { name: 'Transactions', icon: 'Receipt', href: '/finance/transactions' },
        { name: 'Billing', icon: 'CreditCard', href: '/finance/billing' },
        { name: 'Reports', icon: 'FileText', href: '/finance/reports' }
      ]
    },
    {
      section: 'AI & Analytics',
      items: [
        { name: 'Insights', icon: 'Brain', href: '/ai/insights' },
        { name: 'Documents', icon: 'Files', href: '/ai/documents' },
        { name: 'Voice Commands', icon: 'Mic', href: '/ai/voice' },
        { name: 'Analytics', icon: 'LineChart', href: '/analytics' }
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">TransfoERM</h1>
      </div>
      <nav className="mt-8">
        {navigationItems.map((section) => (
          <div key={section.section}>
            <h2 className="text-lg font-semibold text-gray-700">{section.section}</h2>
            <ul className="mt-2">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        router.pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
} 