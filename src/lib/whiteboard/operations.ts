import { DrawOperation, Point, Stroke, WhiteboardState } from '@/types/whiteboard'

export class WhiteboardOperations {
  private state: WhiteboardState

  constructor() {
    this.state = {
      strokes: [],
      version: 0,
      operations: [],
      currentPath: [],
      paths: []
    }
  }

  startStroke(point: Point): void {
    this.state.currentPath = [point]
  }

  continueStroke(point: Point): void {
    if (this.state.currentPath.length > 0) {
      this.state.currentPath.push(point)
    }
  }

  endStroke(color: string, width: number): void {
    if (this.state.currentPath.length > 0) {
      const stroke: Stroke = {
        id: crypto.randomUUID(),
        points: [...this.state.currentPath],
        color,
        width
      }

      this.addOperation({
        type: 'draw',
        stroke,
        timestamp: Date.now()
      })

      this.state.currentPath = []
    }
  }

  clear(): void {
    this.addOperation({
      type: 'clear',
      timestamp: Date.now()
    })
  }

  private addOperation(operation: DrawOperation): void {
    this.state.operations.push(operation)
    this.applyOperation(operation)
    this.state.version++
  }

  private applyOperation(operation: DrawOperation): void {
    switch (operation.type) {
      case 'draw':
        if (operation.stroke) {
          this.state.strokes.push(operation.stroke)
        }
        break
      case 'clear':
        this.state.strokes = []
        break
    }
  }

  getState(): WhiteboardState {
    return {
      ...this.state,
      currentPath: [...this.state.currentPath],
      paths: [...this.state.paths],
      operations: [...this.state.operations],
      strokes: [...this.state.strokes]
    }
  }
} 