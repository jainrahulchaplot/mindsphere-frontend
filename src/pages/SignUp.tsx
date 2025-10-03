import { useState } from 'react';
import { useAuth } from '../state/auth';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password);
      // Redirect will happen via ProtectedRoute
    } catch (error) {
      console.error('Sign up failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-narrow">
        <Card>
          <div className="heading">Sign Up</div>
          <div className="subtle mt-1">Demo mode - any credentials work</div>
          
          <form onSubmit={handleSubmit} className="mt-4 grid-gap">
            <div>
              <label className="subtle">Email</label>
              <input
                type="email"
                className="mt-1 w-full bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="subtle">Password</label>
              <input
                type="password"
                className="mt-1 w-full bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              label={isLoading ? 'Signing up...' : 'Sign Up'} 
              onClick={() => {}} 
              type="submit"
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
