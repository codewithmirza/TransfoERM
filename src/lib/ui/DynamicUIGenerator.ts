import type { ComponentType } from 'react'
import type { ModuleConfig, ModuleDataField } from '@/types/modules'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Toggle } from '@/components/ui/toggle'
import { Form } from '@/components/ui/form'
import { List } from '@/components/ui/list'
import { cn } from '@/lib/utils'

interface UIComponent {
  type: string
  props: Record<string, any>
  children?: UIComponent[]
  validation?: Record<string, any>
  events?: Record<string, Function>
}

interface UISchema {
  layout: 'grid' | 'flex' | 'flow'
  components: UIComponent[]
  theme: Record<string, any>
  responsive: Record<string, any>
}

interface DefaultComponent {
  type: string
  component: ComponentType
}

export class DynamicUIGenerator {
  private componentRegistry: Map<string, ComponentType> = new Map()
  
  constructor() {
    this.initializeDefaultComponents()
  }

  private initializeDefaultComponents() {
    const defaultComponents: DefaultComponent[] = [
      { type: 'input', component: Input },
      { type: 'button', component: Button },
      { type: 'checkbox', component: Checkbox },
      { type: 'toggle', component: Toggle },
      { type: 'date-picker', component: DatePicker },
      { type: 'form', component: Form },
      { type: 'list', component: List },
    ]

    defaultComponents.forEach(({ type, component }) => {
      this.componentRegistry.set(type, component)
    })
  }

  async generateUIFromModule(moduleConfig: ModuleConfig): Promise<UISchema> {
    const schema: UISchema = {
      layout: 'flow',
      components: [],
      theme: this.getThemeDefaults(),
      responsive: this.getResponsiveDefaults()
    }

    try {
      const analyzedStructure = await this.analyzeModuleStructure(moduleConfig)
      schema.layout = this.determineOptimalLayout(analyzedStructure)
      schema.components = await this.generateComponents(analyzedStructure)
      this.addResponsiveBehavior(schema)
      return schema
    } catch (error) {
      console.error('Failed to generate UI schema:', error)
      throw new Error('UI Generation failed')
    }
  }

  private async analyzeModuleStructure(config: ModuleConfig) {
    return {
      dataStructure: config.dataStructure,
      interactions: config.interactions,
      complexity: this.calculateComplexity(config)
    }
  }

  private determineOptimalLayout(structure: any): 'grid' | 'flex' | 'flow' {
    const { complexity, interactions } = structure
    
    if (complexity > 0.8) return 'grid'
    if (interactions.length > 5) return 'flex'
    return 'flow'
  }

  private async generateComponents(structure: any): Promise<UIComponent[]> {
    const components: UIComponent[] = []
    
    for (const data of structure.dataStructure) {
      components.push(await this.createComponent(data))
    }
    
    return components
  }

  private getThemeDefaults(): Record<string, any> {
    return {
      colors: {
        primary: 'blue',
        secondary: 'purple',
        accent: 'emerald'
      },
      spacing: {
        base: 4,
        padding: 16,
        margin: 16
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        baseSize: 16
      }
    }
  }

  private getResponsiveDefaults(): Record<string, any> {
    return {
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      behaviors: {
        stack: ['sm'],
        hide: [],
        show: []
      }
    }
  }

  private calculateComplexity(config: ModuleConfig): number {
    let score = 0
    score += config.dataStructure?.length || 0
    score += config.interactions?.length || 0
    score += config.customizations?.length || 0
    return Math.min(score / 20, 1)
  }

  private async createComponent(data: ModuleDataField): Promise<UIComponent> {
    return {
      type: this.determineComponentType(data),
      props: this.generateComponentProps(data),
      validation: this.generateValidation(data),
      events: this.generateEventHandlers(data)
    }
  }

  private determineComponentType(data: any): string {
    // Determine the most appropriate component type based on data
    switch (data.type) {
      case 'string': return 'input'
      case 'number': return 'number-input'
      case 'boolean': return 'toggle'
      case 'date': return 'date-picker'
      case 'object': return 'form-group'
      case 'array': return 'list'
      default: return 'text'
    }
  }

  private generateComponentProps(data: any): Record<string, any> {
    return {
      label: data.label || this.generateLabel(data.name),
      placeholder: data.placeholder || `Enter ${data.name}`,
      required: data.required || false,
      disabled: data.disabled || false
    }
  }

  private generateValidation(data: any): Record<string, any> {
    return {
      required: data.required || false,
      pattern: data.pattern || null,
      min: data.min || null,
      max: data.max || null,
      custom: data.customValidation || null
    }
  }

  private generateEventHandlers(data: any): Record<string, Function> {
    return {
      onChange: (value: any) => this.handleChange(data.name, value),
      onBlur: () => this.handleBlur(data.name),
      onFocus: () => this.handleFocus(data.name)
    }
  }

  private generateLabel(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private handleChange(name: string, value: any) {
    // Handle value changes
    console.log(`${name} changed to:`, value)
  }

  private handleBlur(name: string) {
    // Handle blur events
    console.log(`${name} blur event`)
  }

  private handleFocus(name: string) {
    // Handle focus events
    console.log(`${name} focus event`)
  }

  private addResponsiveBehavior(schema: UISchema) {
    // Add responsive behaviors to components
    schema.components = schema.components.map(component => ({
      ...component,
      props: {
        ...component.props,
        className: this.generateResponsiveClasses(component)
      }
    }))
  }

  private generateResponsiveClasses(component: UIComponent): string {
    // Updated to match our existing UI style
    return cn(
      'w-full transition-all duration-200',
      'bg-white/5 border border-white/10',
      'rounded-lg p-4',
      component.type === 'form-group' ? 'flex flex-col gap-4' : '',
      component.type === 'input' ? 'text-white/60 focus:border-purple-500/50' : ''
    )
  }
} 