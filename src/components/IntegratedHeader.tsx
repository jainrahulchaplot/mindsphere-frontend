import { useState, useEffect, useRef } from 'react';
import { useStreaks } from '../api/hooks';
import { StreakIcon } from './Icons';
import { useMusicTracks } from '../api/hooks';
import { useAudio } from '../contexts/AudioContext';
import { VolumeIcon, VolumeMutedIcon, VolumeHighIcon, PlayIcon, PauseIcon, MusicNoteIcon } from './LuxuryIcons';

type Props = { userId: string };

export default function IntegratedHeader({ userId }: Props) {
  const { data: streak, isLoading } = useStreaks(userId);
  const { data: musicData, isLoading: musicLoading, error: musicError } = useMusicTracks();
  const { globalVolume, setGlobalVolume } = useAudio();
  
  const currentStreak = streak?.current_streak ?? 0;
  const tracks = musicData?.tracks || [];
  
  // Ambient music state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [ambientIsPlaying, setAmbientIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Initialize ambient audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = globalVolume;
      audioRef.current.loop = false;
    }
  }, []);

  // Handle ambient track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.url;
  }, [currentTrack]);

  // Handle ambient play/pause state - completely independent
  useEffect(() => {
    if (!audioRef.current) return;

    if (ambientIsPlaying) {
      audioRef.current.play().catch((error) => {
        console.warn("Ambient play failed:", error);
        setAmbientIsPlaying(false);
        // Don't show hint - just fail silently for continuous loop
      });
    } else {
      audioRef.current.pause();
    }
  }, [ambientIsPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume;
    }
  }, [globalVolume]);

  // Handle track end - completely independent
  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      // Auto-play next track if currently playing
      if (ambientIsPlaying && tracks.length > 0) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch((error) => {
              console.warn("Auto-play next track failed:", error);
            });
          }
        }, 100);
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrackIndex, tracks.length, ambientIsPlaying]);

  const handleAmbientPlayPause = () => {
    if (tracks.length === 0) return;
    
    if (ambientIsPlaying) {
      // Pause ambient player
      setAmbientIsPlaying(false);
    } else {
      // Play ambient player
      setAmbientIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (tracks.length === 0) return;
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    // Auto-play if currently playing
    if (ambientIsPlaying && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.warn("Previous track play failed:", error);
          });
        }
      }, 100);
    }
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    // Auto-play if currently playing
    if (ambientIsPlaying && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.warn("Next track play failed:", error);
          });
        }
      }, 100);
    }
  };

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-r from-slate-900/40 via-purple-900/20 to-slate-900/40 border-b border-white/10 shadow-2xl">
      {/* Logo and Profile Row */}
      <div className="container-narrow flex items-center justify-between py-4">
        {/* Logo Section */}
        <a 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
        >
          <div className="relative">
            <img 
              src="/assets/mindsphere logo.png" 
              alt="MindSphere" 
              className="h-8 w-auto select-none max-h-8 transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </a>
        
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <div className="text-xs text-white/60 font-medium">—</div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl px-4 py-2 backdrop-blur-sm hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 group">
              <div className="relative">
                <StreakIcon className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-sm text-white font-semibold tracking-wide">
                {currentStreak}
              </div>
              <div className="text-xs text-orange-300/70 font-medium">
                day{currentStreak !== 1 ? 's' : ''}
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Ambient Music Bar */}
      <div className="border-t border-white/10">
        <div className="container-narrow px-4 py-3 relative z-10">
          {musicLoading ? (
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <div className="text-sm text-white/70 font-medium">
                  Loading ambient music...
                </div>
              </div>
            </div>
          ) : musicError ? (
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="text-red-400 text-lg">⚠️</div>
                <div className="text-sm text-red-300 font-medium">
                  Error loading music
                </div>
              </div>
            </div>
          ) : tracks.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="text-sm text-white/50 font-medium">
                <MusicNoteIcon className="w-4 h-4" /> No ambient tracks available
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {/* Left: Music info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                    <div className="text-indigo-300 text-lg font-bold">♪</div>
                  </div>
                  {ambientIsPlaying && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white font-medium truncate">
                    {currentTrack ? currentTrack.title : 'No track'}
                  </div>
                  <div className="text-xs text-white/60">
                    {tracks.length > 0 ? `${currentTrackIndex + 1} of ${tracks.length}` : ''}
                  </div>
                </div>
              </div>

              {/* Center: Controls */}
              <div className="flex items-center gap-2 px-2">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  disabled={tracks.length <= 1}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="text-lg">⏮</div>
                </button>
                
                <button
                  onClick={handleAmbientPlayPause}
                  className="w-12 h-12 flex items-center justify-center text-white hover:text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 active:scale-95 backdrop-blur-sm border border-white/20 hover:border-white/30"
                  style={{ pointerEvents: 'auto' }}
                >
                  {ambientIsPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  disabled={tracks.length <= 1}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="text-lg">⏭</div>
                </button>
              </div>

              {/* Right: Volume control */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  style={{ pointerEvents: 'auto' }}
                >
                  {globalVolume === 0 ? (
                    <VolumeMutedIcon className="w-5 h-5" />
                  ) : globalVolume > 0.7 ? (
                    <VolumeHighIcon className="w-5 h-5" />
                  ) : (
                    <VolumeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Volume Slider */}
          {showVolumeSlider && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="text-xs text-white/60 font-medium">Volume</div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={globalVolume}
                  onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                  style={{ 
                    pointerEvents: 'auto',
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${globalVolume * 100}%, rgba(255,255,255,0.1) ${globalVolume * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="text-xs text-white/60 font-medium w-8 text-right">
                  {Math.round(globalVolume * 100)}%
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
