export class AuthErrorHandler {
  static handleFirebaseError(error: any): string {
    if (error.code === 'failed-precondition' || error.message.includes('offline')) {
      return 'Unable to connect to authentication service. Please check your internet connection.'
    }

    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please try again.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.'
      default:
        return 'An authentication error occurred. Please try again.'
    }
  }
} 