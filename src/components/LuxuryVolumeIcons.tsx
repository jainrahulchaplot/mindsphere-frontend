import React from 'react';

interface VolumeIconProps {
  className?: string;
  size?: number;
  isMuted?: boolean;
}

// Luxury Dark-Themed Volume Icons
export const VolumeIcon = ({ className = "w-5 h-5", size = 20, isMuted = false }: VolumeIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    {/* Speaker base with luxury gradient */}
    <defs>
      <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="30%" stopColor="#2d2d2d" />
        <stop offset="70%" stopColor="#404040" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="speakerHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="50%" stopColor="#6a6a6a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Speaker cone with luxury styling */}
    <path 
      d="M3 9v6h4l5 5V4L7 9H3z" 
      fill="url(#speakerGradient)"
      stroke="url(#speakerHighlight)"
      strokeWidth="0.5"
      filter="url(#glow)"
    />
    
    {/* Sound waves */}
    {!isMuted && (
      <>
        <path 
          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" 
          fill="url(#speakerGradient)"
          stroke="url(#speakerHighlight)"
          strokeWidth="0.3"
        />
        <path 
          d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" 
          fill="url(#speakerGradient)"
          stroke="url(#speakerHighlight)"
          strokeWidth="0.3"
        />
      </>
    )}
    
    {/* Muted state - diagonal line */}
    {isMuted && (
      <line 
        x1="18" 
        y1="6" 
        x2="6" 
        y2="18" 
        stroke="#ff4444" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#glow)"
      />
    )}
  </svg>
);

export const VolumeMutedIcon = ({ className = "w-5 h-5", size = 20 }: VolumeIconProps) => (
  <VolumeIcon className={className} size={size} isMuted={true} />
);

export const VolumeHighIcon = ({ className = "w-5 h-5", size = 20 }: VolumeIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="volumeHighGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="30%" stopColor="#2d2d2d" />
        <stop offset="70%" stopColor="#404040" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="volumeHighHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="50%" stopColor="#6a6a6a" />
        <stop offset="100%" stopColor="#4a4a4a" />
      </linearGradient>
      <filter id="volumeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Speaker cone */}
    <path 
      d="M3 9v6h4l5 5V4L7 9H3z" 
      fill="url(#volumeHighGradient)"
      stroke="url(#volumeHighHighlight)"
      strokeWidth="0.5"
      filter="url(#volumeGlow)"
    />
    
    {/* Multiple sound waves for high volume */}
    <path 
      d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" 
      fill="url(#volumeHighGradient)"
      stroke="url(#volumeHighHighlight)"
      strokeWidth="0.3"
    />
    <path 
      d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" 
      fill="url(#volumeHighGradient)"
      stroke="url(#volumeHighHighlight)"
      strokeWidth="0.3"
    />
    
    {/* Additional wave for high volume */}
    <path 
      d="M20 4.5c0-1.1-.9-2-2-2s-2 .9-2 2v15c0 1.1.9 2 2 2s2-.9 2-2v-15z" 
      fill="url(#volumeHighGradient)"
      stroke="url(#volumeHighHighlight)"
      strokeWidth="0.3"
    />
  </svg>
);
