import React from 'react'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, analytics..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-96"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            onClick={logout}
            className="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}