export async function waitForServer(url: string, maxAttempts = 5): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url + '/api/health')
      if (response.ok) return true
    } catch (error) {
      console.log(`Attempt ${i + 1}: Server not ready, retrying in 2 seconds...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  return false
} 