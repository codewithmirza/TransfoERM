export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export class APIClient {
  private baseUrl = 'https://transfoerm.manwaarullahb.workers.dev/api';
  
  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
    
    if (!response.ok) {
      throw new APIError(response.statusText);
    }
    
    return response.json();
  }
} 