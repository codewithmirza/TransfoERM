import { Env, D1Database, D1Transaction, D1Result, D1PreparedStatement } from '@/types/cloudflare'

export class DatabaseService {
  constructor(private env: Env) {}

  async transaction<T>(
    callback: (tx: D1Transaction) => Promise<T>
  ): Promise<T> {
    const tx = await this.env.DB.batch([]) as unknown as D1Transaction
    try {
      const result = await callback(tx)
      await tx.commit()
      return result
    } catch (error) {
      await tx.rollback()
      throw error
    }
  }

  async query<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    const stmt = this.env.DB.prepare(query)
    const result = await stmt.bind(...params).all<T>()
    return result.results || []
  }

  async queryOne<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    const stmt = this.env.DB.prepare(query)
    const result = await stmt.bind(...params).first<T>()
    return result || null
  }

  async execute(
    query: string,
    params: any[] = []
  ): Promise<D1Result> {
    const stmt = this.env.DB.prepare(query)
    return await stmt.bind(...params).run()
  }
} 