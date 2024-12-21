import type { D1QueryResult, D1Row } from '@/types/modules'

interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'sqlite'
  connection: {
    host?: string
    port?: number
    database: string
    username?: string
    password?: string
  }
}

export class DatabaseService {
  private config: DatabaseConfig
  private pool: any // Will be properly typed based on database driver
  private migrations: Map<string, string>

  constructor(config: DatabaseConfig) {
    this.config = config
    this.migrations = new Map()
  }

  async initialize(): Promise<void> {
    await this.setupConnection()
    await this.runMigrations()
  }

  async query<T = D1Row>(sql: string, params?: any[]): Promise<D1QueryResult<T>> {
    try {
      const results = await this.pool.query(sql, params)
      return {
        results: results.rows,
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async transaction<T>(
    callback: (transaction: DatabaseService) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const result = await callback(this)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async addMigration(name: string, sql: string): Promise<void> {
    this.migrations.set(name, sql)
  }

  private async setupConnection(): Promise<void> {
    // Implement database connection setup based on config.type
  }

  private async runMigrations(): Promise<void> {
    await this.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const { results: executedMigrations } = await this.query<{ name: string }>(
      'SELECT name FROM migrations'
    )

    const executedNames = new Set(executedMigrations?.map(m => m.name))

    for (const [name, sql] of this.migrations.entries()) {
      if (!executedNames.has(name)) {
        await this.transaction(async (db) => {
          await db.query(sql)
          await db.query('INSERT INTO migrations (name) VALUES ($1)', [name])
        })
      }
    }
  }
} 