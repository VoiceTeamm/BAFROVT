import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.email || 'Account'

  return (
    <header className="h-14 shrink-0 bg-card-light border-b border-gray-100 px-6 flex items-center justify-between shadow-sm">
      <span className="text-sm text-text-light font-medium">
        Hello, {displayName}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </header>
  )
}
