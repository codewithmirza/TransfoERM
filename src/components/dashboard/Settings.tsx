'use client'

import { Card } from '@/components/ui/card'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Database,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Settings() {
  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your account information and preferences',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive alerts and updates',
    },
    {
      title: 'Security',
      icon: Lock,
      description: 'Protect your account and data',
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize your dashboard experience',
    },
    {
      title: 'Data Management',
      icon: Database,
      description: 'Control your data and privacy settings',
    },
    {
      title: 'Integrations',
      icon: Globe,
      description: 'Connect with other tools and services',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <section.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                <p className="text-gray-600 mt-1">{section.description}</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Quick Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-6 w-6 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <input
              type="checkbox"
              className="h-6 w-6 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-gray-500">Toggle dark mode theme</p>
            </div>
            <input
              type="checkbox"
              className="h-6 w-6 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
