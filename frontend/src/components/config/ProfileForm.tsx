import { useState } from 'react'
import { Card, Input, Button } from '../ui'
import { useAuthStore } from '../../store/authStore'

export function ProfileForm() {
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [businessName, setBusinessName] = useState('')

  return (
    <Card title="Business Profile" description="Your business information">
      <div className="space-y-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Business name"
          placeholder="Acme Corp"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        {/* Save disabled until backend profile endpoint is ready */}
        <Button variant="primary" size="sm" disabled>
          Save changes
        </Button>
      </div>
    </Card>
  )
}
