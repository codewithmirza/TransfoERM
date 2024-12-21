async function testProduction() {
  const PROD_URL = 'https://transfoerm.manwaarullahb.workers.dev'
  
  try {
    // Test production API
    const response = await fetch(`${PROD_URL}/api/health`)
    console.log('Production Health Check:', await response.json())
    
  } catch (error) {
    console.error('Production Test Failed:', error)
  }
}

testProduction() 