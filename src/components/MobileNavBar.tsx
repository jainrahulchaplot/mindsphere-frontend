import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, DashboardIcon, ProfileIcon, AIBuddyIcon } from './Icons';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Serenity',
    icon: HomeIcon,
  },
  {
    path: '/dashboard',
    label: 'Insights',
    icon: DashboardIcon,
  },
  {
    path: '/ai-buddy',
    label: 'AI Buddy',
    icon: AIBuddyIcon,
  },
];

export default function MobileNavBar({ userId }: { userId: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mobile-nav-bar">
      {/* Floating background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-indigo-900/80 to-purple-900/60 backdrop-blur-xl" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-4 w-1 h-1 bg-indigo-400/60 rounded-full animate-twinkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 right-8 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-indigo-300/50 rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3 right-16 w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-5 left-20 w-1 h-1 bg-indigo-500/40 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main navigation container */}
      <div className="relative z-10 flex items-center justify-around max-w-md mx-auto">
        {/* Navigation Items */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-500 min-h-[48px] min-w-[48px] relative overflow-hidden ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {/* Active background with glow effect */}
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-2xl animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              
              {/* Hover background */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              {/* Icon with animation */}
              <div className="relative z-10 transform transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                <IconComponent className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  isActive ? 'drop-shadow-lg' : 'group-hover:drop-shadow-md'
                }`} />
              </div>
              
              {/* Label with animation */}
              <span className={`text-xs font-medium transition-all duration-300 relative z-10 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}


        {/* Profile with enhanced animation */}
        <button
          onClick={() => navigate('/profile')}
          className={`group flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-500 min-h-[48px] min-w-[48px] relative overflow-hidden ${
            location.pathname === '/profile'
              ? 'text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {/* Active background with glow effect */}
          {location.pathname === '/profile' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-2xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          
          {/* Hover background */}
          {location.pathname !== '/profile' && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          
          {/* Icon with animation */}
          <div className="relative z-10 transform transition-all duration-300 group-hover:scale-110 group-active:scale-95">
            <ProfileIcon className={`w-6 h-6 mb-1 transition-all duration-300 ${
              location.pathname === '/profile' ? 'drop-shadow-lg' : 'group-hover:drop-shadow-md'
            }`} />
          </div>
          
          {/* Label with animation */}
          <span className={`text-xs font-medium transition-all duration-300 relative z-10 ${
            location.pathname === '/profile' ? 'text-white' : 'text-slate-400 group-hover:text-white'
          }`}>
            Profile
          </span>
          
          {/* Active indicator dot */}
          {location.pathname === '/profile' && (
            <div className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
    </div>
  );
}
