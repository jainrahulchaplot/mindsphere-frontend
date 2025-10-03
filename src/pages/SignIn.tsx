import { useState } from 'react';
import { useAuth } from '../state/auth';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      await signIn(email, password);
      // Redirect will happen via ProtectedRoute
    } catch (error) {
      console.error('Sign in failed:', error);
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container-narrow">
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-2xl">
          <div className="text-center">
            <div className="heading">Welcome to MindSphere</div>
            <div className="subtle mt-1">Your meditation journey begins here</div>
          </div>
          
          <form onSubmit={handleSubmit} className={`mt-4 grid-gap transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}>
            {error && (
              <div className="p-2 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="subtle">Email</label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="subtle">Password</label>
              <input
                id="password"
                type="password"
                className="mt-1 w-full bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button 
              label="Begin Journey" 
              onClick={() => {}} 
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full mt-4"
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
