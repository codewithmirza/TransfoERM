export interface Point {
  x: number
  y: number
}

export interface Stroke {
  id: string
  points: Point[]
  color: string
  width: number
}

export interface DrawOperation {
  type: 'draw' | 'erase' | 'clear'
  stroke?: Stroke
  timestamp: number
}

export interface WhiteboardState {
  strokes: Stroke[]
  version: number
  operations: DrawOperation[]
  currentPath: Point[]
  paths: Stroke[]
} 