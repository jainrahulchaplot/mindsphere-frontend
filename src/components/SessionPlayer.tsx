import React from "react";
import { useLocation } from 'react-router-dom';
import Card from './Card';
import { useAudio } from '../contexts/AudioContext';
import { useAudioManager } from '../contexts/AudioManagerContext';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { VolumeIcon, VolumeMutedIcon, VolumeHighIcon, PlayIcon, PauseIcon, StopIcon } from './LuxuryIcons';

type Props = {
  sessionId: string;
  audioUrl: string;
  durationSec: number;
  onEnded?: () => void;
  sessionType?: string;
  mood?: string;
  sessionName?: string;
};

export default function SessionPlayer({
  sessionId,
  audioUrl,
  durationSec,
  onEnded,
  sessionType = 'meditation',
  mood = 'calm',
  sessionName
}: Props) {
  const location = useLocation();
  const { playAudio, isPlaying } = useAudio();
  const { playAudio: playAudioGlobal, pauseAllExcept } = useAudioManager();
  const { globalVolume, setGlobalVolume } = useAudio();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  const sessionPlayerId = `session-player-${sessionId}`;

  const [ready, setReady] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [volume, setVolume] = React.useState(globalVolume);

  // Handle page visibility - pause audio when page becomes hidden
  usePageVisibility({
    onHidden: () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlaying(false);
      }
    },
    onVisible: () => {
      // Don't auto-resume when page becomes visible
      // User needs to manually play again
    }
  });

  // Handle route changes - pause audio when navigating away from session page
  React.useEffect(() => {
    const handleRouteChange = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };

    // Clean up audio when component unmounts or route changes
    return () => {
      handleRouteChange();
    };
  }, [location.pathname]);
  const [playbackRate, setPlaybackRate] = React.useState(1);

  const [seeking, setSeeking] = React.useState(false);
  const [seekVal, setSeekVal] = React.useState(0);

  // 1) Create <audio> once and wire events
  React.useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.volume = volume;
    a.playbackRate = playbackRate;

    const onLoaded = () => {
      console.log('🎵 SessionPlayer: Audio loaded, duration:', a.duration);
      setDuration(Number.isFinite(a.duration) ? a.duration : 0);
      setReady(true);
      // Auto-play attempt (may be blocked by browser)
      a.play().catch((err) => {
        console.log('🎵 SessionPlayer: Autoplay blocked:', err);
      });
    };
    const onTime = () => { if (!seeking) setCurrent(a.currentTime); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => { setPlaying(false); onEnded?.(); };
    const onErr = (e: any) => {
      console.error('🎵 SessionPlayer: Audio error:', e);
      setReady(false);
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, [onEnded, seeking, volume, playbackRate]);

  // 2) Only reset when URL actually changes
  React.useEffect(() => {
    const a = audioRef.current!;
    console.log('🎵 SessionPlayer: Setting audio URL:', audioUrl);
    console.log('🎵 SessionPlayer: Duration:', durationSec);
    setReady(false);
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    a.src = audioUrl;
    a.load();
  }, [audioUrl, durationSec]);

  // Sync with global audio state
  React.useEffect(() => {
    if (isPlaying('session')) {
      setPlaying(true);
    } else if (isPlaying('ambient')) {
      setPlaying(false);
    }
  }, [isPlaying]);

  // Cleanup: Stop audio when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // 3) Controls with audio hygiene
  const toggle = () => {
    const a = audioRef.current!;
    if (a.paused) {
      // Pause all other audio except ambient
      pauseAllExcept(sessionPlayerId);
      
      // Play this audio
      playAudio(a, 'session');
      playAudioGlobal(sessionPlayerId, audioRef);
    } else {
      // Pause this audio
      a.pause();
      setPlaying(false);
    }
  };

  // 4) Seek (mouse + touch)
  const beginSeek = () => { setSeeking(true); setSeekVal(current); };
  const changeSeek: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setSeekVal(parseFloat(e.target.value));
  const endSeek = () => {
    const a = audioRef.current!;
    a.currentTime = seekVal;
    setCurrent(seekVal);
    setSeeking(false);
  };

  // 5) New control functions
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setGlobalVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const skipBackward = () => {
    const a = audioRef.current!;
    a.currentTime = Math.max(0, a.currentTime - 15);
    setCurrent(a.currentTime);
  };

  const skipForward = () => {
    const a = audioRef.current!;
    a.currentTime = Math.min(duration, a.currentTime + 15);
    setCurrent(a.currentTime);
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (current / duration) * 100 : 0;
  };

  return (
    <Card className="overflow-hidden session-player">
      {/* Header with session info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg">
            {sessionType === 'sleep_story' ? '🌙' : '🧘'}
          </div>
          <div>
            <div className="text-lg font-semibold text-white capitalize">
              {sessionName || `${sessionType.replace('_', ' ')} Session`}
            </div>
            <div className="text-sm text-gray-400 capitalize">{mood}</div>
          </div>
        </div>
      </div>

      {/* Progress bar with time display */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={seeking ? seekVal : current}
            onMouseDown={beginSeek}
            onTouchStart={beginSeek}
            onChange={changeSeek}
            onMouseUp={endSeek}
            onTouchEnd={endSeek}
            aria-label="Seek"
            className="w-full h-2 appearance-none bg-gray-700 rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${getProgressPercentage()}%, #374151 ${getProgressPercentage()}%, #374151 100%)`
            }}
          />
          {/* Progress indicator dots */}
          <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  (i / 9) * 100 <= getProgressPercentage() ? 'bg-indigo-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={skipBackward}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
          disabled={!ready}
          aria-label="Skip backward 15s"
        >
          <StopIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={toggle}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center text-white text-2xl transition-all transform hover:scale-105 active:scale-95"
          disabled={!ready}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </button>
        
        <button
          onClick={skipForward}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
          disabled={!ready}
          aria-label="Skip forward 15s"
        >
          <PlayIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Advanced controls */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
          {/* Volume control */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-16">Volume</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="text-gray-500">
                {volume === 0 ? (
                  <VolumeMutedIcon className="w-4 h-4" />
                ) : volume > 0.7 ? (
                  <VolumeHighIcon className="w-4 h-4" />
                ) : (
                  <VolumeIcon className="w-4 h-4" />
                )}
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 appearance-none bg-gray-700 rounded-full cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                }}
              />
              <div className="text-gray-500">
                {volume === 0 ? (
                  <VolumeMutedIcon className="w-4 h-4" />
                ) : volume > 0.7 ? (
                  <VolumeHighIcon className="w-4 h-4" />
                ) : (
                  <VolumeIcon className="w-4 h-4" />
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Playback speed control */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-16">Speed</span>
            <div className="flex gap-1">
              {[0.7, 0.85, 1, 1.15 ,1.3].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    playbackRate === rate
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Status indicator */}
      <div className="mt-4 text-center">
        {!ready && (
          <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            Loading audio...
          </div>
        )}
        {ready && !playing && (
          <div className="text-sm text-gray-400">Ready to play</div>
        )}
        {playing && (
          <div className="text-sm text-indigo-400 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            Now playing
          </div>
        )}
      </div>

      {/* Custom slider styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .session-player input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #6366f1;
            cursor: pointer;
            border: 2px solid #1f2937;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .session-player input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #6366f1;
            cursor: pointer;
            border: 2px solid #1f2937;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `
      }} />

    </Card>
  );
}
