import { ComponentLibrary } from './ComponentLibrary'
import { cn } from '@/lib/utils'

interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    [key: string]: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      base: string
      sm: string
      lg: string
      xl: string
      [key: string]: string
    }
    fontWeight: {
      normal: number
      medium: number
      bold: number
      [key: string]: number
    }
  }
  spacing: {
    unit: number
    scale: number[]
    [key: string]: number | number[]
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
    [key: string]: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    [key: string]: string
  }
  animations: {
    duration: {
      fast: string
      normal: string
      slow: string
      [key: string]: string
    }
    easing: {
      default: string
      smooth: string
      bounce: string
      [key: string]: string
    }
  }
}

export class ThemeSystem {
  private static instance: ThemeSystem
  private themes: Map<string, ThemeConfig>
  private activeTheme: string
  private componentLibrary: ComponentLibrary

  private constructor() {
    this.themes = new Map()
    this.activeTheme = 'default'
    this.componentLibrary = ComponentLibrary.getInstance()
    this.initializeDefaultThemes()
  }

  static getInstance(): ThemeSystem {
    if (!ThemeSystem.instance) {
      ThemeSystem.instance = new ThemeSystem()
    }
    return ThemeSystem.instance
  }

  private initializeDefaultThemes() {
    const defaultTheme: ThemeConfig = {
      name: 'Default Theme',
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          base: '1rem',
          sm: '0.875rem',
          lg: '1.125rem',
          xl: '1.25rem',
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          bold: 700,
        },
      },
      spacing: {
        unit: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
          bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
      },
    }

    const darkTheme: ThemeConfig = {
      name: 'Dark Theme',
      colors: {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        accent: '#34D399',
        background: '#111827',
        text: '#F9FAFB',
      },
      typography: defaultTheme.typography,
      spacing: defaultTheme.spacing,
      breakpoints: defaultTheme.breakpoints,
      shadows: defaultTheme.shadows,
      animations: defaultTheme.animations,
    }

    this.registerTheme('default', defaultTheme)
    this.registerTheme('dark', darkTheme)
  }

  registerTheme(name: string, config: ThemeConfig) {
    this.themes.set(name, config)
  }

  setActiveTheme(name: string) {
    if (!this.themes.has(name)) {
      throw new Error(`Theme '${name}' not found`)
    }
    this.activeTheme = name
    this.applyTheme()
  }

  getActiveTheme(): ThemeConfig {
    return this.themes.get(this.activeTheme)!
  }

  private applyTheme() {
    const theme = this.getActiveTheme()
    document.documentElement.style.setProperty('--primary', theme.colors.primary)
    document.documentElement.style.setProperty('--secondary', theme.colors.secondary)
    document.documentElement.style.setProperty('--accent', theme.colors.accent)
    document.documentElement.style.setProperty('--background', theme.colors.background)
    document.documentElement.style.setProperty('--text', theme.colors.text)
    // Apply other theme properties...
  }

  private generateThemeClasses(component: string): string {
    const theme = this.getActiveTheme()
    const baseClasses = ['transition-all', theme.animations.duration.normal]
    
    switch (component) {
      case 'button':
        return cn(
          baseClasses,
          `bg-${theme.colors.primary}`,
          `text-${theme.colors.text}`,
          `rounded-${theme.spacing.unit}`,
          `px-${theme.spacing.unit * 2}`,
          `py-${theme.spacing.unit}`
        )
      default:
        return ''
    }
  }
} 