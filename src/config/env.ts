import { z } from 'zod';

// Environment validation schema using Zod
const envSchema = z.object({
  // Backend API Configuration
  VITE_BACKEND_URL: z.string()
    .url('VITE_BACKEND_URL must be a valid URL')
    .default('http://localhost:8000'),
  VITE_API_BASE_URL: z.string()
    .url('VITE_API_BASE_URL must be a valid URL')
    .default('http://localhost:8000/api/v1'),

  // Development Configuration
  VITE_NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),
  VITE_APP_VERSION: z.string()
    .default('4.0.0'),

  // Feature Flags
  VITE_VOICE_AGENT_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('true'),
  VITE_MCP_INTEGRATION_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('true'),
  VITE_DEBUG_MODE: z.string()
    .transform(val => val === 'true')
    .default('false'),

  // Analytics & Monitoring (Optional)
  VITE_ANALYTICS_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('false'),
  VITE_ERROR_REPORTING_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('false'),
  VITE_PERFORMANCE_MONITORING_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('false'),

  // Supabase Configuration (Frontend)
  VITE_SUPABASE_URL: z.string()
    .url('VITE_SUPABASE_URL must be a valid URL')
    .optional(),
  VITE_SUPABASE_ANON_KEY: z.string()
    .min(20, 'VITE_SUPABASE_ANON_KEY must be at least 20 characters')
    .optional(),
  VITE_SUPABASE_AUTH_ENABLED: z.string()
    .transform(val => val === 'true')
    .default('false'),
});

/**
 * Validate environment variables
 * @returns {Object} Validated environment configuration
 */
export function validateEnv(): z.infer<typeof envSchema> {
  try {
    const result = envSchema.safeParse(import.meta.env);
    
    if (!result.success) {
      const errorMessages = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      console.error('Environment validation failed:', errorMessages);
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }

    console.log('✅ Environment validation successful');
    return result.data;
  } catch (err) {
    console.error('Failed to validate environment:', err);
    throw err;
  }
}

/**
 * Check if running in production
 * @returns {boolean}
 */
export function isProduction(): boolean {
  return import.meta.env.VITE_NODE_ENV === 'production';
}

/**
 * Check if running in development
 * @returns {boolean}
 */
export function isDevelopment(): boolean {
  return import.meta.env.VITE_NODE_ENV === 'development';
}

/**
 * Check if running in test
 * @returns {boolean}
 */
export function isTest(): boolean {
  return import.meta.env.VITE_NODE_ENV === 'test';
}

/**
 * Get environment-specific configuration
 * @returns {Object}
 */
export function getEnvConfig() {
  const config = validateEnv();
  
  return {
    ...config,
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isTest: isTest(),
  };
}

/**
 * Environment configuration with validation
 */
export const env = getEnvConfig();

// Export schema for testing
export { envSchema };
