import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'
import { ROUTES } from '../routes'
import { TrendingUp } from 'lucide-react'

export function RegisterPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background-dark via-[#0f1729] to-background-dark overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-dark">VoiceFinance AI</h1>
            <p className="mt-1.5 text-sm text-gray-400">Gesti&oacute;n financiera inteligente</p>
          </div>

          <div className="bg-card-dark/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/20 p-6">
            <RegisterForm />
            <p className="mt-5 text-center text-sm text-gray-400">
              &iquest;Ya tienes cuenta?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary font-semibold hover:text-secondary transition-colors"
              >
                Iniciar sesi&oacute;n
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
