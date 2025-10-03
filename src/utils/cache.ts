/**
 * Caching utilities for API calls and static assets
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  strategy?: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  keyPrefix?: string;
  serialize?: boolean;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

/**
 * Memory cache implementation
 */
class MemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;
    
    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): { size: number; hits: number; hitRate: number } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    
    return {
      size: this.cache.size,
      hits: totalHits,
      hitRate: entries.length > 0 ? totalHits / entries.length : 0,
    };
  }
}

/**
 * LocalStorage cache implementation
 */
class LocalStorageCache<T = any> {
  private keyPrefix: string;
  private defaultTTL: number;

  constructor(keyPrefix: string = 'cache_', defaultTTL: number = 5 * 60 * 1000) {
    this.keyPrefix = keyPrefix;
    this.defaultTTL = defaultTTL;
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  set(key: string, value: T, ttl?: number): void {
    try {
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
        hits: 0,
      };

      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  }

  get(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      
      if (!item) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      // Increment hit counter and update
      entry.hits++;
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
      
      return entry.value;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.warn('Failed to delete localStorage cache:', error);
      return false;
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.keyPrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  size(): number {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.keyPrefix)).length;
    } catch (error) {
      console.warn('Failed to get localStorage cache size:', error);
      return 0;
    }
  }
}

/**
 * SessionStorage cache implementation
 */
class SessionStorageCache<T = any> {
  private keyPrefix: string;
  private defaultTTL: number;

  constructor(keyPrefix: string = 'session_cache_', defaultTTL: number = 30 * 60 * 1000) {
    this.keyPrefix = keyPrefix;
    this.defaultTTL = defaultTTL;
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  set(key: string, value: T, ttl?: number): void {
    try {
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
        hits: 0,
      };

      sessionStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error);
    }
  }

  get(key: string): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      
      if (!item) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);
      
      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      // Increment hit counter and update
      entry.hits++;
      sessionStorage.setItem(this.getKey(key), JSON.stringify(entry));
      
      return entry.value;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.warn('Failed to delete sessionStorage cache:', error);
      return false;
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.keyPrefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear sessionStorage cache:', error);
    }
  }

  size(): number {
    try {
      const keys = Object.keys(sessionStorage);
      return keys.filter(key => key.startsWith(this.keyPrefix)).length;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache size:', error);
      return 0;
    }
  }
}

/**
 * Cache manager for different cache strategies
 */
class CacheManager {
  private memoryCache: MemoryCache;
  private localStorageCache: LocalStorageCache;
  private sessionStorageCache: SessionStorageCache;

  constructor() {
    this.memoryCache = new MemoryCache();
    this.localStorageCache = new LocalStorageCache();
    this.sessionStorageCache = new SessionStorageCache();
  }

  set(key: string, value: any, options: CacheOptions = {}): void {
    const { strategy = 'memory', ttl, keyPrefix } = options;

    switch (strategy) {
      case 'memory':
        this.memoryCache.set(key, value, ttl);
        break;
      case 'localStorage':
        this.localStorageCache.set(key, value, ttl);
        break;
      case 'sessionStorage':
        this.sessionStorageCache.set(key, value, ttl);
        break;
    }
  }

  get(key: string, strategy: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): any {
    switch (strategy) {
      case 'memory':
        return this.memoryCache.get(key);
      case 'localStorage':
        return this.localStorageCache.get(key);
      case 'sessionStorage':
        return this.sessionStorageCache.get(key);
      default:
        return null;
    }
  }

  has(key: string, strategy: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): boolean {
    switch (strategy) {
      case 'memory':
        return this.memoryCache.has(key);
      case 'localStorage':
        return this.localStorageCache.has(key);
      case 'sessionStorage':
        return this.sessionStorageCache.has(key);
      default:
        return false;
    }
  }

  delete(key: string, strategy: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): boolean {
    switch (strategy) {
      case 'memory':
        return this.memoryCache.delete(key);
      case 'localStorage':
        return this.localStorageCache.delete(key);
      case 'sessionStorage':
        return this.sessionStorageCache.delete(key);
      default:
        return false;
    }
  }

  clear(strategy?: 'memory' | 'localStorage' | 'sessionStorage'): void {
    if (strategy) {
      switch (strategy) {
        case 'memory':
          this.memoryCache.clear();
          break;
        case 'localStorage':
          this.localStorageCache.clear();
          break;
        case 'sessionStorage':
          this.sessionStorageCache.clear();
          break;
      }
    } else {
      this.memoryCache.clear();
      this.localStorageCache.clear();
      this.sessionStorageCache.clear();
    }
  }

  getStats(): Record<string, any> {
    return {
      memory: this.memoryCache.getStats(),
      localStorage: { size: this.localStorageCache.size() },
      sessionStorage: { size: this.sessionStorageCache.size() },
    };
  }
}

/**
 * API cache with automatic invalidation
 */
class APICache {
  private cache: MemoryCache;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor() {
    this.cache = new MemoryCache(200, 5 * 60 * 1000); // 5 minutes default TTL
  }

  async get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Make new request
    const promise = fetcher().then(result => {
      this.cache.set(key, result, ttl);
      this.pendingRequests.delete(key);
      return result;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  invalidate(pattern: string): void {
    const keys = this.cache.keys();
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

// Create singleton instances
export const cacheManager = new CacheManager();
export const apiCache = new APICache();

// Export cache classes
export { MemoryCache, LocalStorageCache, SessionStorageCache, CacheManager, APICache };

// Utility functions
export const cache = {
  set: (key: string, value: any, options?: CacheOptions) => cacheManager.set(key, value, options),
  get: (key: string, strategy?: 'memory' | 'localStorage' | 'sessionStorage') => cacheManager.get(key, strategy),
  has: (key: string, strategy?: 'memory' | 'localStorage' | 'sessionStorage') => cacheManager.has(key, strategy),
  delete: (key: string, strategy?: 'memory' | 'localStorage' | 'sessionStorage') => cacheManager.delete(key, strategy),
  clear: (strategy?: 'memory' | 'localStorage' | 'sessionStorage') => cacheManager.clear(strategy),
  stats: () => cacheManager.getStats(),
};

export const apiCacheUtils = {
  get: <T>(key: string, fetcher: () => Promise<T>, ttl?: number) => apiCache.get(key, fetcher, ttl),
  invalidate: (pattern: string) => apiCache.invalidate(pattern),
  clear: () => apiCache.clear(),
};
