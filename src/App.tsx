import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { AudioManagerProvider } from './contexts/AudioManagerContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IntegratedHeader from './components/IntegratedHeader';
import MobileNavBar from './components/MobileNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MeditationPage from './pages/MeditationPage';
import SessionPage from './pages/SessionPage';
import ViewOnlySessionPage from './pages/ViewOnlySessionPage';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/ProfilePage';
import AIBuddyPage from './pages/AIBuddyPage';
import VoiceInterface from './pages/VoiceInterface';

function AppContent() {
  const location = useLocation();
  const isSessionPage = location.pathname.startsWith('/session/') || location.pathname.startsWith('/view-session/');
  const isSignInPage = location.pathname === '/signin';
  const { userId, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white/70 text-lg">Loading MindSphere...</div>
        </div>
      </div>
    );
  }

  // If not authenticated and not on sign-in page, redirect to sign-in
  if (!userId && !isSignInPage) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated and on sign-in page, redirect to home
  if (userId && isSignInPage) {
    return <Navigate to="/" replace />;
  }

  // Show sign-in page for unauthenticated users
  if (!userId && isSignInPage) {
    return <AuthPage />;
  }

  // Show main app for authenticated users
  return (
    <div className='relative animate-fadeIn'>
      {!isSignInPage && <IntegratedHeader userId={userId!} />}
      <div className={!isSessionPage && !isSignInPage ? 'pb-20' : ''}> {/* 80px bottom padding for mobile nav spacing */}
        <Routes>
          <Route path="/" element={<MeditationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-buddy" element={<AIBuddyPage />} />
          <Route path="/voice-interface" element={<VoiceInterface />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="/view-session/:sessionId" element={<ViewOnlySessionPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Catch-all route - redirect unknown paths to homepage */}
          <Route path="*" element={<MeditationPage />} />
        </Routes>
      </div>
      {!isSessionPage && !isSignInPage && <MobileNavBar userId={userId!} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioManagerProvider>
        <AudioProvider>
          <Router>
            <AppContent />
          </Router>
        </AudioProvider>
      </AudioManagerProvider>
    </AuthProvider>
  );
}