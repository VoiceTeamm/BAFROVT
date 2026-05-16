import { Bell, User } from 'lucide-react'

export function Navbar() {
  return (
    <header className="h-14 shrink-0 bg-card-light border-b border-gray-100 px-6 flex items-center justify-between shadow-sm">
      <div />
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
        </button>
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
          <User size={16} />
          <span className="font-medium">Account</span>
        </button>
      </div>
    </header>
  )
}
