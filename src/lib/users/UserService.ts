import { DBUser, DatabaseService } from '@/types/database'

export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async updateUser(userId: string, updates: Partial<DBUser>): Promise<void> {
    const metadata = typeof updates.metadata === 'string' 
      ? JSON.parse(updates.metadata)
      : updates.metadata

    await this.db.execute(
      `UPDATE users SET metadata = ? WHERE id = ?`,
      [JSON.stringify(metadata), userId]
    )
  }

  async getUser(userId: string): Promise<DBUser | null> {
    const user = await this.db.queryOne<DBUser>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    )

    if (user && typeof user.metadata === 'string') {
      user.metadata = JSON.parse(user.metadata) as DBUser['metadata']
    }

    return user
  }

  async listUsers(): Promise<DBUser[]> {
    const users = await this.db.query<DBUser>('SELECT * FROM users')
    return users.map(user => ({
      ...user,
      metadata: typeof user.metadata === 'string' 
        ? JSON.parse(user.metadata) as DBUser['metadata']
        : user.metadata
    }))
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.execute('DELETE FROM users WHERE id = ?', [userId])
  }
} 