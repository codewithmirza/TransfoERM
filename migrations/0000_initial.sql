-- Drop existing tables if they exist
DROP TABLE IF EXISTS ai_insights;
DROP TABLE IF EXISTS command_history;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS sales_deals;
DROP TABLE IF EXISTS hr_employees;
DROP TABLE IF EXISTS finance_transactions;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS users;

-- Now create tables
-- Users and Authentication
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Management
CREATE TABLE stock_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  reorder_point INTEGER NOT NULL,
  reorder_quantity INTEGER NOT NULL,
  location TEXT NOT NULL,
  supplier TEXT,
  cost DECIMAL(10, 2),
  status TEXT DEFAULT 'in_stock',
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements
CREATE TABLE stock_movements (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  from_location TEXT,
  to_location TEXT,
  reference TEXT,
  reason TEXT,
  performed_by TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY(item_id) REFERENCES stock_items(id)
);

-- Knowledge Base for RAG
CREATE TABLE knowledge_base (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  embedding BLOB,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_stock_items_sku ON stock_items(sku);
CREATE INDEX idx_stock_items_category ON stock_items(category);
CREATE INDEX idx_stock_movements_item ON stock_movements(item_id);