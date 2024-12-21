import { DatabaseService } from './DatabaseService'
import { ValidationError } from '@/lib/errors'

export abstract class BaseRepository<T extends { id: string }> {
  constructor(
    protected db: DatabaseService,
    protected tableName: string
  ) {}

  protected abstract validate(entity: Partial<T>): void

  async findById(id: string): Promise<T | null> {
    return await this.db.queryOne<T>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }

  async findAll(options: {
    where?: Record<string, any>
    orderBy?: string
    limit?: number
    offset?: number
  } = {}): Promise<T[]> {
    const { where = {}, orderBy, limit, offset } = options
    
    const conditions = Object.entries(where)
      .map(([key]) => `${key} = ?`)
      .join(' AND ')

    const query = [
      `SELECT * FROM ${this.tableName}`,
      conditions ? `WHERE ${conditions}` : '',
      orderBy ? `ORDER BY ${orderBy}` : '',
      limit ? `LIMIT ${limit}` : '',
      offset ? `OFFSET ${offset}` : ''
    ].filter(Boolean).join(' ')

    return await this.db.query<T>(
      query,
      Object.values(where)
    )
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const entity = data as Partial<T>
    this.validate(entity)

    const id = crypto.randomUUID()
    const columns = Object.keys(entity)
    const values = Object.values(entity)
    const placeholders = values.map(() => '?').join(', ')

    await this.db.execute(
      `INSERT INTO ${this.tableName} (id, ${columns.join(', ')})
       VALUES (?, ${placeholders})`,
      [id, ...values]
    )

    const created = await this.findById(id)
    if (!created) throw new Error('Failed to create entity')
    return created
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    this.validate(updates)

    const columns = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = columns.map(col => `${col} = ?`).join(', ')

    await this.db.execute(
      `UPDATE ${this.tableName} 
       SET ${setClause}
       WHERE id = ?`,
      [...values, id]
    )

    const updated = await this.findById(id)
    if (!updated) throw new Error('Entity not found')
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }

  async count(where: Record<string, any> = {}): Promise<number> {
    const conditions = Object.entries(where)
      .map(([key]) => `${key} = ?`)
      .join(' AND ')

    const query = [
      `SELECT COUNT(*) as count FROM ${this.tableName}`,
      conditions ? `WHERE ${conditions}` : ''
    ].filter(Boolean).join(' ')

    const result = await this.db.queryOne<{ count: number }>(
      query,
      Object.values(where)
    )

    return result?.count || 0
  }
} 