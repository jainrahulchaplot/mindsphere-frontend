import React from 'react';
import { 
  StreakIcon as LuxuryStreakIcon, 
  ProfileIcon as LuxuryProfileIcon, 
  HomeIcon as LuxuryHomeIcon, 
  DashboardIcon as LuxuryDashboardIcon,
  MusicNoteIcon as LuxuryMeditationIcon
} from './LuxuryIcons';

interface IconProps {
  className?: string;
  size?: number;
}

// Luxury dark-themed icons with consistent styling
export const StreakIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryStreakIcon 
    size={size || 20} 
    className={className}
  />
);

export const ProfileIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryProfileIcon 
    size={size || 20} 
    className={className}
  />
);

export const HomeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryHomeIcon 
    size={size || 20} 
    className={className}
  />
);

export const DashboardIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryDashboardIcon 
    size={size || 20} 
    className={className}
  />
);

export const MeditationIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <LuxuryMeditationIcon 
    size={size || 20} 
    className={className}
  />
);

export const AIBuddyIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    width={size || 20} 
    height={size || 20} 
    className={className}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
    />
  </svg>
);
