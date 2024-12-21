import { useState } from 'react'
import { Bell, Search, User } from 'lucide-react'

export function Header() {
  const [notifications] = useState([
    { id: 1, message: 'New employee review pending' },
    { id: 2, message: 'Low stock alert: Item XYZ' }
  ])

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-gray-600" />
            <span className="text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  )
} 