import { RealtimeService } from './RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'

interface DocumentContent {
  text: string
  version: number
  lastModified: number
}

interface DocumentState {
  documents: Map<string, DocumentContent>
  version: number
}

export class CollaborativeDocumentService {
  private realtimeService: RealtimeService
  private state: DocumentState

  constructor() {
    this.realtimeService = RealtimeService.getInstance()
    this.state = {
      documents: new Map(),
      version: 0
    }

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.realtimeService.on('document:update', this.handleDocumentUpdate.bind(this))
    this.realtimeService.on('document:sync', this.handleDocumentSync.bind(this))
  }

  private async handleDocumentUpdate(message: RealtimeMessage): Promise<void> {
    const { documentId, content } = message.payload
    const doc = this.state.documents.get(documentId)

    if (doc && content.version > doc.version) {
      this.state.documents.set(documentId, {
        ...content,
        lastModified: Date.now()
      })
      this.state.version++
    }
  }

  private async handleDocumentSync(message: RealtimeMessage): Promise<void> {
    const { documentId } = message.payload
    const doc = this.state.documents.get(documentId)

    if (doc) {
      await this.realtimeService.broadcast({
        type: 'document:sync:response',
        payload: {
          documentId,
          content: doc
        },
        userId: 'system',
        timestamp: Date.now()
      })
    }
  }

  async updateDocument(documentId: string, content: string): Promise<void> {
    const doc = this.state.documents.get(documentId) || {
      text: '',
      version: 0,
      lastModified: Date.now()
    }

    const newDoc = {
      text: content,
      version: doc.version + 1,
      lastModified: Date.now()
    }

    this.state.documents.set(documentId, newDoc)
    this.state.version++

    await this.realtimeService.broadcast({
      type: 'document:update',
      payload: {
        documentId,
        content: newDoc
      },
      userId: 'system',
      timestamp: Date.now()
    })
  }
} 