import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, authMode } from '../lib/supabase';
import { useBasicProfile, useSyncMe } from '../api/hooks';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import UserMemories from '../components/UserMemories';
import SnippetsInput from '../components/SnippetsInput';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data } = useBasicProfile();
  const syncMe = useSyncMe();
  const { userId, user: authUser, signOut } = useAuth();
  const user = data?.user;
  const profile = data?.profile;

  useEffect(() => {
    (async () => {
      if (authMode !== 'google' || !supabase) return;
      // On first mount, send Google claims to backend (idempotent)
      const { data: sess } = await supabase.auth.getUser();
      const u = sess.user;
      if (u) {
        await syncMe.mutateAsync({
          given_name: u.user_metadata?.full_name?.split(' ')[0] || u.user_metadata?.name || '',
          family_name: u.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          locale: u.user_metadata?.locale || navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    })();
  }, []);


  const handleLogout = async () => {
    try {
      if (authMode === 'google' && supabase) {
        // Google auth mode - sign out from Supabase
        await supabase.auth.signOut();
      } else {
        // Demo mode - use local auth store
        signOut();
      }
      // Navigate to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to auth page even if logout fails
      navigate('/auth');
    }
  };

  return (
    <div className="container-narrow grid-gap fadePop">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <img 
              src="/assets/profileavatar.png" 
              className="h-20 w-20 rounded-full border-2 border-indigo-400/30 shadow-lg object-cover" 
              alt="Profile"
            />
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* User Info */}
          <h1 className="text-2xl font-bold text-white">
            {authUser?.user_metadata?.full_name || 
             authUser?.display_name || 
             user?.display_name || 
             (profile?.given_name && profile?.family_name ? `${profile.given_name} ${profile.family_name}` : profile?.given_name) || 
             'Demo User'}
          </h1>
          
          <div className="text-silver text-sm mb-2">{authUser?.email || user?.email || 'demo@mindsphere.app'}</div>
          
          {/* Phone number if available */}
          {user?.phone && (
            <div className="text-silver text-sm mb-3 flex items-center gap-1">
              <span>📱</span>
              <span>{user.phone}</span>
            </div>
          )}
          
          {/* Account type badge */}
          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 text-xs font-medium text-indigo-300">
            <span>✨</span>
            <span>{authMode === 'google' ? 'Free Plan' : 'Demo Account'}</span>
          </div>
        </div>
      </Card>

      {/* Memory About Me Section */}
      <UserMemories userId={userId || ''} />

      {/* Snippets Input */}
      <SnippetsInput userId={userId || ''} />

      {/* Account Actions */}
      <Card>
        <div className="text-center">
          {/* <h3 className="text-red-400 text-lg font-medium mb-2">Account</h3> */}
          {/* <p className="text-silver text-sm mb-4">Sign out of your account</p> */}
          <button 
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 rounded-lg px-4 py-3 font-large transition-all duration-200" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </Card>
    </div>
  );
}

