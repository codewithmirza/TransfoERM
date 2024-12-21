import { z } from 'zod'
import { EventEmitter } from 'events'

export type ValidationRule = {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message?: string
  validator?: (value: any) => boolean | Promise<boolean>
}

export type FieldValidation = {
  rules: ValidationRule[]
  dependencies?: string[]
  asyncValidators?: Array<(value: any, formData: any) => Promise<boolean>>
  transformers?: Array<(value: any) => any>
}

export type FormSchema = {
  fields: Record<string, FieldValidation>
  crossFieldValidation?: Array<{
    fields: string[]
    validator: (values: Record<string, any>) => boolean | Promise<boolean>
    message: string
  }>
}

export class FormValidationEngine {
  private static instance: FormValidationEngine
  private emitter: EventEmitter
  private schemas: Map<string, FormSchema>
  private zodSchemas: Map<string, z.ZodSchema>

  private constructor() {
    this.emitter = new EventEmitter()
    this.schemas = new Map()
    this.zodSchemas = new Map()
  }

  static getInstance(): FormValidationEngine {
    if (!FormValidationEngine.instance) {
      FormValidationEngine.instance = new FormValidationEngine()
    }
    return FormValidationEngine.instance
  }

  registerSchema(formId: string, schema: FormSchema) {
    this.schemas.set(formId, schema)
    this.generateZodSchema(formId, schema)
  }

  private generateZodSchema(formId: string, schema: FormSchema) {
    const zodSchema: Record<string, z.ZodTypeAny> = {}

    for (const [field, validation] of Object.entries(schema.fields)) {
      let fieldSchema: z.ZodTypeAny = z.any()

      for (const rule of validation.rules) {
        switch (rule.type) {
          case 'required':
            fieldSchema = z.string().min(1, rule.message || 'This field is required')
            break
          case 'min':
            if (typeof rule.value === 'number') {
              fieldSchema = z.number().min(rule.value, rule.message)
            } else {
              fieldSchema = z.string().min(rule.value as number, rule.message)
            }
            break
          case 'max':
            if (typeof rule.value === 'number') {
              fieldSchema = z.number().max(rule.value, rule.message)
            } else {
              fieldSchema = z.string().max(rule.value as number, rule.message)
            }
            break
          case 'pattern':
            fieldSchema = z.string().regex(new RegExp(rule.value), rule.message)
            break
          case 'custom':
            if (rule.validator) {
              fieldSchema = z.any().refine(rule.validator, {
                message: rule.message
              })
            }
            break
        }
      }

      zodSchema[field] = fieldSchema
    }

    this.zodSchemas.set(formId, z.object(zodSchema))
  }

  async validateField(
    formId: string,
    fieldName: string,
    value: any,
    formData: Record<string, any>
  ): Promise<{ valid: boolean; errors: string[] }> {
    const schema = this.schemas.get(formId)
    if (!schema) {
      throw new Error(`No schema found for form: ${formId}`)
    }

    const validation = schema.fields[fieldName]
    if (!validation) {
      return { valid: true, errors: [] }
    }

    const errors: string[] = []

    // Run synchronous validations
    for (const rule of validation.rules) {
      const isValid = await this.validateRule(rule, value, formData)
      if (!isValid && rule.message) {
        errors.push(rule.message)
      }
    }

    // Run async validations
    if (validation.asyncValidators) {
      const asyncResults = await Promise.all(
        validation.asyncValidators.map(validator => validator(value, formData))
      )
      
      if (asyncResults.some(result => !result)) {
        errors.push('Async validation failed')
      }
    }

    // Run cross-field validations
    if (schema.crossFieldValidation) {
      const relevantValidations = schema.crossFieldValidation.filter(
        v => v.fields.includes(fieldName)
      )

      for (const validation of relevantValidations) {
        const fieldsToCheck = validation.fields.reduce((acc, field) => {
          acc[field] = formData[field]
          return acc
        }, {} as Record<string, any>)

        const isValid = await validation.validator(fieldsToCheck)
        if (!isValid) {
          errors.push(validation.message)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  private async validateRule(
    rule: ValidationRule,
    value: any,
    formData: Record<string, any>
  ): Promise<boolean> {
    switch (rule.type) {
      case 'required':
        return value != null && value !== ''
      case 'min':
        return typeof value === 'number' ? value >= rule.value : value.length >= rule.value
      case 'max':
        return typeof value === 'number' ? value <= rule.value : value.length <= rule.value
      case 'pattern':
        return new RegExp(rule.value).test(value)
      case 'custom':
        return rule.validator ? rule.validator(value) : true
      default:
        return true
    }
  }

  async validateForm(
    formId: string,
    formData: Record<string, any>
  ): Promise<{ valid: boolean; errors: Record<string, string[]> }> {
    const schema = this.schemas.get(formId)
    if (!schema) {
      throw new Error(`No schema found for form: ${formId}`)
    }

    const errors: Record<string, string[]> = {}
    let isValid = true

    // Validate each field
    for (const [fieldName, _] of Object.entries(schema.fields)) {
      const { valid, errors: fieldErrors } = await this.validateField(
        formId,
        fieldName,
        formData[fieldName],
        formData
      )

      if (!valid) {
        isValid = false
        errors[fieldName] = fieldErrors
      }
    }

    // Emit validation results
    this.emitter.emit('validation:complete', {
      formId,
      valid: isValid,
      errors
    })

    return { valid: isValid, errors }
  }

  subscribeToValidation(
    callback: (result: { formId: string; valid: boolean; errors: Record<string, string[]> }) => void
  ): () => void {
    this.emitter.on('validation:complete', callback)
    return () => this.emitter.off('validation:complete', callback)
  }

  getZodSchema(formId: string): z.ZodSchema | undefined {
    return this.zodSchemas.get(formId)
  }
} 