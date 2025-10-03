import React from 'react';

// Session store for audio and journal persistence
interface SessionData {
  sessionId: string | null;
  tracks: string[];
  mood: string;
  duration: number;
  createdAt: Date;
}

class SessionStore {
  private session: SessionData = {
    sessionId: null,
    tracks: [],
    mood: 'anxious',
    duration: 5,
    createdAt: new Date(),
  };

  private listeners: Set<() => void> = new Set();

  setSession(sessionId: string, tracks: string[], mood: string, duration: number) {
    this.session = {
      sessionId,
      tracks,
      mood,
      duration,
      createdAt: new Date(),
    };
    // Persist to localStorage
    localStorage.setItem('currentSession', JSON.stringify(this.session));
    // Notify listeners
    this.listeners.forEach(listener => listener());
  }

  getSession(): SessionData {
    return this.session;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  clearSession() {
    this.session = {
      sessionId: null,
      tracks: [],
      mood: 'anxious',
      duration: 5,
      createdAt: new Date(),
    };
    localStorage.removeItem('currentSession');
  }

  // Load from localStorage on init
  loadFromStorage() {
    const stored = localStorage.getItem('currentSession');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.session = {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        };
      } catch (error) {
        console.error('Failed to load session from storage:', error);
      }
    }
  }
}

// Singleton instance
export const sessionStore = new SessionStore();

// Initialize from localStorage
sessionStore.loadFromStorage();

// Hook for React components
export function useSession() {
  const [session, setSessionState] = React.useState(sessionStore.getSession());

  React.useEffect(() => {
    const unsubscribe = sessionStore.subscribe(() => {
      setSessionState(sessionStore.getSession());
    });
    return unsubscribe;
  }, []);

  return {
    session,
    setSession: sessionStore.setSession.bind(sessionStore),
    clearSession: sessionStore.clearSession.bind(sessionStore),
  };
}
