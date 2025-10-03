import { useStreaks } from '../api/hooks';
import { StreakIcon, ProfileIcon } from './Icons';

type Props = { userId: string };

export default function PremiumNavBar({ userId }: Props) {
  const { data: streak, isLoading } = useStreaks(userId);
  const currentStreak = streak?.current_streak ?? 0;

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-r from-slate-900/40 via-purple-900/20 to-slate-900/40 border-b border-white/10 shadow-2xl">
      <div className="container-narrow flex items-center justify-between py-4">
        {/* Logo Section */}
        <a 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
        >
          <div className="relative">
            <img 
              src="/assets/mindsphere logo.png" 
              alt="MindSphere" 
              className="h-8 w-auto select-none max-h-8 transition-transform duration-300 group-hover:scale-105" 
            />
            {/* <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
          </div>
          {/* <div className="text-lg font-semibold text-white tracking-wide">
            MINDSPHERE
          </div> */}
        </a>
        
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <div className="text-xs text-white/60 font-medium">—</div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl px-4 py-2 backdrop-blur-sm hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 group">
              <div className="relative">
                <StreakIcon className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-sm text-white font-semibold tracking-wide">
                {currentStreak}
              </div>
              <div className="text-xs text-orange-300/70 font-medium">
                day{currentStreak !== 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {/* Profile Icon */}
          <a
            href="/profile"
            className="group relative w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm border border-white/10 hover:border-white/20 active:scale-95"
            title="Profile"
          >
            <div className="relative">
              <ProfileIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
