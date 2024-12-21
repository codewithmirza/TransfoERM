import { D1Database, KVNamespace } from '@cloudflare/workers-types'
import { RealtimeUpdate } from '@/types/realtime'
import { OpenAIMessage } from '@/types/openai'

// Define WebSocket types without importing from workers-types
interface WebSocketEvent {
  type: string
  data: string | ArrayBuffer | Blob
}

interface WebSocketEventMap {
  message: WebSocketEvent
  close: WebSocketEvent
}

interface WebSocket {
  accept(): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
  close(code?: number, reason?: string): void
  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    handler: (event: WebSocketEventMap[K]) => void
  ): void
}

interface Env {
  AI: {
    run(model: string, options: { messages: OpenAIMessage[] }): Promise<any>
  }
  DB: D1Database
  CACHE: KVNamespace
}

interface WebSocketMessage {
  type: RealtimeUpdate['type']
  data: any
  sessionId: string
}

export class WebSocketHandler {
  private sessions: Map<string, WebSocket>
  private env: Env

  constructor(env: Env) {
    this.sessions = new Map()
    this.env = env
  }

  handleConnection(request: Request): Response {
    const upgradeHeader = request.headers.get('Upgrade')
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const pair = new WebSocketPair()
    const client = pair[0]
    const server = pair[1]

    server.accept()

    const sessionId = crypto.randomUUID()
    this.sessions.set(sessionId, server)

    server.addEventListener('message', async (event: WebSocketEvent) => {
      const data = typeof event.data === 'string' 
        ? event.data 
        : new TextDecoder().decode(event.data as ArrayBuffer)
      await this.handleMessage(sessionId, data)
    })

    server.addEventListener('close', () => {
      this.sessions.delete(sessionId)
    })

    return new Response(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade'
      }
    })
  }

  private async handleMessage(sessionId: string, data: string) {
    const message = JSON.parse(data) as WebSocketMessage
    const socket = this.sessions.get(sessionId)
    if (!socket) return

    try {
      switch (message.type) {
        case 'command_response':
          await this.handleCommandResponse(socket, message)
          break
        case 'workflow_suggestion':
          await this.handleWorkflowSuggestion(socket, message)
          break
        case 'code_generation':
          await this.handleCodeGeneration(socket, message)
          break
        case 'module_update':
          await this.handleModuleUpdate(socket, message)
          break
        case 'notification':
          await this.handleNotification(socket, message)
          break
      }
    } catch (error) {
      console.error('Message handling error:', error)
      socket.send(JSON.stringify({
        type: 'error',
        data: {
          message: 'Failed to process message',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date()
      }))
    }
  }

  private async handleCommandResponse(socket: WebSocket, message: WebSocketMessage) {
    const response = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{ role: 'user', content: message.data.command }]
    })
    
    socket.send(JSON.stringify({
      type: 'command_response',
      data: response,
      timestamp: new Date()
    }))
  }

  private async handleWorkflowSuggestion(socket: WebSocket, message: WebSocketMessage) {
    const suggestions = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: 'system',
          content: 'Generate workflow suggestions based on the context.'
        },
        {
          role: 'user',
          content: JSON.stringify(message.data)
        }
      ]
    })
    
    socket.send(JSON.stringify({
      type: 'workflow_suggestion',
      data: suggestions,
      timestamp: new Date()
    }))
  }

  private async handleCodeGeneration(socket: WebSocket, message: WebSocketMessage) {
    const code = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: 'system',
          content: 'Generate code based on the requirements.'
        },
        {
          role: 'user',
          content: JSON.stringify(message.data)
        }
      ]
    })
    
    socket.send(JSON.stringify({
      type: 'code_generation',
      data: code,
      timestamp: new Date()
    }))
  }

  private async handleModuleUpdate(socket: WebSocket, message: WebSocketMessage) {
    const { module, data } = message.data
    await this.env.DB.prepare(
      'INSERT INTO module_updates (module, data) VALUES (?, ?)'
    ).bind(module, JSON.stringify(data)).run()
    
    this.broadcast({
      type: 'module_update',
      module,
      data,
      timestamp: new Date()
    })
  }

  private async handleNotification(socket: WebSocket, message: WebSocketMessage) {
    const key = `notification:${message.sessionId}:${Date.now()}`
    await this.env.CACHE.put(key, JSON.stringify(message.data))
    
    this.broadcast({
      type: 'notification',
      data: message.data,
      timestamp: new Date()
    })
  }

  broadcast(update: RealtimeUpdate) {
    const message = JSON.stringify(update)
    this.sessions.forEach(socket => {
      socket.send(message)
    })
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    const handler = new WebSocketHandler(env)
    return Promise.resolve(handler.handleConnection(request))
  }
} 