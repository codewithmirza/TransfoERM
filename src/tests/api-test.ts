import { waitForServer } from '../utils/test-utils'

async function testAPI() {
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://transfoerm.manwaarullahb.workers.dev'
    : 'http://localhost:8787'
  
  // Wait for server to be ready
  const isServerReady = await waitForServer(API_URL)
  if (!isServerReady) {
    console.error('Server not available. Please run "npm run worker:dev" first')
    process.exit(1)
  }

  // Test user creation
  const testUser = {
    id: 'test-' + Date.now(),
    email: `test${Date.now()}@example.com`,
    name: 'Test User',
    company: 'Test Corp'
  }

  try {
    // Test user creation
    const createResponse = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    console.log('Create User Response:', await createResponse.json())

  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run tests
testAPI() 