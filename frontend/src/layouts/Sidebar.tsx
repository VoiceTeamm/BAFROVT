import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, ArrowLeftRight, Lightbulb, Settings } from 'lucide-react'
import { cn } from '../lib/utils'
import { ROUTES } from '../routes'

const navItems = [
  { to: ROUTES.DASHBOARD,       icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.CHAT,            icon: MessageSquare,   label: 'AI Chat' },
  { to: ROUTES.TRANSACTIONS,    icon: ArrowLeftRight,  label: 'Transactions' },
  { to: ROUTES.RECOMMENDATIONS, icon: Lightbulb,       label: 'Recommendations' },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-background-dark flex flex-col py-6">
      <div className="px-6 mb-8">
        <span className="text-lg font-bold text-text-dark tracking-tight">BAFROVT</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-text-dark',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-auto">
        <NavLink
          to={ROUTES.CONFIG}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-white/10 hover:text-text-dark',
            )
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
