import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock API responses
export const mockApiResponse = <T>(data: T, delay: number = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock API error
export const mockApiError = (message: string, status: number = 500) => {
  const error = new Error(message);
  (error as any).response = {
    status,
    data: { message },
  };
  return Promise.reject(error);
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockSession = (overrides = {}) => ({
  id: 'test-session-id',
  userId: 'test-user-id',
  mood: 'calm',
  duration: 10,
  style: 'breathwork',
  notes: 'Test session notes',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockJournal = (overrides = {}) => ({
  id: 'test-journal-id',
  userId: 'test-user-id',
  content: 'Test journal entry',
  mood: 'happy',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockMemory = (overrides = {}) => ({
  id: 'test-memory-id',
  userId: 'test-user-id',
  content: 'Test memory',
  type: 'session',
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

// Mock fetch
export const mockFetch = (response: any, ok: boolean = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

// Mock fetch error
export const mockFetchError = (error: string) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error));
};

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test helpers
export const expectToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectToBeHidden = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).not.toBeVisible();
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };
