import { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingAnimation({ 
  message = "Preparing your session...", 
  subMessage = "This may take a moment" 
}: LoadingAnimationProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Breathing Circle Animation */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-blue-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-2 w-20 h-20 border-4 border-blue-600 rounded-full animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="relative w-32 h-32">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${40 + (i * 10)}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i * 0.3)}s`
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="text-center">
        <div className="text-xl font-medium text-gray-700">
          {message}{dots}
        </div>
        <div className="text-sm text-gray-500">
          {subMessage}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
