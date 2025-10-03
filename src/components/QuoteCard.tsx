import { useEffect, useState } from 'react';
import Card from './Card';
import { useMentalHealthQuote } from '../api/hooks';

// Removed unused components - using simpler soothing background instead

export default function QuoteCard() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: quoteData, isLoading, error } = useMentalHealthQuote();

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format quote for display (split by newlines)
  const quoteLines = (quoteData as { quote: string })?.quote?.split('\n').filter((line: string) => line.trim()) || [];

  return (
    <Card 
      className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-800/40 backdrop-blur-sm border-white/20"
    >
      {/* Soothing background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gentle gradient waves */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-slate-900/30" />
        
        {/* Subtle floating elements */}
        <div className="absolute top-4 left-6 text-sm animate-twinkle opacity-60">✨</div>
        <div className="absolute top-8 right-8 text-xs animate-twinkle opacity-40" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-12 left-12 text-xs animate-twinkle opacity-50" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-16 right-16 text-sm animate-twinkle opacity-30" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-20 left-8 text-xs animate-twinkle opacity-40" style={{ animationDelay: '1.5s' }}>✨</div>
        
        {/* Gentle moon */}
        <div className="absolute top-6 right-6 text-lg animate-gentle-bounce opacity-30">🌙</div>
      </div>

      {/* Quote content with animations */}
      <div className="relative z-10 px-2 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-white/60 text-sm text-center">Unable to load inspirational quote</div>
        ) : quoteLines.length > 0 ? (
          <div 
            className={`text-sm md:text-sm font-light text-white leading-relaxed transition-all duration-1000 text-center w-full ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {quoteLines.map((line: string, index: number) => (
              <div 
                key={index}
                className="block animate-gentle-float mb-2 w-full" 
                style={{ animationDelay: `${0.5 + index * 0.2}s` }}
              >
                {line.trim()}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/60 text-sm text-center">Loading inspirational quote...</div>
        )}
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-glow pointer-events-none" />
    </Card>
  );
}