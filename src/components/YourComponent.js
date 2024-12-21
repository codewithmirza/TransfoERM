async function fetchData() {
  try {
    const response = await fetch('/api/your-endpoint');
    const data = await response.json();
    // Use the data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
} 