import { EventEmitter } from 'events'
import { FormValidationEngine } from './FormValidationEngine'
import { DynamicFieldGenerator, FieldConfig } from './DynamicFieldGenerator'
import { debounce } from '@/lib/utils'

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  dirty: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
}

export interface FormConfig {
  id: string
  fields: FieldConfig[]
  initialValues?: Record<string, any>
  onSubmit?: (values: Record<string, any>) => Promise<void>
  onValidate?: (values: Record<string, any>) => Promise<Record<string, string[]>>
  onChange?: (values: Record<string, any>) => void
  onError?: (errors: Record<string, string[]>) => void
  validateOnChange?: boolean
  validateOnBlur?: boolean
  revalidateOnChange?: boolean
  debounceMs?: number
}

interface DependencyMap {
  [fieldName: string]: Set<string>
}

export class RealTimeFormHandler {
  private static instance: RealTimeFormHandler
  private emitter: EventEmitter
  private validationEngine: FormValidationEngine
  private fieldGenerator: DynamicFieldGenerator
  private forms: Map<string, FormState>
  private configs: Map<string, FormConfig>
  private dependencies: Map<string, DependencyMap>

  private constructor() {
    this.emitter = new EventEmitter()
    this.validationEngine = FormValidationEngine.getInstance()
    this.fieldGenerator = DynamicFieldGenerator.getInstance()
    this.forms = new Map()
    this.configs = new Map()
    this.dependencies = new Map()
    this.setupEventListeners()
  }

  static getInstance(): RealTimeFormHandler {
    if (!RealTimeFormHandler.instance) {
      RealTimeFormHandler.instance = new RealTimeFormHandler()
    }
    return RealTimeFormHandler.instance
  }

  private setupEventListeners() {
    this.emitter.on('field:change', this.handleFieldChange.bind(this))
    this.emitter.on('field:blur', this.handleFieldBlur.bind(this))
    this.emitter.on('form:submit', this.handleFormSubmit.bind(this))
  }

  registerForm(config: FormConfig) {
    this.configs.set(config.id, config)
    this.forms.set(config.id, this.createInitialState(config))
    this.fieldGenerator.registerForm({
      formId: config.id,
      fields: config.fields,
      onFieldChange: (field, value) => this.handleFieldChange(config.id, field, value),
      onFieldBlur: (field) => this.handleFieldBlur(config.id, field),
      onFieldFocus: (field) => this.handleFieldFocus(config.id, field)
    })

    // Build dependency graph
    this.buildDependencyGraph(config)
  }

  private createInitialState(config: FormConfig): FormState {
    return {
      values: config.initialValues || {},
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
      submitCount: 0
    }
  }

  private buildDependencyGraph(config: FormConfig) {
    const dependencyMap: DependencyMap = {}

    config.fields.forEach(field => {
      if (field.dependsOn) {
        field.dependsOn.forEach(dep => {
          if (!dependencyMap[dep.field]) {
            dependencyMap[dep.field] = new Set()
          }
          dependencyMap[dep.field].add(field.name)
        })
      }
    })

    this.dependencies.set(config.id, dependencyMap)
  }

  private handleFieldChange = debounce(async (formId: string, field: string, value: any) => {
    const config = this.configs.get(formId)
    const state = this.forms.get(formId)
    if (!config || !state) return

    // Update form state
    const newState: FormState = {
      ...state,
      values: { ...state.values, [field]: value },
      dirty: { ...state.dirty, [field]: true }
    }

    // Validate if needed
    if (config.validateOnChange) {
      const fieldErrors = await this.validationEngine.validateField(
        formId,
        field,
        value,
        newState.values
      )
      newState.errors = { ...newState.errors, [field]: fieldErrors.errors }
      newState.isValid = Object.values(newState.errors).every(e => e.length === 0)
    }

    // Update dependent fields
    const formDependencies = this.dependencies.get(formId)
    const dependentFields = formDependencies?.[field]
    if (dependentFields) {
      for (const depField of dependentFields) {
        const fieldConfig = config.fields.find(f => f.name === depField)
        if (fieldConfig?.dependsOn?.some(dep => dep.condition(value))) {
          // Re-validate and update dependent field
          const depValue = newState.values[depField]
          const depErrors = await this.validationEngine.validateField(
            formId,
            depField,
            depValue,
            newState.values
          )
          newState.errors = { ...newState.errors, [depField]: depErrors.errors }
        }
      }
    }

    // Update state and emit changes
    this.forms.set(formId, newState)
    this.emitter.emit('form:change', formId, newState)
    config.onChange?.(newState.values)

    if (!newState.isValid && config.onError) {
      config.onError(newState.errors)
    }
  }, 200)

  private async handleFieldBlur(formId: string, field: string) {
    const config = this.configs.get(formId)
    const state = this.forms.get(formId)
    if (!config || !state) return

    const newState: FormState = {
      ...state,
      touched: { ...state.touched, [field]: true }
    }

    if (config.validateOnBlur) {
      const fieldErrors = await this.validationEngine.validateField(
        formId,
        field,
        state.values[field],
        state.values
      )
      newState.errors = { ...newState.errors, [field]: fieldErrors.errors }
      newState.isValid = Object.values(newState.errors).every(e => e.length === 0)
    }

    this.forms.set(formId, newState)
    this.emitter.emit('form:change', formId, newState)
  }

  private handleFieldFocus(formId: string, field: string) {
    const state = this.forms.get(formId)
    if (!state) return

    this.emitter.emit('field:focus', formId, field)
  }

  private async handleFormSubmit(formId: string) {
    const config = this.configs.get(formId)
    const state = this.forms.get(formId)
    if (!config || !state) return

    const newState: FormState = {
      ...state,
      isSubmitting: true,
      submitCount: state.submitCount + 1
    }

    try {
      // Validate all fields
      const validationResult = await this.validationEngine.validateForm(
        formId,
        state.values
      )

      if (!validationResult.valid) {
        newState.errors = validationResult.errors
        newState.isValid = false
        config.onError?.(validationResult.errors)
        return
      }

      // Custom validation if provided
      if (config.onValidate) {
        const customErrors = await config.onValidate(state.values)
        if (Object.keys(customErrors).length > 0) {
          newState.errors = customErrors
          newState.isValid = false
          config.onError?.(customErrors)
          return
        }
      }

      // Submit form
      await config.onSubmit?.(state.values)
      
      // Reset form state after successful submission
      newState.isSubmitting = false
      newState.dirty = {}
      newState.touched = {}
      
    } catch (error) {
      newState.errors = {
        submit: [(error as Error).message]
      }
      newState.isValid = false
      config.onError?.(newState.errors)
    } finally {
      this.forms.set(formId, newState)
      this.emitter.emit('form:change', formId, newState)
    }
  }

  getFormState(formId: string): FormState | undefined {
    return this.forms.get(formId)
  }

  subscribe(formId: string, callback: (state: FormState) => void): () => void {
    const handler = (id: string, state: FormState) => {
      if (id === formId) callback(state)
    }
    this.emitter.on('form:change', handler)
    return () => this.emitter.off('form:change', handler)
  }

  reset(formId: string) {
    const config = this.configs.get(formId)
    if (config) {
      this.forms.set(formId, this.createInitialState(config))
      this.emitter.emit('form:reset', formId)
    }
  }

  // Public methods for form handling
  public submitForm(formId: string): Promise<void> {
    return this.handleFormSubmit(formId)
  }

  public updateField(formId: string, field: string, value: any): void {
    this.handleFieldChange(formId, field, value)
  }

  public blurField(formId: string, field: string): void {
    this.handleFieldBlur(formId, field)
  }

  public focusField(formId: string, field: string): void {
    this.handleFieldFocus(formId, field)
  }
} 