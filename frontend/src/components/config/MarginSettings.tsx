import { useState } from 'react'
import { Card, Input, Button } from '../ui'

export function MarginSettings() {
  const [targetMargin, setTargetMargin] = useState('')
  const [alertThreshold, setAlertThreshold] = useState('')

  return (
    <Card title="Target Margin" description="Set your profitability goals">
      <div className="space-y-4">
        <Input
          label="Target margin (%)"
          type="number"
          placeholder="e.g. 30"
          min="0"
          max="100"
          value={targetMargin}
          onChange={(e) => setTargetMargin(e.target.value)}
          suffix={<span className="text-xs font-medium">%</span>}
        />
        <Input
          label="Alert threshold (%)"
          type="number"
          placeholder="e.g. 20"
          min="0"
          max="100"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(e.target.value)}
          suffix={<span className="text-xs font-medium">%</span>}
        />
        {/* Save disabled until backend margin endpoint is ready */}
        <Button variant="primary" size="sm" disabled>
          Save
        </Button>
      </div>
    </Card>
  )
}
