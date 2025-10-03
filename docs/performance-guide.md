# Performance Optimization Guide

This guide covers performance optimization strategies, monitoring tools, and best practices for the MindSphere application.

## 🚀 Performance Overview

### Key Performance Metrics
- **First Contentful Paint (FCP)**: < 1.8s (Good)
- **Largest Contentful Paint (LCP)**: < 2.5s (Good)
- **First Input Delay (FID)**: < 100ms (Good)
- **Cumulative Layout Shift (CLS)**: < 0.1 (Good)
- **Time to First Byte (TTFB)**: < 600ms (Good)

### Performance Budget
- **Total Bundle Size**: < 2MB
- **JavaScript**: < 1MB
- **CSS**: < 100KB
- **Images**: < 500KB per image
- **API Response Time**: < 200ms

## 📊 Performance Monitoring

### Frontend Monitoring
```typescript
import { performanceMonitor } from '@/utils/performance';

// Initialize monitoring
performanceMonitor.init();

// Record custom metrics
performanceMonitor.recordMetric('custom-action', 150);

// Get performance summary
const summary = performanceMonitor.getSummary();
```

### Backend Monitoring
```javascript
const { performanceCollector } = require('./middleware/performance');

// Record performance metrics
performanceCollector.record('api-call', 200, { endpoint: '/api/users' });

// Get statistics
const stats = performanceCollector.getStats('api-call');
```

### Web Vitals Monitoring
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Monitor Core Web Vitals
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 Performance Optimization Strategies

### 1. Code Splitting and Lazy Loading

#### Route-based Code Splitting
```typescript
import { createLazyRoute } from '@/components/LazyWrapper';

// Lazy load pages
export const LazyDashboard = createLazyRoute(
  () => import('./Dashboard'),
  'dashboard'
);
```

#### Component-based Code Splitting
```typescript
import { createLazyComponent } from '@/components/LazyWrapper';

// Lazy load heavy components
export const LazyVoiceAgent = createLazyComponent(
  () => import('@/components/VoiceAgent'),
  {
    fallback: <div>Loading voice agent...</div>,
  }
);
```

#### Intersection Observer Lazy Loading
```typescript
import { createLazyComponentWithIntersection } from '@/components/LazyWrapper';

// Lazy load when visible
export const LazyImageGallery = createLazyComponentWithIntersection(
  () => import('@/components/ImageGallery'),
  { threshold: 0.1 }
);
```

### 2. Caching Strategies

#### Frontend Caching
```typescript
import { cache, apiCacheUtils } from '@/utils/cache';

// Cache API responses
const data = await apiCacheUtils.get(
  'users',
  () => fetch('/api/users').then(r => r.json()),
  5 * 60 * 1000 // 5 minutes
);

// Cache with different strategies
cache.set('user-preferences', preferences, {
  strategy: 'localStorage',
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});
```

#### Backend Caching
```javascript
const { cacheMiddleware } = require('./middleware/cache');

// Apply caching to routes
app.use('/api/static-data', cacheMiddleware({
  ttl: 30 * 60 * 1000, // 30 minutes
  skipIf: (req) => req.method !== 'GET',
}));
```

### 3. Bundle Optimization

#### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query', 'axios'],
          'livekit-vendor': ['livekit-client', '@livekit/components-react'],
        },
      },
    },
  },
});
```

#### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Build and analyze
npm run build:analyze
```

### 4. Image Optimization

#### Lazy Loading Images
```typescript
import { PerformanceOptimizer } from '@/utils/performanceUtils';

// Lazy load images
PerformanceOptimizer.lazyLoadImages();

// Optimize image URLs
const optimizedSrc = PerformanceOptimizer.optimizeImage(src, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp',
});
```

#### Responsive Images
```html
<picture>
  <source media="(min-width: 768px)" srcset="image-large.webp" type="image/webp">
  <source media="(min-width: 768px)" srcset="image-large.jpg" type="image/jpeg">
  <source srcset="image-small.webp" type="image/webp">
  <img src="image-small.jpg" alt="Description" loading="lazy">
</picture>
```

### 5. API Optimization

#### Request Batching
```typescript
class APIBatcher {
  private batch: any[] = [];
  private timeout: NodeJS.Timeout | null = null;

  add(request: any) {
    this.batch.push(request);
    
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.flush();
      }, 100);
    }
  }

  private async flush() {
    const requests = this.batch.slice();
    this.batch = [];
    this.timeout = null;
    
    // Process batch
    await this.processBatch(requests);
  }
}
```

#### Response Compression
```javascript
const { optimizedCompression } = require('./middleware/optimization');

// Apply compression
app.use(optimizedCompression());
```

### 6. Database Optimization

#### Query Optimization
```javascript
// Use indexes
db.collection('users').createIndex({ email: 1 });

// Limit results
db.collection('users').find({}).limit(50);

// Select specific fields
db.collection('users').find({}, { name: 1, email: 1 });
```

#### Connection Pooling
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🛠️ Performance Tools

### 1. Performance Timer
```typescript
import { PerformanceTimer } from '@/utils/performanceUtils';

const timer = new PerformanceTimer('api-call');
timer.start();

// ... perform operation ...

const duration = timer.end();
console.log(`Operation took ${duration}ms`);
```

### 2. Memory Monitor
```typescript
import { memoryMonitor } from '@/utils/performanceUtils';

// Start monitoring
memoryMonitor.start();

// Get memory info
const memoryInfo = memoryMonitor.getMemoryInfo();
console.log(`Memory usage: ${memoryInfo.percentage.toFixed(2)}%`);
```

### 3. Frame Rate Monitor
```typescript
import { frameRateMonitor } from '@/utils/performanceUtils';

// Start monitoring
frameRateMonitor.start();

// Get FPS
const fps = frameRateMonitor.getFPS();
console.log(`Current FPS: ${fps}`);
```

### 4. Network Monitor
```typescript
import { networkMonitor } from '@/utils/performanceUtils';

// Start monitoring
networkMonitor.start();

// Get slow resources
const slowResources = networkMonitor.getSlowResources(1000);
console.log('Slow resources:', slowResources);
```

## 📈 Performance Testing

### 1. Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### 2. Bundle Size Testing
```bash
# Analyze bundle
npm run analyze

# Check size limits
npm run build:analyze
```

### 3. Performance Audits
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

## 🔍 Performance Debugging

### 1. Chrome DevTools
- **Performance Tab**: Record and analyze performance
- **Memory Tab**: Monitor memory usage
- **Network Tab**: Analyze network requests
- **Lighthouse Tab**: Run performance audits

### 2. React DevTools Profiler
```typescript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id);
  console.log('Phase:', phase);
  console.log('Duration:', actualDuration);
}

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### 3. Performance API
```typescript
// Measure custom operations
performance.mark('operation-start');
// ... perform operation ...
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

// Get measurements
const measurements = performance.getEntriesByType('measure');
console.log(measurements);
```

## 🎯 Performance Best Practices

### 1. Frontend Best Practices
- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` for expensive calculations
- Avoid inline object/function creation in render
- Use `key` prop correctly for list items
- Implement virtual scrolling for large lists
- Use `IntersectionObserver` for lazy loading
- Optimize images and use modern formats (WebP, AVIF)
- Minimize third-party scripts
- Use service workers for caching

### 2. Backend Best Practices
- Implement connection pooling
- Use database indexes
- Cache frequently accessed data
- Implement rate limiting
- Use compression (gzip, brotli)
- Optimize database queries
- Use CDN for static assets
- Implement proper error handling
- Monitor memory and CPU usage

### 3. Network Best Practices
- Use HTTP/2
- Implement proper caching headers
- Minimize HTTP requests
- Use request batching
- Implement retry logic
- Use compression
- Optimize API responses
- Use CDN for global distribution

## 📊 Performance Metrics Dashboard

### Key Metrics to Monitor
1. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. **Bundle Metrics**
   - Total bundle size
   - JavaScript bundle size
   - CSS bundle size
   - Number of chunks

3. **API Metrics**
   - Response time
   - Error rate
   - Throughput
   - Cache hit rate

4. **User Experience Metrics**
   - Page load time
   - Time to interactive
   - First contentful paint
   - Time to first byte

### Monitoring Tools
- **Google Analytics**: User behavior and performance
- **Google PageSpeed Insights**: Performance audits
- **WebPageTest**: Detailed performance analysis
- **Lighthouse**: Performance, accessibility, SEO audits
- **Chrome DevTools**: Real-time performance monitoring

## 🚨 Performance Alerts

### Alert Thresholds
- **Bundle Size**: > 2MB
- **API Response Time**: > 500ms
- **Memory Usage**: > 100MB
- **CPU Usage**: > 80%
- **Error Rate**: > 5%
- **Cache Hit Rate**: < 80%

### Alert Actions
1. **Immediate**: Critical performance issues
2. **Warning**: Performance degradation
3. **Info**: Performance trends and insights

---

*Performance guide created during Phase 4 of the MindSphere code cleanup process*
