export const ROUTES = {
  LOGIN:           '/login',
  REGISTER:        '/register',
  DASHBOARD:       '/dashboard',
  CHAT:            '/chat',
  TRANSACTIONS:    '/transactions',
  RECOMMENDATIONS: '/recommendations',
  CONFIG:          '/config',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
