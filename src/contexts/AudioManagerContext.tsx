import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface AudioManagerContextType {
  currentlyPlaying: string | null;
  playAudio: (id: string, audioRef: React.RefObject<HTMLAudioElement>) => void;
  pauseAllExcept: (exceptId: string) => void;
  pauseAll: () => void;
  isAmbientPlayer: (id: string) => boolean;
}

const AudioManagerContext = createContext<AudioManagerContextType | undefined>(undefined);

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error('useAudioManager must be used within an AudioManagerProvider');
  }
  return context;
};

interface AudioManagerProviderProps {
  children: React.ReactNode;
}

export const AudioManagerProvider: React.FC<AudioManagerProviderProps> = ({ children }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, React.RefObject<HTMLAudioElement>>>(new Map());

  const isAmbientPlayer = useCallback((id: string) => {
    return id.startsWith('ambient-');
  }, []);

  const playAudio = useCallback((id: string, audioRef: React.RefObject<HTMLAudioElement>) => {
    // Store the audio ref
    audioRefs.current.set(id, audioRef);

    // If this is the ambient player, it can play alongside others
    if (isAmbientPlayer(id)) {
      setCurrentlyPlaying(id);
      return;
    }

    // For non-ambient players, pause all others first
    pauseAllExcept(id);
    setCurrentlyPlaying(id);
  }, [isAmbientPlayer]);

  const pauseAllExcept = useCallback((exceptId: string) => {
    audioRefs.current.forEach((audioRef, id) => {
      if (id !== exceptId && audioRef.current) {
        audioRef.current.pause();
      }
    });
  }, []);

  const pauseAll = useCallback(() => {
    audioRefs.current.forEach((audioRef) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    });
    setCurrentlyPlaying(null);
  }, []);

  const value: AudioManagerContextType = {
    currentlyPlaying,
    playAudio,
    pauseAllExcept,
    pauseAll,
    isAmbientPlayer,
  };

  return (
    <AudioManagerContext.Provider value={value}>
      {children}
    </AudioManagerContext.Provider>
  );
};
