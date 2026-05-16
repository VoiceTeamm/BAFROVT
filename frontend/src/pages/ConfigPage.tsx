import { ProfileForm } from '../components/config/ProfileForm'
import { MarginSettings } from '../components/config/MarginSettings'
import { CategoryForm } from '../components/config/CategoryForm'
import { Card, Badge } from '../components/ui'

export function ConfigPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-text-light">Settings</h1>

      <ProfileForm />
      <MarginSettings />
      <CategoryForm />

      <Card title="API Connection" description="Backend integration status">
        <div className="flex items-center gap-3">
          <Badge variant="warning">Not connected</Badge>
          <span className="text-sm text-gray-400 font-mono">
            {import.meta.env.VITE_API_URL ?? 'VITE_API_URL not set'}
          </span>
        </div>
      </Card>
    </div>
  )
}
