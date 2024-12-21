import type { 
  VectorizeIndex,
  VectorizeMatches,
  VectorFloatArray,
  VectorizeQueryOptions,
  VectorizeVector,
  VectorizeVectorMutation
} from '@/types/env'

export class VectorStore {
  constructor(private vectorize: VectorizeIndex) {}

  async query(vector: number[] | VectorFloatArray, options?: VectorizeQueryOptions): Promise<VectorizeMatches> {
    try {
      return await this.vectorize.query(vector, options)
    } catch (error) {
      console.error('Vector query error:', error)
      throw error
    }
  }

  async deleteByIds(ids: string[]): Promise<VectorizeVectorMutation> {
    try {
      return await this.vectorize.deleteByIds(ids)
    } catch (error) {
      console.error('Vector delete error:', error)
      throw error
    }
  }

  async getByIds(ids: string[]): Promise<VectorizeMatches> {
    try {
      const vectors = await this.vectorize.getByIds(ids)
      return {
        matches: vectors.map(v => ({
          id: v.id,
          score: 1,
          values: v.values
        })),
        count: vectors.length
      }
    } catch (error) {
      console.error('Vector get error:', error)
      throw error
    }
  }

  async bulkInsert(vectors: Array<{ id: string; vector: number[] }>): Promise<VectorizeVectorMutation> {
    try {
      const vectorizeVectors: VectorizeVector[] = vectors.map(v => ({
        id: v.id,
        values: v.vector
      }))
      return await this.vectorize.insert(vectorizeVectors)
    } catch (error) {
      console.error('Vector bulk insert error:', error)
      throw error
    }
  }
} 