import { useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/Auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userId, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userId) {
    return <AuthPage />;
  }

  return <>{children}</>;
}
