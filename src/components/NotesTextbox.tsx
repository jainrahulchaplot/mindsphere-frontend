import React, { useState, useRef, useEffect } from 'react';
import { useSTT } from '../api/hooks';
import { MicrophoneIcon, StopIcon } from './LuxuryIcons';

interface NotesTextboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  rows?: number;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  userId: string;
}

type RecordingState = 'idle' | 'recording' | 'processing';

export default function NotesTextbox({
  value,
  onChange,
  placeholder = "Share your thoughts...",
  label = "What's on your mind? How do you feel?",
  maxLength = 500,
  rows = 3,
  onKeyPress,
  disabled = false,
  userId
}: NotesTextboxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const stt = useSTT();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Initialize waveform when recording starts
  useEffect(() => {
    if (recordingState === 'recording' && streamRef.current) {
      initializeWaveform();
    }
  }, [recordingState]);

  // Initialize audio context and analyser for waveform
  const initializeWaveform = () => {
    if (recordingState === 'recording' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(streamRef.current!);
      source.connect(analyser);

      drawWaveform(ctx, analyser);
    }
  };

  // Draw waveform visualization
  const drawWaveform = (ctx: CanvasRenderingContext2D, analyser: AnalyserNode) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (recordingState !== 'recording') return;

      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      const barWidth = (ctx.canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * ctx.canvas.height;
        
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, ctx.canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };

    draw();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processRecording(audioBlob);
      };
      
      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Recording error:', error);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setRecordingState('idle');
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const processRecording = async (audioBlob: Blob) => {
    try {
      setRecordingState('processing');
      
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: audioBlob.type || 'audio/webm' 
      });

      const result = await stt.mutateAsync({
        audio: audioFile,
        user_id: userId
      });

      // Only update if there's actual text content
      if (result.text && result.text.trim()) {
        const newValue = value ? `${value} ${result.text}` : result.text;
        onChange(newValue);
      }
      
      setRecordingState('idle');
      setRecordingTime(0);

    } catch (error) {
      console.error('STT error:', error);
      setRecordingState('idle');
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="subtle text-indigo-300">{label}</div>
      
      <div className="relative group">
        {/* Enhanced Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{ backgroundColor: '#00000030' }}
          className={`
            w-full bg-gray-800 text-white border rounded-xl px-4 py-3 
            placeholder-white/40 focus:outline-none 
            text-sm resize-none transition-all duration-300
            backdrop-blur-sm
            ${isFocused 
              ? 'border-white/40 shadow-lg shadow-white/10' 
              : 'border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/5'
            }
            ${disabled || recordingState === 'processing' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-text'
            }
          `}
          rows={rows}
          disabled={disabled || recordingState === 'processing'}
        />
        
        {/* Premium Voice Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {recordingState === 'idle' && (
            <button
              type="button"
              onClick={startRecording}
              disabled={disabled}
              className="
                w-10 h-10 flex items-center justify-center 
                text-white/80 hover:text-white 
                transition-all duration-300 rounded-xl 
                bg-gradient-to-r from-white/5 to-white/2
                hover:from-white/10 hover:to-white/5
                hover:scale-110 active:scale-95
                backdrop-blur-sm border border-white/20
                group-hover:border-white/30 hover:shadow-lg hover:shadow-white/10
              "
              title="Record voice note"
              aria-label="Start recording voice note"
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          )}
          
          {recordingState === 'recording' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-600/40 rounded-lg backdrop-blur-sm shadow-lg shadow-gray-800/20">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="text-xs text-gray-200 font-semibold">
                  {formatTime(recordingTime)}
                </div>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="
                  w-10 h-10 flex items-center justify-center 
                  text-gray-400 hover:text-gray-300 
                  transition-all duration-300 rounded-xl 
                  bg-gradient-to-r from-gray-800/20 to-gray-700/10
                  hover:from-gray-800/30 hover:to-gray-700/20
                  hover:scale-110 active:scale-95
                  backdrop-blur-sm border border-gray-600/40
                  hover:shadow-lg hover:shadow-gray-800/20
                "
                title="Stop recording"
                aria-label="Stop recording"
              >
                <StopIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={cancelRecording}
                className="
                  w-10 h-10 flex items-center justify-center 
                  text-gray-400 hover:text-gray-300 
                  transition-all duration-300 rounded-xl 
                  bg-gradient-to-r from-gray-800/20 to-gray-700/10
                  hover:from-gray-800/30 hover:to-gray-700/20
                  hover:scale-110 active:scale-95
                  backdrop-blur-sm border border-gray-600/40
                  hover:shadow-lg hover:shadow-gray-800/20
                "
                title="Cancel recording"
                aria-label="Cancel recording"
              >
                <div className="text-lg">✕</div>
              </button>
            </>
          )}
          
          {recordingState === 'processing' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg backdrop-blur-sm">
              <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              <div className="text-xs text-blue-300 font-medium">Processing...</div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Waveform visualization */}
      {recordingState === 'recording' && (
        <div className="h-12 rounded-xl overflow-hidden border border-gray-300" style={{ backgroundColor: '#ffffff' }}>
          <canvas
            ref={canvasRef}
            width={400}
            height={48}
            className="w-full h-full" 
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      )}

      {/* Enhanced Error messages */}
      {error && (
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
          <div className="text-white/80 text-lg">⚠️</div>
          <div className="text-sm text-white/80 flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-white/60 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
