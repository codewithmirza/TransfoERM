export class APIResponse {
  static ok(data: any): Response {
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  static error(message: string, status = 500): Response {
    return new Response(JSON.stringify({ success: false, error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  static unauthorized(message = 'Unauthorized'): Response {
    return this.error(message, 401)
  }

  static notFound(message = 'Not Found'): Response {
    return this.error(message, 404)
  }
} 