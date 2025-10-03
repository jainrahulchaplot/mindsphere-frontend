import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// ===== AUDIO/VOLUME ICONS =====

export const VolumeIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="speakerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M3 9v6h4l5 5V4L7 9H3z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#glow)" />
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.3" />
  </svg>
);

export const VolumeMutedIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="speakerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M3 9v6h4l5 5V4L7 9H3z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#glow)" />
    <line x1="18" y1="6" x2="6" y2="18" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
  </svg>
);

export const VolumeHighIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="speakerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M3 9v6h4l5 5V4L7 9H3z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#glow)" />
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.3" />
    <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="url(#speakerGradient)" stroke="#cccccc" strokeWidth="0.3" />
  </svg>
);

// ===== MICROPHONE ICONS =====

export const MicrophoneIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="micHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="micGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="url(#micGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#micGlow)" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#micGlow)" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" filter="url(#micGlow)" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" filter="url(#micGlow)" />
  </svg>
);

export const MicrophoneRecordingIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="micHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="micGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#ff4444" stroke="#ff6666" strokeWidth="0.5" filter="url(#micGlow)" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#micGlow)" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" filter="url(#micGlow)" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" filter="url(#micGlow)" />
    
    {/* Recording indicator */}
    <circle cx="12" cy="12" r="3" fill="#ff4444" opacity="0.3" filter="url(#micGlow)">
      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// ===== MEDIA CONTROL ICONS =====

export const PlayIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="playHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="playGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <polygon points="5,3 19,12 5,21" fill="url(#playGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#playGlow)" />
  </svg>
);

export const PauseIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="pauseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="pauseHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="pauseGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <rect x="6" y="4" width="4" height="16" fill="url(#pauseGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#pauseGlow)" />
    <rect x="14" y="4" width="4" height="16" fill="url(#pauseGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#pauseGlow)" />
  </svg>
);

export const StopIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="stopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="stopHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="stopGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <rect x="6" y="6" width="12" height="12" fill="url(#stopGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#stopGlow)" />
  </svg>
);

// ===== MUSIC ICONS =====

export const MusicNoteIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="musicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="musicHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="musicGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M9 18V5l12-2v13" fill="none" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#musicGlow)" />
    <circle cx="6" cy="18" r="3" fill="url(#musicGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#musicGlow)" />
    <circle cx="18" cy="16" r="3" fill="url(#musicGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#musicGlow)" />
  </svg>
);

// ===== NAVIGATION ICONS =====

export const HomeIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="homeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="homeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="url(#homeGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#homeGlow)" />
    <polyline points="9,22 9,12 15,12 15,22" fill="none" stroke="#cccccc" strokeWidth="1" filter="url(#homeGlow)" />
  </svg>
);

export const DashboardIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="dashboardHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="dashboardGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <rect x="3" y="3" width="7" height="7" fill="url(#dashboardGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#dashboardGlow)" />
    <rect x="14" y="3" width="7" height="7" fill="url(#dashboardGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#dashboardGlow)" />
    <rect x="3" y="14" width="7" height="7" fill="url(#dashboardGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#dashboardGlow)" />
    <rect x="14" y="14" width="7" height="7" fill="url(#dashboardGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#dashboardGlow)" />
  </svg>
);

export const ProfileIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="profileHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="profileGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="12" cy="8" r="4" fill="url(#profileGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#profileGlow)" />
    <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" fill="url(#profileGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#profileGlow)" />
  </svg>
);

export const StreakIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b35" />
        <stop offset="30%" stopColor="#ff8c42" />
        <stop offset="70%" stopColor="#ff6b35" />
        <stop offset="100%" stopColor="#ff4500" />
      </linearGradient>
      <linearGradient id="streakHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8c42" />
        <stop offset="50%" stopColor="#ffa500" />
        <stop offset="100%" stopColor="#ff8c42" />
      </linearGradient>
      <filter id="streakGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12V4.5a2.5 2.5 0 0 0-5 0V12a2.5 2.5 0 0 0 2.5 2.5z" fill="url(#streakGradient)" stroke="url(#streakHighlight)" strokeWidth="0.5" filter="url(#streakGlow)" />
    <path d="M15.5 14.5A2.5 2.5 0 0 0 18 12V4.5a2.5 2.5 0 0 0-5 0V12a2.5 2.5 0 0 0 2.5 2.5z" fill="url(#streakGradient)" stroke="url(#streakHighlight)" strokeWidth="0.5" filter="url(#streakGlow)" />
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="url(#streakGradient)" stroke="url(#streakHighlight)" strokeWidth="0.5" filter="url(#streakGlow)" />
  </svg>
);

// ===== STATUS ICONS =====

export const LoadingIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <filter id="loadingGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="12" cy="12" r="10" fill="none" stroke="url(#loadingGradient)" strokeWidth="2" strokeLinecap="round" filter="url(#loadingGlow)">
      <animate attributeName="stroke-dasharray" values="0 62.83;31.42 31.42;0 62.83" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="stroke-dashoffset" values="0;-31.42;-62.83" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const CheckIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <filter id="checkGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <path d="M20 6L9 17l-5-5" fill="none" stroke="url(#checkGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#checkGlow)" />
  </svg>
);

export const ErrorIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <filter id="errorGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="12" cy="12" r="10" fill="url(#errorGradient)" stroke="url(#errorGradient)" strokeWidth="0.5" filter="url(#errorGlow)" />
    <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ===== SEARCH ICON =====

export const SearchIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="searchHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="searchGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="11" cy="11" r="8" fill="none" stroke="#cccccc" strokeWidth="2" filter="url(#searchGlow)" />
    <path d="M21 21l-4.35-4.35" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#searchGlow)" />
  </svg>
);

// ===== CLOCK/DURATION ICON =====

export const ClockIcon = ({ className = "w-5 h-5", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="30%" stopColor="#6a6a6a" />
        <stop offset="70%" stopColor="#8a8a8a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <linearGradient id="clockHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8a8a8a" />
        <stop offset="50%" stopColor="#aaaaaa" />
        <stop offset="100%" stopColor="#8a8a8a" />
      </linearGradient>
      <filter id="clockGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="12" cy="12" r="10" fill="url(#clockGradient)" stroke="#cccccc" strokeWidth="0.5" filter="url(#clockGlow)" />
    <path d="M12 6v6l4 2" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#clockGlow)" />
  </svg>
);
