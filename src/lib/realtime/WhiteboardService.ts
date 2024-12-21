import { CollaborativeService } from './CollaborativeService'

interface Point {
  x: number
  y: number
}

interface Stroke {
  id: string
  points: Point[]
  color: string
  width: number
}

interface WhiteboardState {
  strokes: Stroke[]
  version: number
}

export class WhiteboardService extends CollaborativeService {
  private state: WhiteboardState

  constructor(moduleId: string) {
    super(moduleId)
    this.state = {
      strokes: [],
      version: 0
    }
  }

  addStroke(stroke: Stroke): void {
    this.state = {
      strokes: [...this.state.strokes, stroke],
      version: this.state.version + 1
    }
    this.broadcast('whiteboard:stroke', { stroke })
  }

  clear(): void {
    this.state = {
      strokes: [],
      version: this.state.version + 1
    }
    this.broadcast('whiteboard:clear', null)
  }

  getState(): WhiteboardState {
    return { ...this.state }
  }
} 