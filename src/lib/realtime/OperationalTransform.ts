interface Operation {
  type: 'insert' | 'delete' | 'retain'
  chars?: string
  count?: number
}

interface Transform {
  clientOp: Operation[]
  serverOp: Operation[]
}

export class OperationalTransform {
  static transform(clientOp: Operation[], serverOp: Operation[]): Transform {
    let clientPos = 0
    let serverPos = 0
    const transformedClient: Operation[] = []
    const transformedServer: Operation[] = []

    while (clientPos < clientOp.length && serverPos < serverOp.length) {
      const client = clientOp[clientPos]
      const server = serverOp[serverPos]

      // Handle retain operations
      if (client.type === 'retain' && server.type === 'retain') {
        const count = Math.min(client.count!, server.count!)
        transformedClient.push({ type: 'retain', count })
        transformedServer.push({ type: 'retain', count })
        clientPos++
        serverPos++
        continue
      }

      // Handle insert operations
      if (client.type === 'insert') {
        transformedClient.push(client)
        transformedServer.push({ type: 'retain', count: client.chars!.length })
        clientPos++
        continue
      }

      if (server.type === 'insert') {
        transformedClient.push({ type: 'retain', count: server.chars!.length })
        transformedServer.push(server)
        serverPos++
        continue
      }

      // Handle delete operations
      if (client.type === 'delete' && server.type === 'delete') {
        const count = Math.min(client.count!, server.count!)
        clientPos++
        serverPos++
        continue
      }

      if (client.type === 'delete') {
        transformedClient.push(client)
        transformedServer.push({ type: 'retain', count: client.count! })
        clientPos++
        continue
      }

      if (server.type === 'delete') {
        transformedClient.push({ type: 'retain', count: server.count! })
        transformedServer.push(server)
        serverPos++
        continue
      }
    }

    // Handle remaining operations
    while (clientPos < clientOp.length) {
      transformedClient.push(clientOp[clientPos++])
    }

    while (serverPos < serverOp.length) {
      transformedServer.push(serverOp[serverPos++])
    }

    return { clientOp: transformedClient, serverOp: transformedServer }
  }

  static apply(doc: string, ops: Operation[]): string {
    let pos = 0
    let result = ''

    for (const op of ops) {
      switch (op.type) {
        case 'retain':
          result += doc.slice(pos, pos + op.count!)
          pos += op.count!
          break

        case 'insert':
          result += op.chars!
          break

        case 'delete':
          pos += op.count!
          break
      }
    }

    result += doc.slice(pos)
    return result
  }

  static compose(ops1: Operation[], ops2: Operation[]): Operation[] {
    const result: Operation[] = []
    let pos1 = 0
    let pos2 = 0

    while (pos1 < ops1.length && pos2 < ops2.length) {
      const op1 = ops1[pos1]
      const op2 = ops2[pos2]

      if (op1.type === 'retain' && op2.type === 'retain') {
        const count = Math.min(op1.count!, op2.count!)
        result.push({ type: 'retain', count })
        pos1++
        pos2++
      } else if (op1.type === 'insert') {
        result.push(op1)
        pos1++
      } else if (op2.type === 'insert') {
        result.push(op2)
        pos2++
      } else if (op1.type === 'delete') {
        result.push(op1)
        pos1++
      } else if (op2.type === 'delete') {
        result.push(op2)
        pos2++
      }
    }

    while (pos1 < ops1.length) result.push(ops1[pos1++])
    while (pos2 < ops2.length) result.push(ops2[pos2++])

    return result
  }
} 