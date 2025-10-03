// Auth store for demo mode - keep existing demo logic exactly as-is for demo mode
interface AuthState {
  userId: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

class AuthStore implements AuthState, AuthActions {
  userId: string | null = null;

  constructor() {
    // Load from localStorage on init
    this.userId = localStorage.getItem('userId');
  }

  async signIn(email: string, password: string): Promise<void> {
    // Production: Implement real authentication
    throw new Error('Authentication not implemented - use Google OAuth');
  }

  async signUp(email: string, password: string): Promise<void> {
    // Production: Implement real authentication
    throw new Error('Authentication not implemented - use Google OAuth');
  }

  signOut(): void {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}

// Singleton instance
export const authStore = new AuthStore();

// Hook for React components
export function useAuth() {
  return {
    userId: authStore.userId,
    signIn: authStore.signIn.bind(authStore),
    signUp: authStore.signUp.bind(authStore),
    signOut: authStore.signOut.bind(authStore),
  };
}
