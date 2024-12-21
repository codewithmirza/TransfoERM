export const AI_CONFIG = {
  models: {
    text: 'claude-3-sonnet-20240229',
    code: 'claude-3-opus-20240229',
    analysis: 'claude-3-haiku-20240229'
  },
  endpoints: {
    completion: '/api/ai/completion',
    analysis: '/api/ai/analysis',
    prediction: '/api/ai/prediction',
    codeGen: '/api/ai/code-generation'
  },
  maxTokens: {
    completion: 2000,
    analysis: 4000,
    prediction: 1000,
    codeGen: 8000
  }
}; 