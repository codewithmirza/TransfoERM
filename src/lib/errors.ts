export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class AuthError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export class RateLimitError extends APIError {
  constructor(retryAfter: number) {
    super(
      `Rate limit exceeded. Try again in ${retryAfter} seconds`,
      429,
      'RATE_LIMIT_ERROR'
    )
    this.name = 'RateLimitError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export function handleError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error
  }

  console.error('Unhandled Error:', error)
  
  return new APIError(
    error instanceof Error ? error.message : 'An unexpected error occurred'
  )
} 