import { LoginResponse } from '@/types/employee';

// Cookie management utilities
export const cookieUtils = {
  // Set cookie with expiration
  setCookie: (name: string, value: string, expirationMs: number) => {
    const date = new Date();
    date.setTime(date.getTime() + expirationMs);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;secure;samesite=strict`;
  },

  // Get cookie value
  getCookie: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete cookie
  deleteCookie: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

// Auth token management
export const authService = {
  // Store tokens after successful login
  storeTokens: (loginResponse: LoginResponse) => {
    // Store access token with its expiration
    cookieUtils.setCookie('accessToken', loginResponse.accessToken, loginResponse.accessTokenExpiry);
    
    // Store refresh token with its expiration
    cookieUtils.setCookie('refreshToken', loginResponse.refreshToken, loginResponse.refreshTokenExpiry);
    
    // Store user info
    cookieUtils.setCookie('userInfo', JSON.stringify({
      fullName: loginResponse.fullName,
      username: loginResponse.username,
      role: loginResponse.role
    }), loginResponse.accessTokenExpiry);
  },

  // Get current access token
  getAccessToken: (): string | null => {
    return cookieUtils.getCookie('accessToken');
  },

  // Get current refresh token
  getRefreshToken: (): string | null => {
    return cookieUtils.getCookie('refreshToken');
  },

  // Get user info
  getUserInfo: (): { fullName: string; username: string; role: string } | null => {
    const userInfo = cookieUtils.getCookie('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getAccessToken();
  },

  // Clear all auth data (logout)
  clearAuth: () => {
    cookieUtils.deleteCookie('accessToken');
    cookieUtils.deleteCookie('refreshToken');
    cookieUtils.deleteCookie('userInfo');
  },

  // Refresh access token using refresh token
  refreshAccessToken: async (): Promise<boolean> => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (response.ok) {
        const newTokens: LoginResponse = await response.json();
        authService.storeTokens(newTokens);
        return true;
      } else {
        // Refresh token is invalid, clear auth
        authService.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      authService.clearAuth();
      return false;
    }
  }
};
