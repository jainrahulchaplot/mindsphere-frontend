import { useAuth } from '../contexts/AuthContext';
import HabitTrackerCard from '../components/HabitTrackerCard';
import SessionsListCard from '../components/SessionsListCard';

export default function Dashboard() {
  const { userId } = useAuth();

  return (
    <div>
      <div className="container-narrow grid-gap fadePop">
        {/* Habit Tracker Card */}
        <HabitTrackerCard userId={userId || ''} />
        
        {/* Sessions List Card */}
        <SessionsListCard userId={userId || ''} />
      </div>
    </div>
  );
}
