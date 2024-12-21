export interface VisualizationData {
  type: 'process' | 'analytics' | 'workflow'
  data: any
  options?: VisualizationOptions
}

export interface VisualizationOptions {
  type: '2d' | '3d'
  theme?: 'light' | 'dark'
  interactive?: boolean
  animations?: boolean
  dimensions?: {
    width: number
    height: number
    depth?: number
  }
  camera?: {
    position: [number, number, number]
    target: [number, number, number]
  }
}

export interface VisualizationResult {
  scene: any
  controls: any
  animations: any[]
  interactions: {
    onClick?: (event: any) => void
    onHover?: (event: any) => void
    onDrag?: (event: any) => void
  }
} 