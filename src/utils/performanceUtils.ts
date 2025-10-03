/**
 * Performance utilities and monitoring tools
 */

import { performanceMonitor } from './performance';

/**
 * Performance timing utilities
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  start(): void {
    this.startTime = performance.now();
  }

  end(): number {
    this.endTime = performance.now();
    const duration = this.endTime - this.startTime;
    
    // Log to performance monitor
    performanceMonitor.recordMetric(`${this.name}_duration`, duration);
    
    return duration;
  }

  getDuration(): number {
    return this.endTime - this.startTime;
  }

  isRunning(): boolean {
    return this.startTime > 0 && this.endTime === 0;
  }
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Request animation frame utility
 */
export function requestAnimationFrame(callback: () => void): number {
  return window.requestAnimationFrame(callback);
}

/**
 * Cancel animation frame utility
 */
export function cancelAnimationFrame(id: number): void {
  window.cancelAnimationFrame(id);
}

/**
 * Batch DOM updates for better performance
 */
export class DOMBatcher {
  private updates: (() => void)[] = [];
  private scheduled: boolean = false;

  add(update: () => void): void {
    this.updates.push(update);
    
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  private flush(): void {
    const updates = this.updates.slice();
    this.updates = [];
    this.scheduled = false;
    
    updates.forEach(update => update());
  }
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  private observer: PerformanceObserver | null = null;
  private measurements: number[] = [];

  start(): void {
    if ('memory' in performance) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.measurements.push(entry.duration);
          }
        });
      });

      this.observer.observe({ entryTypes: ['measure'] });
    }
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  getMemoryInfo(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  }

  getMeasurements(): number[] {
    return this.measurements.slice();
  }

  clearMeasurements(): void {
    this.measurements = [];
  }
}

/**
 * Frame rate monitoring
 */
export class FrameRateMonitor {
  private frames: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;
  private animationId: number | null = null;

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.frames = 0;
    this.lastTime = performance.now();
    
    const measure = () => {
      if (!this.isRunning) return;
      
      this.frames++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        
        // Log FPS to performance monitor
        performanceMonitor.recordMetric('fps', this.fps);
      }
      
      this.animationId = requestAnimationFrame(measure);
    };
    
    measure();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

/**
 * Network performance monitoring
 */
export class NetworkMonitor {
  private observer: PerformanceObserver | null = null;
  private measurements: any[] = [];

  start(): void {
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.measurements.push({
            name: resourceEntry.name,
            duration: resourceEntry.duration,
            size: resourceEntry.transferSize,
            type: resourceEntry.initiatorType,
            timestamp: resourceEntry.startTime,
          });
        }
      });
    });

    this.observer.observe({ entryTypes: ['resource'] });
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  getMeasurements(): any[] {
    return this.measurements.slice();
  }

  getSlowResources(threshold: number = 1000): any[] {
    return this.measurements.filter(m => m.duration > threshold);
  }

  getLargeResources(threshold: number = 100000): any[] {
    return this.measurements.filter(m => m.size > threshold);
  }

  clearMeasurements(): void {
    this.measurements = [];
  }
}

/**
 * Performance profiler
 */
export class PerformanceProfiler {
  private timers: Map<string, PerformanceTimer> = new Map();
  private measurements: Map<string, number[]> = new Map();

  startTimer(name: string): PerformanceTimer {
    const timer = new PerformanceTimer(name);
    timer.start();
    this.timers.set(name, timer);
    return timer;
  }

  endTimer(name: string): number | null {
    const timer = this.timers.get(name);
    if (!timer) return null;
    
    const duration = timer.end();
    this.timers.delete(name);
    
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    
    this.measurements.get(name)!.push(duration);
    return duration;
  }

  getMeasurements(name: string): number[] {
    return this.measurements.get(name) || [];
  }

  getStats(name: string): any {
    const measurements = this.getMeasurements(name);
    if (measurements.length === 0) return null;
    
    const sorted = measurements.slice().sort((a, b) => a - b);
    const sum = measurements.reduce((a, b) => a + b, 0);
    
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / measurements.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const name of this.measurements.keys()) {
      stats[name] = this.getStats(name);
    }
    
    return stats;
  }

  clear(): void {
    this.timers.clear();
    this.measurements.clear();
  }
}

/**
 * Performance optimization utilities
 */
export class PerformanceOptimizer {
  /**
   * Optimize images for better performance
   */
  static optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}): string {
    // This is a placeholder - in a real implementation, you'd use an image optimization service
    const { width, height, quality = 80, format = 'webp' } = options;
    
    let optimizedSrc = src;
    
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      if (quality) params.set('q', quality.toString());
      if (format) params.set('f', format);
      
      optimizedSrc += `?${params.toString()}`;
    }
    
    return optimizedSrc;
  }

  /**
   * Preload critical resources
   */
  static preloadResource(href: string, as: string, type?: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    
    document.head.appendChild(link);
  }

  /**
   * Prefetch resources
   */
  static prefetchResource(href: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
  }

  /**
   * Lazy load images
   */
  static lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Optimize scroll performance
   */
  static optimizeScroll(callback: () => void): () => void {
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };
  }
}

// Create global instances
export const memoryMonitor = new MemoryMonitor();
export const frameRateMonitor = new FrameRateMonitor();
export const networkMonitor = new NetworkMonitor();
export const performanceProfiler = new PerformanceProfiler();
export const domBatcher = new DOMBatcher();

// Export utilities
export {
  PerformanceTimer,
  debounce,
  throttle,
  requestAnimationFrame,
  cancelAnimationFrame,
  DOMBatcher,
  MemoryMonitor,
  FrameRateMonitor,
  NetworkMonitor,
  PerformanceProfiler,
  PerformanceOptimizer,
};
