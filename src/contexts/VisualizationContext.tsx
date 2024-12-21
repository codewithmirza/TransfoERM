'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { VisualizationOptions } from '@/types/visualization'

interface VisualizationState {
  options: VisualizationOptions
  theme: 'light' | 'dark'
  isLoading: boolean
  error: Error | null
}

type VisualizationAction =
  | { type: 'SET_OPTIONS'; payload: Partial<VisualizationOptions> }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }

const initialState: VisualizationState = {
  options: {
    type: '2d',
    theme: 'light',
    interactive: true,
    animations: true
  },
  theme: 'light',
  isLoading: false,
  error: null
}

const VisualizationContext = createContext<{
  state: VisualizationState
  dispatch: React.Dispatch<VisualizationAction>
} | null>(null)

function visualizationReducer(
  state: VisualizationState,
  action: VisualizationAction
): VisualizationState {
  switch (action.type) {
    case 'SET_OPTIONS':
      return {
        ...state,
        options: { ...state.options, ...action.payload }
      }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export function VisualizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(visualizationReducer, initialState)

  return (
    <VisualizationContext.Provider value={{ state, dispatch }}>
      {children}
    </VisualizationContext.Provider>
  )
}

export function useVisualization() {
  const context = useContext(VisualizationContext)
  if (!context) {
    throw new Error('useVisualization must be used within a VisualizationProvider')
  }
  return context
} 