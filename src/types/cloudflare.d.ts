/// <reference types="@cloudflare/workers-types" />

declare global {
  interface Env {
    AI: {
      run(model: string, options: { messages: any[] }): Promise<any>
    }
    DB: D1Database
    CACHE: KVNamespace
  }

  type CustomWebSocket = {
    accept(): void
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
    close(code?: number, reason?: string): void
    addEventListener(type: string, handler: (event: CustomWebSocketEvent) => void): void
  }

  type CustomWebSocketEvent = {
    type: string
    data: string | ArrayBuffer | Blob
  }

  type CustomWebSocketPair = {
    0: CustomWebSocket
    1: CustomWebSocket
  }
}

export {}
