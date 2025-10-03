import axios from 'axios';
import { supabase } from '../lib/supabase';

// Use local backend for development, Railway for production
const isLocalDev = import.meta.env.DEV || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

// Use environment variable if available, otherwise fallback to Railway
const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : isLocalDev 
    ? 'http://localhost:8000/api/v1'
    : 'https://mindsphere-production-fc81.up.railway.app/api/v1';
console.log('🔧 API Base URL:', baseURL);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('🔧 Hostname:', window.location.hostname);
console.log('🔧 isLocalDev:', isLocalDev);
console.log('🔧 All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

export const api = axios.create({ 
  baseURL,
  timeout: 300000, // 5 minute timeout for long session generation
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to log every request
api.interceptors.request.use((config) => {
  const fullURL = `${config.baseURL || ''}${config.url || ''}`;
  console.log('🌐 Making API request to:', fullURL);
  console.log('🌐 Request config:', {
    baseURL: config.baseURL,
    url: config.url,
    fullURL,
    method: config.method,
    headers: config.headers
  });
  return config;
}, (error: any) => {
  console.error('❌ API request error:', error);
  return Promise.reject(error);
});

api.interceptors.request.use(async (config) => {
  // Check for local development mode (only in development environment)
  const isLocalDev = import.meta.env.DEV && localStorage.getItem('mindsphere_local_dev') === 'true';
  
  if (isLocalDev) {
    // In local development mode, don't add any auth headers
    // Backend will use demo user mode
    console.log('🔍 Local dev mode: No auth headers needed');
    return config;
  }
  
  // Production mode: Always try to get JWT token if Supabase is available
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔍 Added JWT token to request');
      }
    } catch (error: any) {
      console.log('🔍 Could not get JWT token:', error.message);
    }
  }
  return config;
});

// Retry logic for failed requests
const retryRequest = async (config: any, retryCount = 0): Promise<any> => {
  const maxRetries = 3;
  const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

  try {
    return await api.request(config);
  } catch (error: any) {
    if (retryCount < maxRetries && shouldRetry(error)) {
      console.log(`🔄 Retrying request (${retryCount + 1}/${maxRetries}) after ${retryDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
};

// Determine if a request should be retried
const shouldRetry = (error: any): boolean => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (!error.response) return true; // Network error
  if (error.code === 'ECONNABORTED') return true; // Timeout
  if (error.response.status >= 500) return true; // Server error
  if (error.response.status === 429) return true; // Rate limited
  return false;
};

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ API error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('🔐 Authentication error - token may be expired');
      // Try to refresh the session
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('🔐 Session refreshed, retrying request');
            // Retry the original request with new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
            return api.request(originalRequest);
          }
        } catch (refreshError) {
          console.error('🔐 Session refresh failed:', refreshError);
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - no response received');
    }
    
    return Promise.reject(error);
  }
);

// Wrapper function to add retry logic to API calls
export const apiWithRetry = {
  get: (url: string, config?: any) => retryRequest({ ...config, method: 'GET', url }),
  post: (url: string, data?: any, config?: any) => retryRequest({ ...config, method: 'POST', url, data }),
  put: (url: string, data?: any, config?: any) => retryRequest({ ...config, method: 'PUT', url, data }),
  delete: (url: string, config?: any) => retryRequest({ ...config, method: 'DELETE', url })
};

export async function getData<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (error: any) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default api;