import { Card, Button, Input, Badge } from '../components/ui'

const notifications = [
  { label: 'Weekly spending summary', active: true },
  { label: 'Unusual activity alerts', active: true },
  { label: 'New recommendations', active: false },
  { label: 'Monthly report', active: true },
]

export function ConfigPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-text-light">Settings</h1>

      <Card title="Profile" description="Your personal information">
        <div className="space-y-4">
          <Input label="Full name" defaultValue="Jane Doe" />
          <Input label="Email" type="email" defaultValue="jane@example.com" />
          <Button variant="primary" size="sm">
            Save changes
          </Button>
        </div>
      </Card>

      <Card title="Notifications" description="Control what you receive">
        <div className="space-y-1 text-sm">
          {notifications.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className="text-text-light">{item.label}</span>
              <Badge variant={item.active ? 'success' : 'default'}>
                {item.active ? 'On' : 'Off'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="API Connection" description="Backend integration status">
        <div className="flex items-center gap-3">
          <Badge variant="warning">Not connected</Badge>
          <span className="text-sm text-gray-400 font-mono">
            {import.meta.env.VITE_API_URL}
          </span>
        </div>
      </Card>
    </div>
  )
}
