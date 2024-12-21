import { D1Database } from '@cloudflare/workers-types'
import type { Customer } from '@/types'

export class CRMService {
  constructor(private db: D1Database) {}

  async getCustomers(): Promise<Customer[]> {
    const { results } = await this.db.prepare('SELECT * FROM customers').all()
    return results as unknown as Customer[]
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await this.db.prepare(`
      INSERT INTO customers (id, name, email, company, status, value, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.name,
      data.email,
      data.company,
      data.status || 'pending',
      data.value || 0,
      data.notes || '',
      now,
      now
    ).run()

    return {
      id,
      name: data.name!,
      email: data.email!,
      company: data.company!,
      status: data.status || 'pending',
      value: data.value || 0,
      notes: data.notes || '',
      created_at: now,
      updated_at: now
    } as Customer
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const now = new Date().toISOString()

    await this.db.prepare(`
      UPDATE customers 
      SET name = ?, email = ?, company = ?, status = ?, value = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.name,
      data.email,
      data.company,
      data.status,
      data.value,
      data.notes,
      now,
      id
    ).run()

    return { ...data, id, updated_at: now } as Customer
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM customers WHERE id = ?').bind(id).run()
  }
}
