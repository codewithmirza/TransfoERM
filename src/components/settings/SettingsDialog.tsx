'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/AuthProvider'
import {
  Settings,
  User,
  Building2,
  Key,
  Puzzle,
  Bell,
  Shield,
} from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      displayName: formData.get('displayName') as string,
      company: formData.get('company') as string,
      designation: formData.get('designation') as string,
      phone: formData.get('phone') as string,
    }

    try {
      await updateProfile(data)
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/90 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 gap-4 mb-6 bg-white/5">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-white"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Puzzle className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white/70">Full Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={user?.displayName || ''}
                  className="bg-white/5 border-white/10 text-white focus:border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  defaultValue={user?.company || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  defaultValue={user?.designation || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user?.phone || ''}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="organization">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  defaultValue={user?.company || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  defaultValue={user?.industry || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input
                  id="size"
                  name="size"
                  defaultValue={user?.companySize || ''}
                />
              </div>

              <Button className="w-full">Update Organization</Button>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-4">
              {/* Integration cards will go here */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Available Integrations</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your existing tools and services to enhance your workflow.
                </p>
                {/* Integration list will go here */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 