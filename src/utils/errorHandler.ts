/**
 * Custom error classes for frontend
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public timestamp: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'ServerError';
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  /**
   * Handle API errors
   * @param error - Error object
   * @returns Formatted error
   */
  static handleApiError(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;
      const message = data?.error?.message || data?.message || 'API error occurred';
      
      switch (status) {
        case 400:
          return new ValidationError(message, data?.error?.details);
        case 401:
          return new AuthenticationError(message);
        case 403:
          return new AuthorizationError(message);
        case 404:
          return new NotFoundError(message);
        case 409:
          return new ConflictError(message);
        case 429:
          return new RateLimitError(message);
        case 500:
        case 502:
        case 503:
        case 504:
          return new ServerError(message);
        default:
          return new AppError(message, status);
      }
    } else if (error.request) {
      // Request was made but no response received
      return new NetworkError('No response from server');
    } else {
      // Something else happened
      return new AppError(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Handle async function errors
   * @param fn - Async function
   * @returns Wrapped function with error handling
   */
  static asyncHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        throw this.handleApiError(error);
      }
    };
  }

  /**
   * Log error to console (in development) or external service (in production)
   * @param error - Error object
   * @param context - Additional context
   */
  static logError(error: Error, context?: any): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    };

    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.error('🚨 Error:', errorInfo);
    } else {
      // In production, send to external error reporting service
      // Example: Sentry, LogRocket, etc.
      console.error('Production error:', errorInfo);
    }
  }

  /**
   * Show user-friendly error message
   * @param error - Error object
   * @returns User-friendly message
   */
  static getUserFriendlyMessage(error: AppError): string {
    const messages: Record<string, string> = {
      ValidationError: 'Please check your input and try again.',
      NetworkError: 'Please check your internet connection and try again.',
      AuthenticationError: 'Please log in to continue.',
      AuthorizationError: 'You do not have permission to perform this action.',
      NotFoundError: 'The requested resource was not found.',
      ConflictError: 'This action conflicts with existing data.',
      RateLimitError: 'Too many requests. Please wait a moment and try again.',
      ServerError: 'Something went wrong on our end. Please try again later.',
    };

    return messages[error.name] || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Global error handler for unhandled promise rejections
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = ErrorHandler.handleApiError(event.reason);
    ErrorHandler.logError(error, { type: 'unhandledrejection' });
    
    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = new AppError(event.message, 0);
    ErrorHandler.logError(error, { 
      type: 'uncaught',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

// Export default error handler
export default ErrorHandler;
