import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, ArrowLeftRight, Lightbulb, Settings, X, TrendingUp } from 'lucide-react'
import { cn } from '../lib/utils'
import { ROUTES } from '../routes'

const navItems = [
  { to: ROUTES.DASHBOARD,       icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.CHAT,            icon: MessageSquare,   label: 'AI Chat' },
  { to: ROUTES.TRANSACTIONS,    icon: ArrowLeftRight,  label: 'Transacciones' },
  { to: ROUTES.RECOMMENDATIONS, icon: Lightbulb,       label: 'Recomendaciones' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-60 shrink-0 bg-background-dark flex flex-col py-6 transition-transform duration-200',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <span className="text-lg font-bold text-text-dark tracking-tight">VoiceFinance</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1 text-gray-400 hover:text-text-dark hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
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
            onClick={onClose}
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
            Configuración
          </NavLink>
        </div>
      </aside>
    </>
  )
}
