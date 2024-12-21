export const schema = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT,
      photo_url TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      metadata JSON NOT NULL DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,

  analytics: `
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      user_id TEXT,
      metadata JSON NOT NULL DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `,

  knowledge_base: `
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      metadata JSON NOT NULL DEFAULT '{}',
      vector_id TEXT,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `,

  files: `
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER NOT NULL,
      storage_key TEXT NOT NULL,
      metadata JSON NOT NULL DEFAULT '{}',
      uploaded_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    )
  `,

  api_keys: `
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      key TEXT NOT NULL,
      permissions JSON NOT NULL DEFAULT '[]',
      last_used_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `
}

export const indexes = {
  users: [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)'
  ],
  analytics: [
    'CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)',
    'CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)'
  ],
  knowledge_base: [
    'CREATE INDEX IF NOT EXISTS idx_knowledge_base_vector_id ON knowledge_base(vector_id)',
    'CREATE INDEX IF NOT EXISTS idx_knowledge_base_created_by ON knowledge_base(created_by)'
  ],
  files: [
    'CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by)',
    'CREATE INDEX IF NOT EXISTS idx_files_type ON files(type)'
  ],
  api_keys: [
    'CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key)'
  ]
} 