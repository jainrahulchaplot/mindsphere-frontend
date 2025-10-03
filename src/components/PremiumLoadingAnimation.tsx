import { useState, useEffect } from 'react';
import { MusicNoteIcon, HomeIcon } from './LuxuryIcons';

interface PremiumLoadingAnimationProps {
  status: string;
  kind: 'meditation' | 'sleep_story';
}

export default function PremiumLoadingAnimation({ kind }: PremiumLoadingAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Meditation phases - using blue and purplish colors
  const meditationPhases = [
    { text: "Preparing your sacred space...", icon: "🧘", color: "from-indigo-500 to-purple-600" },
    { text: "Crafting personalized guidance...", icon: "✨", color: "from-purple-500 to-blue-600" },
    { text: "Weaving words of wisdom...", icon: "🌙", color: "from-blue-500 to-cyan-600" },
    { text: "Infusing with calming energy...", icon: "🌸", color: "from-cyan-500 to-indigo-600" },
    { text: "Generating serene audio...", icon: <MusicNoteIcon className="w-5 h-5" />, color: "from-indigo-500 to-purple-600" },
    { text: "Almost ready to begin...", icon: "🌟", color: "from-purple-500 to-blue-600" }
  ];

  // Sleep story phases - using blue and purplish colors
  const sleepStoryPhases = [
    { text: "Gathering dreamy elements...", icon: "🌙", color: "from-indigo-500 to-purple-600" },
    { text: "Painting peaceful scenes...", icon: "🎨", color: "from-purple-500 to-blue-600" },
    { text: "Whispering gentle words...", icon: "💫", color: "from-blue-500 to-cyan-600" },
    { text: "Creating cozy atmosphere...", icon: <HomeIcon className="w-5 h-5" />, color: "from-cyan-500 to-indigo-600" },
    { text: "Weaving lullaby melodies...", icon: "🎶", color: "from-indigo-500 to-purple-600" },
    { text: "Ready for sweet dreams...", icon: "✨", color: "from-purple-500 to-blue-600" }
  ];

  const phases = kind === 'meditation' ? meditationPhases : sleepStoryPhases;

  // Cycle through phases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phases.length]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPhaseData = phases[currentPhase];

  return (
    <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Animated Background - Blue and Purplish theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Sun/Moon and Stars */}
      <div className="absolute top-6 right-6 text-3xl animate-gentle-bounce">
        {kind === 'sleep_story' ? '🌙' : '☀️'}
      </div>
      
      {/* Stars scattered around */}
      <div className="absolute top-12 left-8 text-lg animate-twinkle" style={{ animationDelay: '0s' }}>⭐</div>
      <div className="absolute top-16 right-12 text-sm animate-twinkle" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-24 left-12 text-sm animate-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
      <div className="absolute top-20 right-16 text-lg animate-twinkle" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute top-32 left-16 text-sm animate-twinkle" style={{ animationDelay: '1.5s' }}>⭐</div>
      <div className="absolute top-28 right-20 text-sm animate-twinkle" style={{ animationDelay: '2.5s' }}>✨</div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animation: `float-particle 4s ease-in-out infinite ${particle.delay}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent animate-spin" 
                 style={{ animationDuration: '8s' }} />
            
            {/* Inner rotating elements */}
            <div className="absolute inset-2 rounded-full border-2 border-white/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-white/10 to-transparent animate-spin" 
                 style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
              {currentPhaseData.icon}
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-light text-white/90 mb-2">
            {currentPhaseData.text}
          </h3>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentPhaseData.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex justify-center space-x-2">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index <= currentPhase 
                    ? `bg-gradient-to-r ${currentPhaseData.color}` 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-8 bg-white/30 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animation: `breathe 2s ease-in-out infinite ${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Inspirational Quote */}
        <div style={{ maxWidth: '300px'}} className="text-center">
          <p className="text-sm text-white/60 italic leading-relaxed">
            {kind === 'meditation' 
              ? "In the silence between thoughts, we find our true self."
              : "Dreams are the whispers of the soul, heard in the quiet of night."
            }
          </p>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-particle {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-20px) scale(1.2);
              opacity: 0.6;
            }
          }

          @keyframes breathe {
            0%, 100% {
              transform: scaleY(1);
              opacity: 0.3;
            }
            50% {
              transform: scaleY(2);
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

          .animate-gentle-bounce {
            animation: gentle-bounce 2s ease-in-out infinite;
          }

          .animate-twinkle {
            animation: twinkle 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}
