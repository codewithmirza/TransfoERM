import { Env } from './types/env'
import { ErrorHandler } from './lib/error/ErrorHandler'

export class Router {
  private errorHandler: ErrorHandler

  constructor(private env: Env) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  async handle(request: Request, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        return await this.handleAPIRoute(request, path)
      }

      // Default response for unmatched routes
      return new Response('Not Found', { status: 404 })
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private async handleAPIRoute(request: Request, path: string): Promise<Response> {
    const segments = path.split('/').filter(Boolean)
    
    // Skip 'api' in the path segments
    const [_, module, ...rest] = segments

    switch (module) {
      case 'inventory':
        return await this.handleInventoryRoute(request, rest)
      case 'ai':
        return await this.handleAIRoute(request, rest)
      default:
        return new Response('Not Found', { status: 404 })
    }
  }

  private async handleInventoryRoute(request: Request, segments: string[]): Promise<Response> {
    // Handle inventory-specific routes
    return new Response('Inventory API', { status: 200 })
  }

  private async handleAIRoute(request: Request, segments: string[]): Promise<Response> {
    // Handle AI-specific routes
    return new Response('AI API', { status: 200 })
  }

  private handleError(error: Error): Response {
    this.errorHandler.handleError(error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 