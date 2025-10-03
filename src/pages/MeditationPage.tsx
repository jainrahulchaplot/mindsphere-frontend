import { useNavigate } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import SessionSetup from '../components/SessionSetup';
import { useSession } from '../state/session';
import { useAuth } from '../contexts/AuthContext';

export default function MeditationPage() {
  const { setSession } = useSession();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const onSessionCreated = (d: { sessionId: string; status: string }) => {
    // Store session data for the new sequential approach
    console.log('🎵 MeditationPage: Session created:', d);
    setSession(d.sessionId, [], 'calm', 0); // Empty tracks initially, will be populated in SessionPage
    
    // Navigate to the dedicated session page immediately
    navigate(`/session/${d.sessionId}`);
  };

  return (
    <div className='animate-fadeIn'>
      <div className='container-narrow grid-gap fadePop'>
        <QuoteCard />
        
        <SessionSetup onSessionCreated={onSessionCreated} userId={userId || ''} />
      </div>
    </div>
  );
}
