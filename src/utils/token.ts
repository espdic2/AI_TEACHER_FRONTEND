/**
 * Safely decodes and validates a JWT token
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    // Split the token
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return false; // Don't auto-logout for format issues
    }
    
    // Decode the payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload);
    
    // Check if expiration exists
    if (!payload.exp) {
      console.log('Token has no expiration date');
      return false; // If no expiration, consider it valid
    }
    
    // Check expiration
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeLeft = Math.round((expirationTime - now)/1000/60);
    
    console.log(`Token expires in: ${timeLeft} minutes`);
    
    return now >= expirationTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false; // Don't auto-logout for parsing errors
  }
}

/**
 * Safely stores authentication data
 */
export function storeAuthData(token: string, user: any): void {
  try {
    if (!token) {
      console.error('No token provided for storage');
      return;
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set cookie with SameSite=Lax to allow redirects
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    console.log('Auth data stored successfully');
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
}

/**
 * Clears all authentication data
 */
export function clearAuthData(): void {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
} 