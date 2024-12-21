import { DatabaseService } from '@/types/database'

export abstract class BaseRepository<T> {
  constructor(protected readonly db: DatabaseService) {}

  abstract getTableName(): string

  async findById(id: string): Promise<T | null> {
    return this.db.queryOne<T>(`SELECT * FROM ${this.getTableName()} WHERE id = ?`, [id])
  }

  // ... other common methods
} 