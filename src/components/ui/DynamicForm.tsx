'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils'

export interface DynamicFormProps {
  config: {
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'number' | 'email' | 'password' | 'select'
      options?: Array<{ label: string; value: string }>
      validation?: {
        required?: boolean
        min?: number
        max?: number
        pattern?: string
      }
    }>
    submitLabel?: string
  }
  onSubmit: (data: any) => void | Promise<void>
  className?: string
}

export function DynamicForm({ 
  config, 
  onSubmit,
  className 
}: DynamicFormProps) {
  const [loading, setLoading] = useState(false)

  // Build Zod schema from config
  const schema = z.object(
    config.fields.reduce((acc: Record<string, z.ZodType>, field) => {
      let validator: z.ZodType

      if (field.type === 'number') {
        let numberValidator = z.number()
        if (field.validation?.min !== undefined) {
          numberValidator = numberValidator.min(field.validation.min)
        }
        if (field.validation?.max !== undefined) {
          numberValidator = numberValidator.max(field.validation.max)
        }
        validator = numberValidator
      } else {
        let stringValidator = z.string()
        if (field.validation?.required) {
          stringValidator = stringValidator.min(1, 'This field is required')
        }
        if (field.validation?.pattern) {
          stringValidator = stringValidator.regex(new RegExp(field.validation.pattern))
        }
        if (field.type === 'email') {
          stringValidator = stringValidator.email()
        }
        validator = stringValidator
      }

      return { ...acc, [field.name]: validator }
    }, {})
  )

  const form = useForm({
    resolver: zodResolver(schema)
  })

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn('space-y-4', className)}
    >
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          
          {field.type === 'select' ? (
            <select
              {...form.register(field.name)}
              className="w-full p-2 border rounded"
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              {...form.register(field.name)}
              type={field.type}
              id={field.name}
              className="w-full"
            />
          )}

          {form.formState.errors[field.name] && (
            <p className="text-sm text-red-500">
              {form.formState.errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : config.submitLabel || 'Submit'}
      </Button>
    </form>
  )
} 