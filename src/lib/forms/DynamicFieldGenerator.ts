import { FormValidationEngine } from './FormValidationEngine'
import type { ModuleDataField } from '@/types/modules'
import { ComponentLibrary } from '@/lib/ui/ComponentLibrary'

export interface FieldConfig extends ModuleDataField {
  dependsOn?: {
    field: string
    condition: (value: any) => boolean
  }[]
  transform?: (value: any) => any
  formatters?: ((value: any) => any)[]
  validators?: ((value: any, formData: any) => boolean | Promise<boolean>)[]
  dynamicOptions?: {
    endpoint?: string
    dependsOn?: string[]
    transformer?: (data: any) => { label: string; value: any }[]
  }
  component?: string
  description?: string
  weight?: number
}

export interface FieldGeneratorConfig {
  formId: string
  fields: FieldConfig[]
  onFieldChange?: (field: string, value: any) => void
  onFieldBlur?: (field: string) => void
  onFieldFocus?: (field: string) => void
}

export class DynamicFieldGenerator {
  private static instance: DynamicFieldGenerator
  private validationEngine: FormValidationEngine
  private componentLibrary: ComponentLibrary
  private fieldConfigs: Map<string, FieldGeneratorConfig>

  private constructor() {
    this.validationEngine = FormValidationEngine.getInstance()
    this.componentLibrary = ComponentLibrary.getInstance()
    this.fieldConfigs = new Map()
  }

  static getInstance(): DynamicFieldGenerator {
    if (!DynamicFieldGenerator.instance) {
      DynamicFieldGenerator.instance = new DynamicFieldGenerator()
    }
    return DynamicFieldGenerator.instance
  }

  registerForm(config: FieldGeneratorConfig) {
    this.fieldConfigs.set(config.formId, config)
    
    // Register validation schema
    this.validationEngine.registerSchema(config.formId, {
      fields: config.fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: {
          rules: this.generateValidationRules(field),
          dependencies: field.dependsOn?.map(d => d.field),
          asyncValidators: field.validators,
          transformers: field.formatters
        }
      }), {})
    })
  }

  private generateValidationRules(field: FieldConfig) {
    const rules = []

    if (field.required) {
      rules.push({
        type: 'required',
        message: `${field.label || field.name} is required`
      })
    }

    if (field.validation) {
      if (field.validation.min !== undefined) {
        rules.push({
          type: 'min',
          value: field.validation.min,
          message: `${field.label || field.name} must be at least ${field.validation.min}`
        })
      }

      if (field.validation.max !== undefined) {
        rules.push({
          type: 'max',
          value: field.validation.max,
          message: `${field.label || field.name} must be at most ${field.validation.max}`
        })
      }

      if (field.validation.pattern) {
        rules.push({
          type: 'pattern',
          value: field.validation.pattern,
          message: `${field.label || field.name} has invalid format`
        })
      }
    }

    return rules
  }

  generateField(formId: string, fieldName: string, currentValues: Record<string, any>) {
    const config = this.fieldConfigs.get(formId)
    if (!config) throw new Error(`Form ${formId} not found`)

    const field = config.fields.find(f => f.name === fieldName)
    if (!field) throw new Error(`Field ${fieldName} not found in form ${formId}`)

    // Check dependencies
    if (field.dependsOn) {
      const shouldShow = field.dependsOn.every(dep => 
        dep.condition(currentValues[dep.field])
      )
      if (!shouldShow) return null
    }

    const componentType = this.determineComponentType(field)
    const component = this.componentLibrary.createComponent(componentType, {
      ...this.generateComponentProps(field, currentValues),
      onChange: (value: any) => {
        const transformedValue = this.applyTransformers(value, field)
        config.onFieldChange?.(fieldName, transformedValue)
      },
      onBlur: () => config.onFieldBlur?.(fieldName),
      onFocus: () => config.onFieldFocus?.(fieldName)
    })

    return component
  }

  private determineComponentType(field: FieldConfig): string {
    switch (field.type) {
      case 'string':
        return field.dynamicOptions ? 'select' : 'input'
      case 'number':
        return 'number-input'
      case 'boolean':
        return 'checkbox'
      case 'date':
        return 'date-picker'
      case 'object':
        return 'fieldset'
      case 'array':
        return 'multi-select'
      default:
        return 'input'
    }
  }

  private generateComponentProps(field: FieldConfig, currentValues: Record<string, any>) {
    return {
      label: field.label || field.name,
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled,
      value: currentValues[field.name],
      options: field.dynamicOptions ? this.fetchDynamicOptions(field, currentValues) : undefined
    }
  }

  private async fetchDynamicOptions(field: FieldConfig, currentValues: Record<string, any>) {
    if (!field.dynamicOptions?.endpoint) return []

    const dependencyValues = field.dynamicOptions.dependsOn?.reduce((acc, dep) => ({
      ...acc,
      [dep]: currentValues[dep]
    }), {})

    try {
      const response = await fetch(field.dynamicOptions.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dependencyValues)
      })

      const data = await response.json()
      return field.dynamicOptions.transformer?.(data) || data
    } catch (error) {
      console.error('Failed to fetch dynamic options:', error)
      return []
    }
  }

  private applyTransformers(value: any, field: FieldConfig): any {
    let transformedValue = field.transform?.(value) ?? value
    
    field.formatters?.forEach(formatter => {
      transformedValue = formatter(transformedValue)
    })

    return transformedValue
  }
} 