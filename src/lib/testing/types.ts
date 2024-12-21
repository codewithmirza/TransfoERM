export interface TestSuite {
  id: string
  name: string
  description?: string
  setup?: () => Promise<void>
  teardown?: () => Promise<void>
  tests: Test[]
}

export interface Test {
  id: string
  name: string
  type: 'unit' | 'integration' | 'e2e'
  execute: () => Promise<void>
  dependencies?: string[]
}

export interface TestResult {
  testId: string
  status: TestStatus
  duration: number
  error?: Error
  metadata?: Record<string, any>
}

export interface TestSuiteResult {
  suiteId: string
  results: TestResult[]
  timestamp: Date
  duration: number
  passed: number
  failed: number
  skipped: number
}

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped' 