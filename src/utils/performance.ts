import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Performance monitoring utilities
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceReport {
  timestamp: string;
  url: string;
  userAgent: string;
  metrics: PerformanceMetric[];
  customMetrics: Record<string, number>;
}

class PerformanceMonitor {
  private customMetrics: Record<string, number> = {};
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED === 'true';
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (!this.isEnabled) {
      console.log('Performance monitoring is disabled');
      return;
    }

    this.setupWebVitals();
    this.setupCustomMetrics();
    this.setupResourceTiming();
    this.setupNavigationTiming();
  }

  /**
   * Setup Web Vitals monitoring
   */
  private setupWebVitals(): void {
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  /**
   * Handle Web Vitals metric
   */
  private handleMetric(metric: any): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };

    this.logMetric(performanceMetric);
    this.sendMetric(performanceMetric);
  }

  /**
   * Setup custom performance metrics
   */
  private setupCustomMetrics(): void {
    // Monitor component render times
    this.observeComponentRenders();
    
    // Monitor API call performance
    this.observeApiCalls();
    
    // Monitor memory usage
    this.observeMemoryUsage();
  }

  /**
   * Observe component render times
   */
  private observeComponentRenders(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          this.customMetrics[`component-${entry.name}`] = entry.duration;
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);
  }

  /**
   * Observe API call performance
   */
  private observeApiCalls(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('/api/')) {
          const duration = entry.responseEnd - entry.requestStart;
          this.customMetrics[`api-${entry.name.split('/').pop()}`] = duration;
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  /**
   * Observe memory usage
   */
  private observeMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.customMetrics['memory-used'] = memory.usedJSHeapSize;
      this.customMetrics['memory-total'] = memory.totalJSHeapSize;
      this.customMetrics['memory-limit'] = memory.jsHeapSizeLimit;
    }
  }

  /**
   * Setup resource timing monitoring
   */
  private setupResourceTiming(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.analyzeResourcePerformance(entry as PerformanceResourceTiming);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  /**
   * Setup navigation timing monitoring
   */
  private setupNavigationTiming(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          this.analyzeNavigationPerformance(entry as PerformanceNavigationTiming);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  /**
   * Analyze resource performance
   */
  private analyzeResourcePerformance(entry: PerformanceResourceTiming): void {
    const { name, duration, transferSize, encodedBodySize } = entry;
    
    // Log slow resources
    if (duration > 1000) {
      console.warn(`Slow resource: ${name} took ${duration}ms`);
    }

    // Track large resources
    if (transferSize > 100000) { // 100KB
      console.warn(`Large resource: ${name} is ${transferSize} bytes`);
    }

    // Calculate compression ratio
    if (encodedBodySize > 0) {
      const compressionRatio = (1 - transferSize / encodedBodySize) * 100;
      this.customMetrics[`compression-${name.split('/').pop()}`] = compressionRatio;
    }
  }

  /**
   * Analyze navigation performance
   */
  private analyzeNavigationPerformance(entry: PerformanceNavigationTiming): void {
    const { domContentLoadedEventEnd, loadEventEnd, domInteractive } = entry;
    
    this.customMetrics['dom-content-loaded'] = domContentLoadedEventEnd - domInteractive;
    this.customMetrics['page-load'] = loadEventEnd - domInteractive;
  }

  /**
   * Start measuring a custom metric
   */
  startMeasure(name: string): void {
    if (this.isEnabled) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End measuring a custom metric
   */
  endMeasure(name: string): void {
    if (this.isEnabled) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number): void {
    if (this.isEnabled) {
      this.customMetrics[name] = value;
    }
  }

  /**
   * Log performance metric
   */
  private logMetric(metric: PerformanceMetric): void {
    const emoji = this.getRatingEmoji(metric.rating);
    console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }

  /**
   * Get rating emoji
   */
  private getRatingEmoji(rating: string): string {
    switch (rating) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '📊';
    }
  }

  /**
   * Send metric to analytics service
   */
  private sendMetric(metric: PerformanceMetric): void {
    if (import.meta.env.VITE_ANALYTICS_ENABLED === 'true') {
      // Send to analytics service (e.g., Google Analytics, Mixpanel)
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      });
    }

    // Example: Send to custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
      }),
    }).catch(error => {
      console.error('Failed to send performance metric:', error);
    });
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: [], // Web Vitals metrics are handled separately
      customMetrics: { ...this.customMetrics },
    };
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {
      customMetrics: this.customMetrics,
      memory: this.getMemoryInfo(),
      timing: this.getTimingInfo(),
    };

    return summary;
  }

  /**
   * Get memory information
   */
  private getMemoryInfo(): Record<string, number> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return {};
  }

  /**
   * Get timing information
   */
  private getTimingInfo(): Record<string, number> {
    const timing = performance.timing;
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
    };
  }

  /**
   * Get first paint time
   */
  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
    return fpEntry ? fpEntry.startTime : 0;
  }

  /**
   * Get first contentful paint time
   */
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const startMeasure = (name: string) => performanceMonitor.startMeasure(name);
export const endMeasure = (name: string) => performanceMonitor.endMeasure(name);
export const recordMetric = (name: string, value: number) => performanceMonitor.recordMetric(name, value);
export const getPerformanceSummary = () => performanceMonitor.getSummary();

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}
