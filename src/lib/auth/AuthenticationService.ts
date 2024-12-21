import { DatabaseService } from '../database/DatabaseService'
import { CacheService } from '../cache/CacheService'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'

interface User {
  id: string
  email: string
  passwordHash: string
  role: string
  permissions: string[]
  lastLogin?: Date
  status: 'active' | 'inactive' | 'suspended'
}

interface AuthToken {
  token: string
  userId: string
  expires: Date
  scope: string[]
}

export class AuthenticationService {
  private db: DatabaseService
  private cache: CacheService
  private errorHandler: ErrorHandler
  private logger: Logger

  constructor(
    db: DatabaseService,
    cache: CacheService
  ) {
    this.db = db
    this.cache = cache
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
  }

  async authenticate(email: string, password: string): Promise<AuthToken> {
    try {
      const user = await this.validateCredentials(email, password)
      if (!user) {
        throw new Error('Invalid credentials')
      }

      const token = await this.generateToken(user)
      await this.cache.set(`auth:${token.token}`, token, 3600) // 1 hour

      await this.logger.log(LogLevel.INFO, 'User authenticated', {
        userId: user.id,
        email: user.email
      })

      return token
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { userId: email }
      )
      throw error
    }
  }

  async validateToken(token: string): Promise<User | null> {
    const cachedToken = await this.cache.get<AuthToken>(`auth:${token}`)
    if (!cachedToken) return null

    if (new Date(cachedToken.expires) < new Date()) {
      await this.cache.delete(`auth:${token}`)
      return null
    }

    return this.getUserById(cachedToken.userId)
  }

  async revokeToken(token: string): Promise<void> {
    await this.cache.delete(`auth:${token}`)
  }

  private async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const { results } = await this.db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (!results || results.length === 0) return null

    const user = results[0]
    // Implement proper password validation
    return user
  }

  private async generateToken(user: User): Promise<AuthToken> {
    return {
      token: crypto.randomUUID(),
      userId: user.id,
      expires: new Date(Date.now() + 3600000), // 1 hour
      scope: user.permissions
    }
  }

  private async getUserById(id: string): Promise<User | null> {
    const { results } = await this.db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )

    return results?.[0] || null
  }
} 