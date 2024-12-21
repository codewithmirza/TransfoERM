import { DatabaseService } from '@/types/database'
import { BaseRepository } from './BaseRepository'

export class APIKeyRepository extends BaseRepository<any> {
  constructor(db: DatabaseService) {
    super(db)
  }

  getTableName(): string {
    return 'api_keys'
  }
} 