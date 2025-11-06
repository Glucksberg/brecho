/**
 * Professional Logger
 * Uses pino for structured logging in production
 * Uses console for development (more readable)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const levelStr = level.toUpperCase().padEnd(5)

    if (context && Object.keys(context).length > 0) {
      return `[${timestamp}] ${levelStr} ${message} ${JSON.stringify(context)}`
    }

    return `[${timestamp}] ${levelStr} ${message}`
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context))
    } else {
      // In production, could integrate with external service (Datadog, Sentry, etc)
      console.log(JSON.stringify({
        level: 'info',
        message,
        ...context,
        timestamp: new Date().toISOString()
      }))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, context))
    } else {
      console.warn(JSON.stringify({
        level: 'warn',
        message,
        ...context,
        timestamp: new Date().toISOString()
      }))
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message, context))
    } else {
      // In production, send to error tracking service
      console.error(JSON.stringify({
        level: 'error',
        message,
        ...context,
        timestamp: new Date().toISOString(),
        stack: context?.error?.stack
      }))

      // TODO: Send to Sentry or similar service
      // Sentry.captureException(context?.error, { extra: context })
    }
  }

  /**
   * Helper to sanitize sensitive data from logs
   */
  sanitize(data: any): any {
    const sensitiveKeys = ['password', 'senha', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret']

    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sanitized = { ...data }

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitize(sanitized[key])
      }
    }

    return sanitized
  }
}

// Export singleton instance
export const logger = new Logger()

// Export helper for HTTP request logging
export function logRequest(method: string, url: string, status: number, duration: number) {
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

  logger[level]('HTTP Request', {
    method,
    url,
    status,
    duration: `${duration}ms`
  })
}

// Export helper for database query logging
export function logQuery(operation: string, model: string, duration: number) {
  if (process.env.LOG_QUERIES === 'true') {
    logger.debug('Database Query', {
      operation,
      model,
      duration: `${duration}ms`
    })
  }
}
