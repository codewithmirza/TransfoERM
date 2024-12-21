import { RealtimeService, WebSocketConnection } from '@/lib/realtime/RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'
import type { Env } from '@/types/cloudflare'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade')
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair)
    const realtimeService = RealtimeService.getInstance()

    const connection: WebSocketConnection = {
      id: crypto.randomUUID(),
      ws: server as unknown as WebSocket,
      userId: 'anonymous' // Should be replaced with actual user ID from auth
    }

    server.accept()

    server.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data as string) as RealtimeMessage
        realtimeService.handleMessage(connection.id, message)
      } catch (error) {
        console.error('Failed to handle message:', error)
      }
    })

    server.addEventListener('close', () => {
      realtimeService.removeConnection(connection.id)
    })

    realtimeService.addConnection(connection)

    return new Response(null, {
      status: 101,
      webSocket: client
    })
  }
}