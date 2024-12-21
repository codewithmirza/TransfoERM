'use client'

import { useEffect, useState } from 'react'
import { RealTimeFormHandler, FormState, FormConfig } from '@/lib/forms/RealTimeFormHandler'
import { DynamicFieldGenerator } from '@/lib/forms/DynamicFieldGenerator'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DynamicFormProps {
  formId: string
  config: FormConfig
  className?: string
  onSubmit?: (values: Record<string, any>) => Promise<void>
  onError?: (errors: Record<string, string[]>) => void
  onChange?: (values: Record<string, any>) => void
}

export function DynamicForm({
  formId,
  config,
  className,
  onSubmit,
  onError,
  onChange
}: DynamicFormProps) {
  const [formHandler] = useState(() => RealTimeFormHandler.getInstance())
  const [fieldGenerator] = useState(() => DynamicFieldGenerator.getInstance())
  const [formState, setFormState] = useState<FormState | null>(null)
  const [fields, setFields] = useState<any[]>([])

  useEffect(() => {
    // Register form with handlers
    formHandler.registerForm({
      ...config,
      id: formId,
      onSubmit,
      onError,
      onChange
    })

    // Subscribe to form state changes
    const unsubscribe = formHandler.subscribe(formId, (state) => {
      setFormState(state)
    })

    // Generate initial fields
    generateFields(config.initialValues || {})

    return () => {
      unsubscribe()
    }
  }, [formId, config, onSubmit, onError, onChange])

  const generateFields = async (values: Record<string, any>) => {
    const generatedFields = await Promise.all(
      config.fields.map(async (field) => 
        fieldGenerator.generateField(formId, field.name, values)
      )
    )
    setFields(generatedFields.filter(Boolean))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState) return

    try {
      await formHandler.submitForm(formId)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  if (!formState) return null

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'space-y-6',
        'animate-in fade-in-50',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {fields.map((field, index) => (
          <motion.div
            key={field.props.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {/* Field Label */}
            <label className="text-sm font-medium text-white/60">
              {field.props.label}
              {field.props.required && (
                <span className="text-red-400 ml-1">*</span>
              )}
            </label>

            {/* Field Component */}
            <field.component
              {...field.props}
              value={formState.values[field.props.name]}
              onChange={(value: any) => {
                formHandler.updateField(
                  formId,
                  field.props.name,
                  value?.target?.value ?? value
                )
              }}
              onBlur={() => formHandler.blurField(formId, field.props.name)}
              className={cn(
                "w-full bg-white/5 border border-white/10 rounded-lg p-2",
                "text-white placeholder:text-white/40",
                "focus:border-purple-500/50 focus:ring-0",
                "transition-all duration-200",
                formState.errors[field.props.name]?.length > 0 &&
                  "border-red-500/50 focus:border-red-500/50",
                field.props.className
              )}
            />

            {/* Field Errors */}
            <AnimatePresence>
              {formState.errors[field.props.name]?.map((error, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400 mt-1"
                >
                  {error}
                </motion.p>
              ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => formHandler.reset(formId)}
          className={cn(
            "px-4 py-2 rounded-lg",
            "bg-white/5 border border-white/10",
            "text-white/60 hover:text-white",
            "transition-all duration-200"
          )}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={formState.isSubmitting || !formState.isValid}
          className={cn(
            "px-4 py-2 rounded-lg",
            "bg-purple-500/20 border border-purple-500/30",
            "text-purple-400 hover:bg-purple-500/30",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )
} 