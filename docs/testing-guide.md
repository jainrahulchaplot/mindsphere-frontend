# Testing Guide

This guide covers testing strategies, best practices, and implementation details for the MindSphere application.

## 🧪 Testing Framework

### Frontend Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers

### Backend Testing
- **Jest** - Test runner and assertion library
- **Supertest** - HTTP assertion library for Express.js

## 📁 Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   └── SessionSetup.test.tsx
├── api/
│   ├── __tests__/
│   │   └── client.test.ts
└── test/
    ├── setup.ts
    └── test-utils.tsx

backend/src/
├── __tests__/
│   ├── logger.test.js
│   └── routes_voice_token.test.js
└── test/
    ├── setup.js
    ├── globalSetup.js
    ├── globalTeardown.js
    └── test-utils.js
```

## 🚀 Running Tests

### Frontend Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Backend Tests
```bash
# Run all tests
cd backend && npm test

# Run tests in watch mode
cd backend && npm run test:watch

# Run tests with coverage
cd backend && npm run test:coverage

# Run tests for CI
cd backend && npm run test:ci
```

## 📝 Test Categories

### 1. Unit Tests
Test individual functions, components, or modules in isolation.

**Frontend Example:**
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

**Backend Example:**
```javascript
// logger.test.js
const logger = require('../logger');

describe('Logger', () => {
  it('logs info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    logger.info('Test message');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests
Test the interaction between multiple components or modules.

**Frontend Example:**
```typescript
// SessionSetup.test.tsx
describe('SessionSetup Component', () => {
  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<SessionSetup onSessionCreated={mockOnSessionCreated} />);
    
    await user.selectOptions(screen.getByLabelText(/mood/i), 'calm');
    await user.click(screen.getByRole('button', { name: /start session/i }));
    
    expect(mockMutate).toHaveBeenCalledWith({
      mood: 'calm',
      duration: 10,
      style: 'breathwork',
    });
  });
});
```

**Backend Example:**
```javascript
// routes_voice_token.test.js
describe('Voice Token Routes', () => {
  it('generates token with default parameters', async () => {
    const response = await request(app)
      .post('/api/voice/token')
      .send({})
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });
});
```

### 3. End-to-End Tests
Test complete user workflows from start to finish.

```typescript
// e2e/session-flow.test.ts
describe('Session Flow', () => {
  it('completes a full meditation session', async () => {
    // Navigate to session setup
    await page.goto('/session/setup');
    
    // Fill out session form
    await page.selectOption('[data-testid="mood-select"]', 'calm');
    await page.selectOption('[data-testid="duration-select"]', '10');
    
    // Start session
    await page.click('[data-testid="start-session-button"]');
    
    // Verify session started
    await expect(page.locator('[data-testid="session-timer"]')).toBeVisible();
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Naming
- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests using `describe` blocks

```typescript
describe('Button Component', () => {
  describe('when disabled', () => {
    it('should not trigger click events', () => {
      // test implementation
    });
  });
});
```

### 2. Test Structure (AAA Pattern)
- **Arrange** - Set up test data and conditions
- **Act** - Execute the code being tested
- **Assert** - Verify the expected outcome

```typescript
it('should increment counter when clicked', () => {
  // Arrange
  render(<Counter />);
  const button = screen.getByRole('button');
  
  // Act
  fireEvent.click(button);
  
  // Assert
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### 3. Mocking Strategies
- Mock external dependencies (APIs, databases, file system)
- Use test doubles for complex objects
- Mock at the boundary of your system

```typescript
// Mock API calls
jest.mock('@/api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/test' }),
}));
```

### 4. Test Data Management
- Use factories for creating test data
- Keep test data minimal and focused
- Use realistic but not real data

```typescript
// test-utils.tsx
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});
```

### 5. Async Testing
- Use `async/await` for asynchronous operations
- Wait for DOM updates with `waitFor`
- Test loading states and error conditions

```typescript
it('should load user data', async () => {
  render(<UserProfile userId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 🔧 Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_BACKEND_URL = 'http://localhost:8000';

// Mock window APIs
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});
```

## 📊 Coverage Requirements

### Minimum Coverage Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

## 🚨 Common Testing Pitfalls

### 1. Testing Implementation Details
❌ **Don't test internal state or methods**
```typescript
// Bad - testing implementation
expect(component.state.isLoading).toBe(true);
```

✅ **Test user-visible behavior**
```typescript
// Good - testing behavior
expect(screen.getByText('Loading...')).toBeInTheDocument();
```

### 2. Over-mocking
❌ **Don't mock everything**
```typescript
// Bad - over-mocking
jest.mock('./utils');
jest.mock('./hooks');
jest.mock('./components');
```

✅ **Mock only external dependencies**
```typescript
// Good - minimal mocking
jest.mock('@/api/client');
```

### 3. Brittle Tests
❌ **Don't rely on implementation details**
```typescript
// Bad - brittle test
expect(container.querySelector('.btn-primary')).toBeInTheDocument();
```

✅ **Use semantic queries**
```typescript
// Good - stable test
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

## 🔄 Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
```

### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mock Service Worker](https://mswjs.io/) - API mocking library

---

*Testing guide created during Phase 3 of the MindSphere code cleanup process*
