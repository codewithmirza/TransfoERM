import { DatabaseService, DBUser } from '@/types/database'
import { BaseRepository } from './BaseRepository'

export class UserRepository extends BaseRepository<DBUser> {
  constructor(db: DatabaseService) {
    super(db)
  }

  getTableName(): string {
    return 'users'
  }
} 