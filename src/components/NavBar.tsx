import { useStreaks } from '../api/hooks';
import { StreakIcon, ProfileIcon } from './Icons';

type Props = { userId: string };

export default function NavBar({ userId }: Props) {
  const { data: streak, isLoading } = useStreaks(userId);
  const currentStreak = streak?.current_streak ?? 0;

  return (
    <div className="relative backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container-narrow flex items-center justify-between py-3">
        <a 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/assets/mindsphere logo.png" 
            alt="MindSphere" 
            className="h-8 w-auto select-none max-h-8" 
          />
        </a>
        
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          {isLoading ? (
            <div className="text-xs text-silver">—</div>
          ) : (
            <div className="flex items-center gap-1 bg-slate/50 border border-white/10 rounded-full px-3 py-1.5">
              <StreakIcon className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-silver font-medium">{currentStreak}</span>
            </div>
          )}
          
          {/* Profile Icon */}
          <a
            href="/profile"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            title="Profile"
          >
            <ProfileIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
