import { DatabaseService } from '@/types/database'
import { BaseRepository } from './BaseRepository'

export class FileRepository extends BaseRepository<any> {
  constructor(db: DatabaseService) {
    super(db)
  }

  getTableName(): string {
    return 'files'
  }
} 