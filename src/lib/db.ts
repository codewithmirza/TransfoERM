import { D1Database } from '@cloudflare/workers-types'
import { assertD1Result } from '@/types/cloudflare'

export interface Database {
  query<T>(sql: string, params?: any[]): Promise<T[]>
  create<T>(table: string, data: Partial<T>): Promise<T>
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>
  delete(table: string, id: string): Promise<void>
}

class DatabaseImpl implements Database {
  constructor(private d1: D1Database) {}

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const stmt = this.d1.prepare(sql)
    if (params) {
      stmt.bind(...params)
    }
    const result = await stmt.all()
    assertD1Result<T>(result)
    return result.results
  }

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const sql = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${keys.map(() => '?').join(', ')})
      RETURNING *
    `
    const stmt = this.d1.prepare(sql).bind(...values)
    const result = await stmt.first()
    return result as T
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const sets = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]
    const sql = `
      UPDATE ${table}
      SET ${sets}
      WHERE id = ?
      RETURNING *
    `
    const stmt = this.d1.prepare(sql).bind(...values)
    const result = await stmt.first()
    return result as T
  }

  async delete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE id = ?`
    await this.d1.prepare(sql).bind(id).run()
  }
}

export function createDatabase(d1: D1Database): Database {
  return new DatabaseImpl(d1)
}

export const db = createDatabase
