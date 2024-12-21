import { AuthenticationService } from './AuthenticationService'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'

interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'execute'
  conditions?: Record<string, any>
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
  metadata?: Record<string, any>
}

export class AuthorizationService {
  private authService: AuthenticationService
  private errorHandler: ErrorHandler
  private logger: Logger
  private roles: Map<string, Role>
  private userRoles: Map<string, Set<string>>

  constructor(authService: AuthenticationService) {
    this.authService = authService
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
    this.roles = new Map()
    this.userRoles = new Map()
  }

  async authorize(
    token: string,
    resource: string,
    action: Permission['action']
  ): Promise<boolean> {
    try {
      const user = await this.authService.validateToken(token)
      if (!user) return false

      const userRoles = this.userRoles.get(user.id)
      if (!userRoles) return false

      for (const roleId of userRoles) {
        const role = this.roles.get(roleId)
        if (!role) continue

        const hasPermission = role.permissions.some(
          permission =>
            permission.resource === resource &&
            permission.action === action &&
            this.evaluateConditions(permission.conditions, user)
        )

        if (hasPermission) {
          await this.logger.log(LogLevel.INFO, 'Authorization successful', {
            userId: user.id,
            resource,
            action
          })
          return true
        }
      }

      await this.logger.log(LogLevel.WARN, 'Authorization failed', {
        userId: user.id,
        resource,
        action
      })
      return false
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { resource, action }
      )
      return false
    }
  }

  async addRole(role: Role): Promise<void> {
    this.roles.set(role.id, role)
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set())
    }
    this.userRoles.get(userId)?.add(roleId)
  }

  private evaluateConditions(
    conditions: Record<string, any> | undefined,
    user: any
  ): boolean {
    if (!conditions) return true

    // Implement condition evaluation logic
    return true
  }
} 