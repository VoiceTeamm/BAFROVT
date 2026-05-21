import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ChatPage } from '../pages/ChatPage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { RecommendationsPage } from '../pages/RecommendationsPage'
import { ConfigPage } from '../pages/ConfigPage'
import { MainLayout } from '../layouts/MainLayout'
import { PrivateRoutes } from './PrivateRoutes'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from './index'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={<PublicRoute><LoginPage /></PublicRoute>}
      />
      <Route
        path={ROUTES.REGISTER}
        element={<PublicRoute><RegisterPage /></PublicRoute>}
      />

      <Route element={<PrivateRoutes />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.CHAT} element={<ChatPage />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
          <Route path={ROUTES.RECOMMENDATIONS} element={<RecommendationsPage />} />
          <Route path={ROUTES.CONFIG} element={<ConfigPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
