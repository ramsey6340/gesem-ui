import { authService } from './auth';

// HTTP Interceptor for automatic JWT token management
export class HttpInterceptor {
  private static instance: HttpInterceptor;
  private baseURL = 'http://localhost:8082/api/v1'; // Utilise le proxy Vite

  private constructor() {}

  // Get client IP address (best effort with timeout)
  private async getClientIP(): Promise<string> {
    const timeout = 3000; // 3 seconds timeout
    
    try {
      // Try to get IP from external service with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Failed to get IP from ipify, using fallback');
      // Return a reasonable fallback IP immediately
      return '192.168.1.1';
    }
  }

  public static getInstance(): HttpInterceptor {
    if (!HttpInterceptor.instance) {
      HttpInterceptor.instance = new HttpInterceptor();
    }
    return HttpInterceptor.instance;
  }

  // Intercepted fetch method
  public async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Prepare the full URL
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    // Prepare headers
    const headers = new Headers(options.headers);
    
    // Add Content-Type if not present
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add client IP for login requests
    if (url.includes('/auth/login')) {
      try {
        const clientIP = await this.getClientIP();
        headers.set('X-Forwarded-For', clientIP);
      } catch (error) {
        console.warn('Failed to get client IP for login request:', error);
      }
    }

    // Add Authorization header if user is authenticated and not a login request
    if (authService.isAuthenticated() && !url.includes('/auth/login')) {
      const token = authService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('Token ajouté pour:', url, 'Token:', token.substring(0, 50) + '...');
      } else {
        console.warn('Utilisateur authentifié mais pas de token disponible');
      }
    } else {
      console.log('Pas d\'authentification requise pour:', url);
    }

    // Make the request
    let response = await fetch(fullUrl, {
      ...options,
      headers
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      console.log('Token expired, attempting to refresh...');
      
      const refreshSuccess = await authService.refreshAccessToken();
      
      if (refreshSuccess) {
        // Retry the original request with new token
        const newToken = authService.getAccessToken();
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(fullUrl, {
            ...options,
            headers
          });
        }
      } else {
        // Refresh failed, redirect to login
        console.log('Token refresh failed, redirecting to login...');
        authService.clearAuth();
        window.location.href = '/';
        throw new Error('Authentication failed');
      }
    }

    return response;
  }

  // Convenience methods for different HTTP verbs
  public async get(url: string, options: RequestInit = {}): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    console.log(`[HTTP GET] ${fullUrl}`, { options });
    
    try {
      const response = await this.fetch(url, { ...options, method: 'GET' });
      console.log(`[HTTP GET ${fullUrl}] Réponse:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Log response body for debugging (only for JSON responses)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const clone = response.clone(); // Clone pour pouvoir lire le corps deux fois si nécessaire
        const data = await clone.json().catch(() => null);
        console.log(`[HTTP GET ${fullUrl}] Corps de la réponse:`, data);
      }
      
      return response;
    } catch (error) {
      console.error(`[HTTP GET ${fullUrl}] Erreur:`, error);
      throw error;
    }
  }

  public async post(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async put(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
    console.log(`PUT ${url}`, { data, options });
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async delete(url: string, options: RequestInit = {}): Promise<Response> {
    console.log(`DELETE ${url}`, { options });
    return this.fetch(url, { ...options, method: 'DELETE' });
  }

  private async getAuthHeaders(): Promise<Headers> {
    const headers = new Headers();
    if (authService.isAuthenticated()) {
      const token = authService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }
}

// Export singleton instance
export const httpClient = HttpInterceptor.getInstance();
