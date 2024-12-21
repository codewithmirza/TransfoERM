import { ErrorHandler, ErrorSeverity } from './ErrorHandler'

export const handleError = (error: Error): Response => {
  const errorHandler = ErrorHandler.getInstance()
  errorHandler.handleError(error, ErrorSeverity.HIGH)

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

export { ErrorHandler, ErrorSeverity }

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'AUTH_ERROR', 401, context)
  }
}

export class AIError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'AI_ERROR', 500, context)
  }
}
