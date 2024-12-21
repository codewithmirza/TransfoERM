import { CollaborativeService } from './CollaborativeService'

interface DocumentState {
  content: string
  version: number
  lastModified: number
}

export class CollaborativeDocument extends CollaborativeService {
  private state: DocumentState

  constructor(moduleId: string) {
    super(moduleId)
    this.state = {
      content: '',
      version: 0,
      lastModified: Date.now()
    }
  }

  updateContent(content: string): void {
    this.state = {
      content,
      version: this.state.version + 1,
      lastModified: Date.now()
    }
    this.broadcast('document:update', this.state)
  }

  getState(): DocumentState {
    return { ...this.state }
  }
} 