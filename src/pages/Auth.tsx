import { useState } from 'react';
import { supabase, authMode } from '../lib/supabase';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const isGoogle = authMode === 'google';

  // Local development bypass
  const handleLocalDevSignIn = () => {
    console.log('Local development mode - bypassing auth');
    // Set flag for local development mode
    localStorage.setItem('mindsphere_local_dev', 'true');
    // This will trigger the auth context to use demo user
    window.location.reload();
  };

  async function signInWithGoogle() {
    if (!supabase) return alert('Supabase not configured');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google sign in failed:', error);
        setError('Google sign in failed. Please try again.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      setError('Google sign in failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-white/3 to-white/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-white/4 to-white/6 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-white/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-white/30 rounded-full animate-float-slow delay-1000"></div>
        <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-slow delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/35 rounded-full animate-float-slow delay-3000"></div>
        <div className="absolute bottom-1/6 left-2/3 w-2 h-2 bg-white/15 rounded-full animate-float-slow delay-4000"></div>
        <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-white/20 rounded-full animate-float-slow delay-5000"></div>
        <div className="absolute bottom-1/2 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-slow delay-1500"></div>
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white/30 rounded-full animate-float-slow delay-2500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white/10 rounded-full animate-float-slow delay-3500"></div>
        <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-white/40 rounded-full animate-float-slow delay-4500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Title Section */}
          <div className="text-center mb-12 animate-fade-in">
            
            <h1 className="text-white text-4xl mb-0 font-light mb-3 tracking-wide animate-slide-up">
              Welcome to
              {/* <span className="block text-5xl font-thin bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                MindSphere
              </span> */}
            </h1>
            <div className="relative inline-block mb-0">
              <div className="absolute inset-0"></div>
              <img 
                src="/assets/mindsphere logo.png" 
                alt="MindSphere" 
                className="relative mx-auto h-32 w-auto object-contain drop-shadow-2xl animate-float" 
              />
            </div>
            <p className="text-white/70 text-lg font-medium tracking-wide animate-slide-up delay-200">
              Your personalized space for growth, reflection and consistency
            </p>
          </div>

          {/* Auth Card */}
          <div className="relative group">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl px-6 py-6 shadow-2xl group-hover:bg-white/8 transition-all duration-500">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-pulse">
                  {error}
                </div>
              )}
              {isGoogle ? (
                <div>
                  <button
                    onClick={signInWithGoogle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={loading}
                    className="w-full group/btn relative overflow-hidden"
                  >
                    {/* Button Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl group-hover/btn:from-white/20 group-hover/btn:to-white/10 transition-all duration-300"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center gap-4 py-4 px-6">
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-white font-medium">Authenticating...</span>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                            <img 
                              src="https://www.svgrepo.com/show/475656/google-color.svg" 
                              className="relative h-6 w-6 drop-shadow-lg" 
                            />
                          </div>
                          <span className="text-white font-medium text-lg tracking-wide">
                            Sign in with Google
                          </span>
                          <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </button>
                  
                  {/* Local Development Bypass Button - Only show in development */}
                  {import.meta.env.DEV && (
                    <button
                      onClick={handleLocalDevSignIn}
                      className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl text-purple-200 hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                        <span className="font-medium">Local Development Mode</span>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-white/70 text-lg mb-6">
                    Demo mode enabled
                  </div>
                  <a 
                    href="/" 
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                  >
                    <span>Go to app</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm font-light">
                  By continuing, you agree to our{' '}
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-white/60 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60 bg-transparent border-none cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.6; }
          75% { transform: translateY(-15px) translateX(8px); opacity: 0.9; }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
}
