import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { RegisterForm } from '../components/auth/RegisterForm'
import { ROUTES } from '../routes'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-light">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Start your financial journey
          </p>
        </div>

        <Card>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
