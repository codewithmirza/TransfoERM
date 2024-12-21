import { Env } from '@/types/cloudflare'
import { schema, indexes } from './schema'

export class DatabaseMigration {
  constructor(private env: Env) {}

  async migrate(): Promise<void> {
    // Create tables
    for (const [table, query] of Object.entries(schema)) {
      try {
        await this.env.DB.prepare(query).run()
        console.log(`Created table: ${table}`)
      } catch (error) {
        console.error(`Failed to create table ${table}:`, error)
        throw error
      }
    }

    // Create indexes
    for (const [table, tableIndexes] of Object.entries(indexes)) {
      for (const indexQuery of tableIndexes) {
        try {
          await this.env.DB.prepare(indexQuery).run()
          console.log(`Created index for table: ${table}`)
        } catch (error) {
          console.error(`Failed to create index for table ${table}:`, error)
          throw error
        }
      }
    }
  }

  async reset(): Promise<void> {
    const tables = ['api_keys', 'files', 'knowledge_base', 'analytics', 'users']
    
    for (const table of tables) {
      try {
        await this.env.DB.prepare(`DROP TABLE IF EXISTS ${table}`).run()
        console.log(`Dropped table: ${table}`)
      } catch (error) {
        console.error(`Failed to drop table ${table}:`, error)
        throw error
      }
    }

    await this.migrate()
  }
} 