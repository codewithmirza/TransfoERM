'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/AuthProvider'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Building2,
  Key,
  Puzzle,
  Bell,
  Shield,
  Sparkles,
} from 'lucide-react'
import { UserData } from '@/types/user'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormField {
  id: keyof UserData
  label: string
  type: string
  disabled?: boolean
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const formFields: FormField[] = [
    { id: 'displayName', label: 'Full Name', type: 'text' },
    { id: 'email', label: 'Email', type: 'email', disabled: true },
    { id: 'company', label: 'Company', type: 'text' },
    { id: 'designation', label: 'Designation', type: 'text' },
    { id: 'phone', label: 'Phone Number', type: 'tel' },
  ]

  const getUserValue = (field: keyof UserData): string => {
    if (!user) return ''
    const value = user[field]
    return value || ''
  }

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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <div className="relative">
                <Settings className="w-5 h-5" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500/20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <span>Settings</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 gap-4 mb-6 bg-white/5 p-1 rounded-lg">
              {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'organization', icon: Building2, label: 'Organization' },
                { id: 'integrations', icon: Puzzle, label: 'Integrations' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md
                    text-white/60 hover:text-white
                    data-[state=active]:bg-white/10 
                    data-[state=active]:text-white
                    data-[state=active]:shadow-inner
                    transition-all duration-200
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleProfileUpdate}
                className="space-y-4"
              >
                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={`field-${field.id}`} className="space-y-2">
                      <Label htmlFor={`field-${field.id}`} className="text-white/70">
                        {field.label}
                      </Label>
                      <Input
                        id={`field-${field.id}`}
                        name={field.id.toString()}
                        type={field.type}
                        defaultValue={getUserValue(field.id)}
                        disabled={field.disabled}
                        className={`
                          bg-white/5 border-white/10 text-white
                          focus:border-blue-500/50 focus:ring-blue-500/20
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200
                        `}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full relative overflow-hidden
                    bg-gradient-to-r from-blue-500 to-purple-500
                    hover:from-blue-600 hover:to-purple-600
                    text-white font-medium h-11 rounded-lg
                    transition-all duration-200
                  `}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </motion.form>
            </TabsContent>

            <TabsContent value="organization">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {[
                  { id: 'company' as const, label: 'Organization Name' },
                  { id: 'industry' as const, label: 'Industry' },
                  { id: 'companySize' as const, label: 'Company Size' },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-white/70">
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      defaultValue={getUserValue(field.id)}
                      className={`
                        bg-white/5 border-white/10 text-white
                        focus:border-blue-500/50 focus:ring-blue-500/20
                        transition-all duration-200
                      `}
                    />
                  </div>
                ))}

                <Button
                  className={`
                    w-full relative overflow-hidden
                    bg-gradient-to-r from-blue-500 to-purple-500
                    hover:from-blue-600 hover:to-purple-600
                    text-white font-medium h-11 rounded-lg
                    transition-all duration-200
                  `}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Update Organization
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 p-4 bg-white/5">
                  <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-purple-400" />
                    Available Integrations
                  </h3>
                  <p className="text-sm text-white/60">
                    Connect your existing tools and services to enhance your workflow.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 