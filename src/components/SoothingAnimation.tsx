import { useState, useEffect } from 'react';

interface SoothingAnimationProps {
  kind?: 'meditation' | 'sleep_story';
}

export default function SoothingAnimation({ kind = 'meditation' }: SoothingAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const [breathPhase, setBreathPhase] = useState(0);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2, // 2-6px
        delay: Math.random() * 4,
        duration: Math.random() * 8 + 6 // 6-14 seconds
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  // Breathing animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBreathScale = () => {
    switch (breathPhase) {
      case 0: return 'scale-100'; // Inhale
      case 1: return 'scale-110'; // Hold
      case 2: return 'scale-120'; // Peak
      case 3: return 'scale-110'; // Exhale
      default: return 'scale-100';
    }
  };

  const getBreathOpacity = () => {
    switch (breathPhase) {
      case 0: return 'opacity-60'; // Inhale
      case 1: return 'opacity-80'; // Hold
      case 2: return 'opacity-100'; // Peak
      case 3: return 'opacity-80'; // Exhale
      default: return 'opacity-60';
    }
  };

  const getThemeColors = () => {
    // Use blue and purplish colors for both meditation and sleep story
    return {
      primary: 'from-indigo-400/30 to-purple-500/30',
      secondary: 'from-purple-400/20 to-blue-500/20',
      accent: 'from-blue-400/10 to-cyan-500/10',
      particles: 'bg-indigo-300/40',
      glow: 'shadow-indigo-500/20',
      sun: 'text-yellow-300/60',
      moon: 'text-blue-200/70',
      stars: 'text-white/50'
    };
  };

  const colors = getThemeColors();

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height: '200px' }}>
      {/* Animated Background Layers */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} rounded-xl`}>
        <div className={`absolute inset-0 bg-gradient-to-tr ${colors.secondary} rounded-xl`} />
        <div className={`absolute inset-0 bg-gradient-to-bl ${colors.accent} rounded-xl`} />
      </div>

      {/* Sun/Moon and Stars */}
      <div className="absolute top-4 right-4 text-2xl animate-gentle-bounce">
        {kind === 'sleep_story' ? '🌙' : '☀️'}
      </div>
      
      {/* Stars scattered around */}
      <div className="absolute top-8 left-6 text-sm animate-twinkle" style={{ animationDelay: '0s' }}>⭐</div>
      <div className="absolute top-12 right-8 text-xs animate-twinkle" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-20 left-8 text-xs animate-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
      <div className="absolute top-16 right-12 text-sm animate-twinkle" style={{ animationDelay: '0.5s' }}>✨</div>

      {/* Top Section - Animated Icon */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className={`relative transition-all duration-3000 ease-in-out ${getBreathScale()}`}>
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r ${colors.primary} ${getBreathOpacity()} transition-all duration-3000 ease-in-out`} 
               style={{ 
                 boxShadow: `0 0 25px rgba(59, 130, 246, 0.4)`,
                 animation: 'pulse 4s ease-in-out infinite'
               }} />
          
          {/* Inner Breathing Circle */}
          <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${colors.secondary} ${getBreathOpacity()} transition-all duration-3000 ease-in-out`} 
               style={{ 
                 boxShadow: `0 0 20px rgba(16, 185, 129, 0.3)`,
                 animation: 'breathe 6s ease-in-out infinite'
               }} />
          
          {/* Floating orbs around icon */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400/40 rounded-full animate-float-orb" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400/40 rounded-full animate-float-orb" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-float-orb" 
               style={{ animationDelay: '2s' }} />
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-90 animate-gentle-bounce">
            {kind === 'sleep_story' ? '🌙' : '🧘'}
          </div>
        </div>
      </div>

      {/* Middle Section - Text Content */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-lg font-light text-white/80 mb-2 animate-fade-in">
            {kind === 'sleep_story' ? 'Drift into peaceful dreams...' : 'Breathe deeply and relax...'}
          </div>
          <div className="text-sm text-white/60 animate-fade-in-slow">
            {kind === 'sleep_story' ? 'Let the story guide you to sleep' : 'Find your inner calm'}
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${colors.particles} rounded-full ${colors.glow}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float-gentle ${particle.duration}s ease-in-out infinite ${particle.delay}s`
          }}
        />
      ))}

      {/* Gentle Wave Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-full h-full bg-gradient-to-r ${colors.primary} opacity-30`}
            style={{
              animation: `wave-gentle ${8 + i * 2}s ease-in-out infinite ${i * 1.5}s`,
              transform: `translateY(${i * 8}px)`
            }}
          />
        ))}
      </div>


      {/* CSS for custom animations */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-15px) translateX(5px) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-25px) translateX(-3px) scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-10px) translateX(8px) scale(1.05);
            opacity: 0.5;
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes wave-gentle {
          0%, 100% {
            transform: translateX(-100%) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(0%) scaleY(1.2);
            opacity: 0.6;
          }
        }

        @keyframes float-orb {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-8px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes fade-in-slow {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-float-orb {
          animation: float-orb 3s ease-in-out infinite;
        }

        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-slow {
          animation: fade-in-slow 2s ease-out;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
