import { DatabaseService } from '@/types/database'
import { BaseRepository } from './BaseRepository'

export class KnowledgeBaseRepository extends BaseRepository<any> {
  constructor(db: DatabaseService) {
    super(db)
  }

  getTableName(): string {
    return 'knowledge_base'
  }
} 