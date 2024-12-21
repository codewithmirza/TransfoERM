import { NextApiRequest, NextApiResponse } from 'next'
import { ModuleFactory } from '@/lib/modules/ModuleFactory'
import { ModuleRegistry } from '@/lib/modules/ModuleRegistry'
import { createAuthMiddleware, createAuthorizationMiddleware, AuthenticatedRequest } from '@/middleware/auth'
import { ErrorHandler, ErrorSeverity } from '@/lib/error/ErrorHandler'
import { Logger, LogLevel } from '@/lib/logging/Logger'
import { DatabaseService } from '@/lib/database/DatabaseService'
import { CacheService } from '@/lib/cache/CacheService'
import type { ModuleType } from '@/types/realtime'

const db = new DatabaseService({
  type: 'postgres',
  connection: {
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
})

const cache = new CacheService()
const moduleFactory = ModuleFactory.getInstance()
const moduleRegistry = new ModuleRegistry()
const logger = Logger.getInstance()
const errorHandler = ErrorHandler.getInstance()

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    await errorHandler.handleError(
      error as Error,
      ErrorSeverity.HIGH,
      { 
        path: req.url,
        method: req.method,
        requestId: req.headers['x-request-id'] as string
      }
    )
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
  const moduleId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!moduleId) {
    return res.status(400).json({ error: 'Module ID is required' })
  }

  const moduleConfig = await moduleRegistry.getModuleConfig(moduleId)
  if (!moduleConfig) {
    return res.status(404).json({ error: 'Module not found' })
  }

  const module = moduleRegistry.getModule(moduleConfig.moduleType)
  if (!module) {
    return res.status(404).json({ error: 'Module implementation not found' })
  }

  const state = await module.getState()
  return res.status(200).json(state)
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
  const config = req.body
  
  try {
    const module = await moduleFactory.createModule(config)
    await logger.log(LogLevel.INFO, 'Module created', { moduleId: module.id })
    return res.status(201).json({ id: module.id })
  } catch (error) {
    await errorHandler.handleError(
      error as Error,
      ErrorSeverity.HIGH,
      { config }
    )
    return res.status(400).json({ error: 'Invalid module configuration' })
  }
}

async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
  const moduleId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!moduleId) {
    return res.status(400).json({ error: 'Module ID is required' })
  }

  const moduleConfig = await moduleRegistry.getModuleConfig(moduleId)
  if (!moduleConfig) {
    return res.status(404).json({ error: 'Module not found' })
  }

  const module = moduleRegistry.getModule(moduleConfig.moduleType)
  if (!module) {
    return res.status(404).json({ error: 'Module implementation not found' })
  }

  try {
    await module.handleAction(req.body)
    const state = await module.getState()
    return res.status(200).json(state)
  } catch (error) {
    await errorHandler.handleError(
      error as Error,
      ErrorSeverity.MEDIUM,
      { moduleId, action: req.body }
    )
    return res.status(400).json({ error: 'Invalid action' })
  }
}

async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse) {
  const moduleId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!moduleId) {
    return res.status(400).json({ error: 'Module ID is required' })
  }

  await moduleRegistry.unregisterModule(moduleId)
  await logger.log(LogLevel.INFO, 'Module deleted', { moduleId })
  return res.status(204).end()
}

// Apply middleware
const authMiddleware = createAuthMiddleware(db, cache)
const authzMiddleware = createAuthorizationMiddleware('module', 'read')

export default async function apiHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  await authMiddleware(req, res, async () => {
    await authzMiddleware(req, res, async () => {
      await handler(req, res)
    })
  })
}

export const config = {
  api: {
    bodyParser: true,
  },
} 