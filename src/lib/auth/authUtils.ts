export function getAuthHeaders() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('firebase-token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
} 