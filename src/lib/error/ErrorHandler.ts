import { Logger, LogLevel } from '../logging/Logger'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  timestamp: number
  errorDetails: string
  [key: string]: any
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private logger: Logger

  private constructor() {
    this.logger = Logger.getInstance()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  handleError(error: Error, severity: ErrorSeverity = ErrorSeverity.HIGH, context?: Record<string, any>): Error {
    const timestamp = Date.now()
    const errorContext = {
      ...context,
      timestamp,
      errorDetails: error.message
    }

    this.logger.log(
      this.mapSeverityToLogLevel(severity),
      error.message,
      errorContext
    )
    return error;
  }

  private mapSeverityToLogLevel(severity: ErrorSeverity): LogLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return LogLevel.INFO
      case ErrorSeverity.MEDIUM:
        return LogLevel.WARN
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return LogLevel.ERROR
      default:
        return LogLevel.ERROR
    }
  }
} 