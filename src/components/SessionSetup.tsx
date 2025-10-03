import { useState, useEffect } from 'react';
import { useCreateSessionOnly, useUpdateStreak } from '../api/hooks';
import Card from './Card';
import Button from './Button';
import PremiumVoiceNotes from './PremiumVoiceNotes';
import { getTimeOptions, getCustomRange, formatDuration } from '../config/sessionConfig';

type Props = { 
  onSessionCreated: (data: { 
    sessionId: string;
    status: string;
  }) => void;
  userId: string;
};

// Helper function to hydrate from localStorage
const hydrate = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper function to save to localStorage
const persist = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
};

// Mood options
const MOOD_OPTIONS = ['calm', 'anxious', 'stressed', 'sleepy', 'grateful', 'sad', 'happy', 'angry', 'usual only', 'dont know'] as const;
type MoodOption = typeof MOOD_OPTIONS[number] | 'custom';


// Tab types
type TabType = 'meditation' | 'sleep_story';

export default function SessionSetup({ onSessionCreated, userId }: Props) {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>(() => hydrate('ms.tab', 'meditation'));
  
  // State with localStorage hydration
  const [mood, setMood] = useState<MoodOption>(() => hydrate('ms.mood', 'calm'));
  const [customMood, setCustomMood] = useState(() => hydrate('ms.customMood', ''));
  const [duration, setDuration] = useState(() => hydrate('ms.duration', 5));
  const [customDuration, setCustomDuration] = useState(() => hydrate('ms.customDuration', 10));
  const [notes, setNotes] = useState(() => hydrate('ms.notes', ''));
  
  // UI state
  const [isCustomMood, setIsCustomMood] = useState(mood === 'custom');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  const createSession = useCreateSessionOnly();
  const updateStreak = useUpdateStreak();

  // Persist state changes to localStorage
  useEffect(() => {
    persist('ms.tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    persist('ms.mood', mood);
  }, [mood]);

  useEffect(() => {
    persist('ms.customMood', customMood);
  }, [customMood]);

  useEffect(() => {
    persist('ms.duration', duration);
  }, [duration]);

  useEffect(() => {
    persist('ms.customDuration', customDuration);
  }, [customDuration]);


  useEffect(() => {
    persist('ms.notes', notes);
  }, [notes]);


  // Get duration options based on active tab
  const getDurationOptions = () => {
    return getTimeOptions(activeTab);
  };

  // Get custom duration range based on active tab
  const getCustomDurationRange = () => {
    return getCustomRange(activeTab);
  };

  // Handle mood selection
  const handleMoodSelect = (selectedMood: MoodOption) => {
    setMood(selectedMood);
    setIsCustomMood(selectedMood === 'custom');
    if (selectedMood !== 'custom') {
      setCustomMood('');
    }
  };

  // Handle duration selection
  const handleDurationSelect = (selectedDuration: number | 'custom') => {
    if (selectedDuration === 'custom') {
      setIsCustomDuration(true);
      setDuration(customDuration);
    } else {
      setIsCustomDuration(false);
      setDuration(selectedDuration);
    }
  };

  // Handle custom duration slider change
  const handleCustomDurationChange = (value: number) => {
    setCustomDuration(value);
    setDuration(value);
  };

  // Submit session
  const submit = async () => {
    if (createSession.isPending) return;
    
    try {
      setProgressText('Creating session…');
      
      const finalMood = isCustomMood ? customMood : mood;
      const finalDuration = isCustomDuration ? customDuration : duration;
      
      // Create session without audio (immediate response)
      const { session_id, status, generation_status } = await createSession.mutateAsync({ 
        kind: activeTab as 'meditation' | 'sleep_story',
        mood: finalMood, 
        duration: finalDuration,
        user_notes: notes.trim() || undefined,
        // Removed user_name: user?.name due to type error (user has no 'name' property)
      });
      
      console.log('🎵 SessionSetup: Session created:', { session_id, status, generation_status });
      
      // Session data will be passed to onSessionCreated for navigation
      const session = { sessionId: session_id, status, generation_status };
      console.log('🎵 SessionSetup: Session data prepared for navigation:', session);
      
      // Update streak (non-blocking)
      try {
        // Backend will use authenticated user from JWT token
        await updateStreak.mutateAsync({ userId: '' }); // Backend auth middleware will use req.user.id
      } catch (streakError) {
        console.warn('Streak update failed:', streakError);
      }
      
      // Call onSessionCreated immediately (session page will handle generation)
      onSessionCreated(session);
      
      // Clear notes after successful session
      setNotes('');
      persist('ms.notes', '');
      
      setProgressText('');
      
    } catch (error) {
      console.error('Session creation failed:', error);
      
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('quota') || errorMessage.includes('503')) {
        setProgressText('Session creation quota exceeded. Please try again later.');
      } else if (errorMessage.includes('timeout')) {
        setProgressText('Request timed out. Please try again.');
      } else {
        setProgressText('Session creation failed. Please try again.');
      }
    }
  };

  // Retry function
  const retry = () => {
    submit();
  };

  // Get current mood value for display
  const currentMoodValue = isCustomMood ? customMood : mood;

  return (
    <div className="grid-gap">
      <Card>
        <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Start a session</div>
        
        {/* Tab Selection */}
        <div className="mt-4 flex bg-white/5 rounded-lg p-1" role="tablist" aria-label="Session type">
          <button
            onClick={() => setActiveTab('meditation')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'meditation'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-400/30'
                : 'text-white/70 hover:text-white'
            }`}
            role="tab"
            aria-selected={activeTab === 'meditation'}
            aria-controls="meditation-panel"
            disabled={createSession.isPending}
          >
            Meditation
          </button>
          <button
            onClick={() => setActiveTab('sleep_story')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'sleep_story'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-400/30'
                : 'text-white/70 hover:text-white'
            }`}
            role="tab"
            aria-selected={activeTab === 'sleep_story'}
            aria-controls="sleep-story-panel"
            disabled={createSession.isPending}
          >
            Sleep Story
          </button>
        </div>
        
        {/* Mood Selection */}
        <div className="subtle mt-2 text-indigo-300">Try to pinpoint your mood?</div>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Current mood">
          {MOOD_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => handleMoodSelect(option)}
              className={`px-3 py-1.5 rounded-xl border border-white/20 text-xs transition-all ${
                mood === option 
                  ? 'opacity-100 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border-indigo-400/50' 
                  : 'opacity-70 hover:opacity-90'
              }`}
              aria-pressed={mood === option}
              disabled={createSession.isPending}
            >
              {option}
            </button>
          ))}
          {/* <button
            onClick={() => handleMoodSelect('custom')}
            className={`px-3 py-1.5 rounded-xl border border-white/20 text-xs transition-all ${
              mood === 'custom' 
                ? 'opacity-100 bg-white/20' 
                : 'opacity-70 hover:opacity-90'
            }`}
            aria-pressed={mood === 'custom'}
            disabled={createSession.isPending}
          >
            Custom
          </button> */}
        </div>
        
        {/* Custom Mood Input */}
        {isCustomMood && (
          <input
            className="mt-2 bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10 w-full text-xs"
            value={customMood}
            onChange={e => setCustomMood(e.target.value)}
            placeholder="Enter your mood..."
            aria-label="Custom mood"
            disabled={createSession.isPending}
          />
        )}

        {/* Duration Selection */}
        <div className="subtle mt-3 text-indigo-300">Select duration</div>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Session duration">
          {getDurationOptions().map(option => (
            <button
              key={option.value}
              onClick={() => handleDurationSelect(option.value)}
              className={`px-3 py-1.5 rounded-xl border border-white/20 text-xs transition-all ${
                !isCustomDuration && duration === option.value
                  ? 'opacity-100 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border-indigo-400/50'
                  : 'opacity-70 hover:opacity-90'
              }`}
              aria-pressed={!isCustomDuration && duration === option.value}
              disabled={createSession.isPending}
            >
              {option.label}
            </button>
          ))}
          {/* <button
            onClick={() => handleDurationSelect('custom')}
            className={`px-3 py-1.5 rounded-xl border border-white/20 text-xs transition-all ${
              isCustomDuration
                ? 'opacity-100 bg-white/20'
                : 'opacity-70 hover:opacity-90'
            }`}
            aria-pressed={isCustomDuration}
            disabled={createSession.isPending}
          >
            Custom
          </button> */}
        </div>
        
        {/* Custom Duration Slider */}
        {isCustomDuration && (
          <div className="mt-2">
            <input
              type="range"
              min={getCustomDurationRange().min}
              max={getCustomDurationRange().max}
              step={getCustomDurationRange().step}
              value={customDuration}
              onChange={e => handleCustomDurationChange(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Custom duration in minutes"
              disabled={createSession.isPending}
            />
            <div className="text-xs text-indigo-300 mt-1 text-center">
              Selected: {formatDuration(customDuration)}
            </div>
          </div>
        )}


        {/* Premium Voice Notes */}
        <div className="mt-4">
          <div className="subtle mb-2 text-indigo-300">What's on your mind? How do you feel?</div>
          <PremiumVoiceNotes
            value={notes}
            onChange={setNotes}
            disabled={createSession.isPending}
            placeholder=""
            onRecordingStateChange={setIsRecording}
            userId={userId}
          />
        </div>

        {/* Generate & Play Button */}
        <div className="mt-6">
          <Button
            label={createSession.isPending ? (progressText || 'Generating…') : 'Generate & Play'}
            onClick={submit}
            disabled={createSession.isPending || !currentMoodValue.trim() || isRecording}
            isLoading={createSession.isPending}
            variant="white"
            size="md"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
          />
        </div>
      </Card>

      {/* Session Player - Removed, navigation happens instead */}

      {/* Error State with Retry */}
      {createSession.isError && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="subtle">Something went wrong. Check keys & network.</div>
            <Button
              label="Retry"
              onClick={retry}
              className="ml-2 text-xs px-3 py-1"
            />
          </div>
        </Card>
      )}
    </div>
  );
}