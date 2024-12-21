export class Storage {
  constructor(private bucket: R2Bucket) {}

  async uploadFile(
    key: string,
    file: File | Blob,
    metadata?: Record<string, string>
  ): Promise<void> {
    await this.bucket.put(key, file, {
      customMetadata: metadata,
    })
  }

  async getFile(key: string): Promise<R2Object | null> {
    return this.bucket.get(key)
  }

  async deleteFile(key: string): Promise<void> {
    await this.bucket.delete(key)
  }

  async listFiles(prefix?: string): Promise<R2Objects> {
    return this.bucket.list({
      prefix,
      limit: 1000,
    })
  }
}
