'use client'

import { useState } from 'react'
import { useEnv } from '@/hooks/useEnv'
import { Switch, Button, Input } from '@/components/ui'

interface Settings {
  aiEnabled: boolean
  darkMode: boolean
  notifications: boolean
  language: string
  timezone: string
}

export function SettingsPage() {
  const env = useEnv()
  const [settings, setSettings] = useState<Settings>({
    aiEnabled: true,
    darkMode: false,
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  })

  const handleCheckedChange = (key: keyof Settings) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={handleCheckedChange('darkMode')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleCheckedChange('notifications')}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">AI Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable AI Features</span>
              <Switch
                checked={settings.aiEnabled}
                onCheckedChange={handleCheckedChange('aiEnabled')}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Localization</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={e => 
                    setSettings(prev => ({ ...prev, language: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={e =>
                    setSettings(prev => ({ ...prev, timezone: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  )
} 