import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { LoginForm } from '../components/auth/LoginForm'
import { ROUTES } from '../routes'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-light">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <Card>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-500">
            No account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
