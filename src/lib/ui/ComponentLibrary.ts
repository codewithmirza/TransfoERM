import type { ComponentType } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Toggle } from '@/components/ui/toggle'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { List } from '@/components/ui/list'
import { Table } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { Modal } from '@/components/ui/modal'

export interface ComponentConfig {
  type: string
  component: ComponentType
  defaultProps?: Record<string, any>
  variants?: Record<string, any>
  validation?: Record<string, any>
}

export class ComponentLibrary {
  private static instance: ComponentLibrary
  private components: Map<string, ComponentConfig>

  private constructor() {
    this.components = new Map()
    this.initializeComponents()
  }

  static getInstance(): ComponentLibrary {
    if (!ComponentLibrary.instance) {
      ComponentLibrary.instance = new ComponentLibrary()
    }
    return ComponentLibrary.instance
  }

  private initializeComponents() {
    // Form Components
    this.registerComponent({
      type: 'input',
      component: Input,
      defaultProps: {
        className: 'w-full rounded-lg border border-gray-300 px-4 py-2',
      },
      variants: {
        outlined: { className: 'border-2' },
        filled: { className: 'bg-gray-100' },
      },
      validation: {
        required: true,
        minLength: 2,
      },
    })

    this.registerComponent({
      type: 'button',
      component: Button,
      defaultProps: {
        className: 'px-4 py-2 rounded-lg',
      },
      variants: {
        primary: { className: 'bg-blue-500 text-white' },
        secondary: { className: 'bg-gray-500 text-white' },
        ghost: { className: 'bg-transparent hover:bg-gray-100' },
      },
    })

    // Layout Components
    this.registerComponent({
      type: 'card',
      component: Card,
      defaultProps: {
        className: 'rounded-lg shadow-lg p-6',
      },
      variants: {
        elevated: { className: 'shadow-xl' },
        bordered: { className: 'border border-gray-200' },
      },
    })

    this.registerComponent({
      type: 'form',
      component: Form,
      defaultProps: {
        className: 'space-y-6',
      },
    })

    // Data Display Components
    this.registerComponent({
      type: 'table',
      component: Table,
      defaultProps: {
        className: 'w-full border-collapse',
      },
    })

    this.registerComponent({
      type: 'list',
      component: List,
      defaultProps: {
        className: 'space-y-2',
      },
    })

    // Interactive Components
    this.registerComponent({
      type: 'select',
      component: Select,
      defaultProps: {
        className: 'w-full rounded-lg border border-gray-300',
      },
    })

    this.registerComponent({
      type: 'checkbox',
      component: Checkbox,
      defaultProps: {
        className: 'rounded border-gray-300',
      },
    })

    this.registerComponent({
      type: 'toggle',
      component: Toggle,
      defaultProps: {
        className: 'relative inline-flex h-6 w-11 items-center rounded-full',
      },
    })

    this.registerComponent({
      type: 'date-picker',
      component: DatePicker,
      defaultProps: {
        className: 'w-full rounded-lg border border-gray-300',
      },
    })

    // Navigation Components
    this.registerComponent({
      type: 'tabs',
      component: Tabs,
      defaultProps: {
        className: 'border-b border-gray-200',
      },
    })

    // Overlay Components
    this.registerComponent({
      type: 'modal',
      component: Modal,
      defaultProps: {
        className: 'fixed inset-0 z-50 flex items-center justify-center',
      },
    })
  }

  registerComponent(config: ComponentConfig) {
    this.components.set(config.type, config)
  }

  getComponent(type: string): ComponentConfig | undefined {
    return this.components.get(type)
  }

  getAllComponents(): ComponentConfig[] {
    return Array.from(this.components.values())
  }

  getComponentVariants(type: string): Record<string, any> | undefined {
    return this.components.get(type)?.variants
  }

  getDefaultProps(type: string): Record<string, any> | undefined {
    return this.components.get(type)?.defaultProps
  }

  createComponent(type: string, props: Record<string, any> = {}) {
    const config = this.components.get(type)
    if (!config) {
      throw new Error(`Component type '${type}' not found in library`)
    }

    const Component = config.component
    const defaultProps = config.defaultProps || {}
    
    return {
      component: Component,
      props: { ...defaultProps, ...props }
    }
  }

  validateProps(type: string, props: Record<string, any>): boolean {
    const config = this.components.get(type)
    if (!config?.validation) return true

    const validation = config.validation
    for (const [rule, value] of Object.entries(validation)) {
      if (!this.validateRule(rule, value, props)) {
        return false
      }
    }
    return true
  }

  private validateRule(rule: string, value: any, props: Record<string, any>): boolean {
    switch (rule) {
      case 'required':
        return value ? props.value != null : true
      case 'minLength':
        return props.value?.length >= value
      case 'maxLength':
        return props.value?.length <= value
      case 'pattern':
        return new RegExp(value).test(props.value)
      default:
        return true
    }
  }
} 