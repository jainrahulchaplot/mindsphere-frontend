import React, { useEffect, useRef, useState } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  isUser: boolean;
  className?: string;
}

export default function VoiceVisualizer({ isActive, isUser, className = '' }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isActive) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 20;
      const waveCount = 3;
      
      // Create animated waves
      for (let i = 0; i < waveCount; i++) {
        const radius = baseRadius + (i * 15) + Math.sin(time + i) * 5;
        const alpha = isActive ? (1 - i * 0.3) * (0.3 + audioLevel * 0.7) : 0;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isUser 
          ? `rgba(59, 130, 246, ${alpha})` // Blue for user
          : `rgba(16, 185, 129, ${alpha})`; // Green for agent
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Add pulsing center dot
      const pulseRadius = baseRadius + Math.sin(time * 2) * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = isUser 
        ? `rgba(59, 130, 246, ${0.8 + audioLevel * 0.2})`
        : `rgba(16, 185, 129, ${0.8 + audioLevel * 0.2})`;
      ctx.fill();

      time += 0.1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, isUser, audioLevel]);

  // Simulate audio level changes
  useEffect(() => {
    if (!isActive) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 0.8 + 0.2);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`voice-visualizer ${className}`}>
      <canvas
        ref={canvasRef}
        width={120}
        height={120}
        className="w-20 h-20"
      />
    </div>
  );
}
