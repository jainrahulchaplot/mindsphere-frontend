import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  userId: string | null;
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for local development mode flag
    const isLocalDev = localStorage.getItem('mindsphere_local_dev') === 'true';
    
    // Local development bypass - use demo user
    if (isLocalDev || !supabase) {
      console.warn('Local development mode - using demo user');
      setUserId('550e8400-e29b-41d4-a716-446655440000');
      setUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'demo@mindsphere.local',
        name: 'Demo User',
        picture: null
      });
      setIsLoading(false);
      return;
    }

    // Get initial session with better error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (error) {
          console.error('Auth initialization error:', error);
          setUserId(null);
          setUser(null);
        } else if (session?.user) {
          setUserId(session.user.id);
          setUser(session.user);
        } else {
          setUserId(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUserId(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with better error handling
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          setUser(session.user);
          // Store login state in localStorage for persistence
          localStorage.setItem('mindsphere_auth', 'true');
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setUser(null);
          // Clear login state from localStorage
          localStorage.removeItem('mindsphere_auth');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUserId(session.user.id);
          setUser(session.user);
          // Ensure login state is maintained
          localStorage.setItem('mindsphere_auth', 'true');
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUserId(session.user.id);
          setUser(session.user);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Check if in local development mode
      const isLocalDev = localStorage.getItem('mindsphere_local_dev') === 'true';
      
      if (isLocalDev) {
        // Clear local development mode
        localStorage.removeItem('mindsphere_local_dev');
        setUserId(null);
        setUser(null);
        localStorage.removeItem('mindsphere_auth');
        // Redirect to signin page
        window.location.href = '/signin';
        return;
      }
      
      if (supabase) {
        await supabase!.auth.signOut();
      }
      setUserId(null);
      setUser(null);
      // Clear login state from localStorage
      localStorage.removeItem('mindsphere_auth');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force local sign out even if Supabase fails
      setUserId(null);
      setUser(null);
      localStorage.removeItem('mindsphere_auth');
    }
  };

  return (
    <AuthContext.Provider value={{ userId, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
