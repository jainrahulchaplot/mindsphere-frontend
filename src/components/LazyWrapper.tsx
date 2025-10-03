import React, { Suspense, lazy, ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Lazy wrapper component for code splitting
 */
export function LazyWrapper({
  fallback = <div>Loading...</div>,
  errorFallback = <div>Something went wrong</div>,
  onError,
}: LazyWrapperProps) {
  return function Wrapper<T extends ComponentType<any>>(
    Component: T
  ): ComponentType<React.ComponentProps<T>> {
    return function LazyComponent(props: React.ComponentProps<T>) {
      return (
        <ErrorBoundary
          fallback={errorFallback}
          onError={onError}
        >
          <Suspense fallback={fallback}>
            <Component {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    };
  };
}

/**
 * Create a lazy component with error boundary and suspense
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: LazyWrapperProps
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);
  
  return LazyWrapper(options)(LazyComponent);
}

/**
 * Preload a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  // Start loading the component in the background
  importFunc().catch(error => {
    console.warn('Failed to preload component:', error);
  });
}

/**
 * Preload multiple components
 */
export function preloadComponents(
  importFuncs: Array<() => Promise<{ default: ComponentType<any> }>>
): void {
  importFuncs.forEach(preloadComponent);
}

/**
 * Lazy load a component with retry logic
 */
export function createLazyComponentWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): ComponentType<React.ComponentProps<T>> {
  const retryImport = async (retries: number = maxRetries): Promise<{ default: T }> => {
    try {
      return await importFunc();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Component load failed, retrying in ${retryDelay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return retryImport(retries - 1);
      }
      throw error;
    }
  };

  return createLazyComponent(retryImport);
}

/**
 * Lazy load a component with loading state
 */
export function createLazyComponentWithLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>
): ComponentType<React.ComponentProps<T>> {
  return createLazyComponent(importFunc, {
    fallback: <LoadingComponent />,
  });
}

/**
 * Lazy load a component with error handling
 */
export function createLazyComponentWithError<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  ErrorComponent: ComponentType<{ error: Error; retry: () => void }> = ({ error, retry }) => (
    <div>
      <p>Failed to load component: {error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )
): ComponentType<React.ComponentProps<T>> {
  return createLazyComponent(importFunc, {
    errorFallback: <ErrorComponent error={new Error('Component load failed')} retry={() => window.location.reload()} />,
  });
}

/**
 * Lazy load a component with intersection observer
 */
export function createLazyComponentWithIntersection<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: IntersectionObserverInit
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);
  
  return function IntersectionLazyComponent(props: React.ComponentProps<T>) {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          ...options,
        }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={elementRef}>
        {isVisible ? (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  };
}

/**
 * Lazy load a component with route-based code splitting
 */
export function createLazyRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  routeName: string
): ComponentType<React.ComponentProps<T>> {
  // Preload the component when the route is likely to be visited
  React.useEffect(() => {
    const preloadRoute = () => {
      if (window.location.pathname.includes(routeName)) {
        preloadComponent(importFunc);
      }
    };

    // Preload on hover over navigation links
    const navLinks = document.querySelectorAll(`[href*="${routeName}"]`);
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', preloadRoute);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('mouseenter', preloadRoute);
      });
    };
  }, [routeName]);

  return createLazyComponent(importFunc);
}

export default LazyWrapper;
