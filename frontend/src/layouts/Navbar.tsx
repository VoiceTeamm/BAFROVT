import { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, Menu, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAlerts } from '../hooks/useAlerts'
import { cn } from '../lib/utils'
import type { AlertType } from '../types'

interface NavbarProps {
  onMenuClick: () => void
}

const alertTypeLabel: Record<AlertType, string> = {
  COST_INCREASE: 'Aumento de costos',
  LOW_MARGIN: 'Margen bajo',
  CASH_FLOW: 'Flujo de caja',
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const { alerts, unreadCount, markRead } = useAlerts()
  const [alertOpen, setAlertOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = user?.name ?? 'Account'
  const businessType = user?.businessType

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAlertOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-14 shrink-0 bg-card-light border-b border-gray-100 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <div className="flex flex-col">
          <span className="text-sm text-text-light font-medium">Hola, {displayName}</span>
          {businessType && (
            <span className="text-xs text-gray-400 capitalize">{businessType}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Alert bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setAlertOpen((o) => !o)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {alertOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-light">Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-400">{unreadCount} sin leer</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {alerts.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">Sin notificaciones</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 transition-colors',
                        !alert.isRead ? 'bg-blue-50/50' : 'hover:bg-gray-50',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          {alertTypeLabel[alert.type] ?? alert.type}
                        </p>
                        <p className="text-sm text-text-light leading-snug">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(alert.createdAt).toLocaleDateString('es-BO')}
                        </p>
                      </div>
                      {!alert.isRead && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="shrink-0 rounded-full p-1 text-primary hover:bg-blue-100 transition-colors"
                          aria-label="Marcar como leída"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
          <span className="font-medium hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
