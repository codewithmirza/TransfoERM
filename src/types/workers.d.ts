declare module '@cloudflare/workers-types' {
  interface WebSocketPair {
    0: WebSocket
    1: WebSocket
  }

  interface WebSocket {
    accept(): void
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
    close(code?: number, reason?: string): void
    addEventListener(type: string, handler: (event: any) => void): void
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement
    dump(): Promise<ArrayBuffer>
    batch<T = any>(statements: D1PreparedStatement[]): Promise<T>
    exec<T = any>(query: string): Promise<T>
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement
    run<T = any>(): Promise<D1Result<T>>
    all<T = any>(): Promise<D1Result<T>[]>
    first<T = any>(): Promise<D1Result<T>>
  }

  interface D1Result<T = unknown> {
    results?: T[]
    success: boolean
    error?: string
    meta?: any
  }

  interface KVNamespace {
    get(key: string): Promise<string | null>
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
    delete(key: string): Promise<void>
  }
}

export {} 