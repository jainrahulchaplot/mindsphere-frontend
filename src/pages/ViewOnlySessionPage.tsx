import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import SessionPlayer from '../components/SessionPlayer';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';
import SoothingAnimation from '../components/SoothingAnimation';
import { useGenerateScript, useGenerateAudio } from '../api/hooks';

interface SessionData {
  id: string;
  audio_url?: string;
  duration_sec?: number;
  kind: string;
  mood: string;
  duration: number;
  user_notes?: string;
  post_rating?: number;
  post_feedback?: string;
  completed_at?: string;
  script?: string;
  session_name?: string;
}

export default function ViewOnlySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<string>('Initializing...');
  const [sessionName, setSessionName] = useState<string>('');
  const hasStartedGenerationRef = useRef<boolean>(false);
  const processedSessionsRef = useRef<Set<string>>(new Set());
  
  // API hooks for sequential generation
  const generateScript = useGenerateScript();
  const generateAudio = useGenerateAudio();

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const fetchSessionData = async () => {
    console.log('📡 Fetching session data for:', sessionId);
    try {
      setLoading(true);
      const { api } = await import('../api/client');
      const response = await api.get(`/session/${sessionId}`);
      
      const data = response.data;
      setSessionData(data);
      
      // Check if we need to generate content
      if (!data.script && !processedSessionsRef.current.has(sessionId!)) {
        // No script yet, generate it
        processedSessionsRef.current.add(sessionId!);
        hasStartedGenerationRef.current = true;
        await startSequentialGeneration();
      } else if (!data.audio_url && data.script && !processedSessionsRef.current.has(sessionId!)) {
        // Script exists but no audio, generate audio
        processedSessionsRef.current.add(sessionId!);
        hasStartedGenerationRef.current = true;
        await generateAudioForSession();
      } else {
        // Everything is ready
        setGenerationStatus('Ready to play');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const startSequentialGeneration = async () => {
    if (isGenerating) {
      console.log('🚫 Generation already in progress, skipping...');
      return;
    }
    
    console.log('🚀 Starting sequential generation for session:', sessionId);
    try {
      setIsGenerating(true);
      setGenerationStatus('Generating session name...');
      
      // Generate script (which now includes session name generation)
      const scriptResult = await generateScript.mutateAsync({ sessionId: sessionId! });
      console.log('Script generated:', scriptResult);
      
      // Update session data with script and session name
      setSessionData(prev => prev ? { 
        ...prev, 
        script: scriptResult.script_content,
        session_name: scriptResult.session_name || `${prev.kind.replace('_', ' ')} Session`
      } : null);
      
      // Set session name for display during loading
      if (scriptResult.session_name) {
        setSessionName(scriptResult.session_name);
      }
      
      // Move directly to audio generation (sanitization bypassed)
      
      // Move to audio generation
      setGenerationStatus('Generating audio...');
      
      // Generate audio
      const audioResult = await generateAudio.mutateAsync({ sessionId: sessionId! });
      console.log('Audio generated:', audioResult);
      
      // Update session data with audio
      setSessionData(prev => prev ? { 
        ...prev, 
        audio_url: audioResult.audio_url, 
        duration_sec: audioResult.duration_sec
      } : null);
      
      setGenerationStatus('Ready to play');
      
    } catch (err) {
      console.error('Error in sequential generation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudioForSession = async () => {
    if (isGenerating) {
      console.log('🚫 Audio generation already in progress, skipping...');
      return;
    }
    
    console.log('🎵 Starting audio generation for session:', sessionId);
    try {
      setIsGenerating(true);
      setGenerationStatus('Generating audio...');
      
      const audioResult = await generateAudio.mutateAsync({ sessionId: sessionId! });
      console.log('Audio generated:', audioResult);
      
      // Update session data with audio
      setSessionData(prev => prev ? { 
        ...prev, 
        audio_url: audioResult.audio_url, 
        duration_sec: audioResult.duration_sec
      } : null);
      
      setGenerationStatus('Ready to play');
      
    } catch (err) {
      console.error('Error generating audio:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Show content immediately, handle loading states inline

  return (
    <div className="min-h-screen">
      <div className="container-narrow grid-gap fadePop">
        {/* Header */}
        <Card>
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToHome}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              ← Back
            </button>
            <div className="text-right">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">Error loading session</div>
              ) : isGenerating ? (
                <div className="text-center">
                  <div className="text-sm text-gray-300 mb-2">{generationStatus}</div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              ) : sessionData ? (
                <>
                  <div className="text-xl font-semibold text-white capitalize">{sessionData.kind.replace('_', ' ')}</div>
                  <div className="text-gray-400">{sessionData.session_name || `${sessionData.kind.replace('_', ' ')} Session`}</div>
                </>
              ) : isGenerating && sessionName ? (
                <>
                  <div className="text-xl font-semibold text-white capitalize">meditation</div>
                  <div className="text-gray-400">{sessionName}</div>
                </>
              ) : (
                <div className="text-gray-400">Session not found</div>
              )}
            </div>
          </div>
        </Card>

        {/* Session Info */}
        <Card>
          <div className="space-y-4">
            {/* Top row - 3 columns */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-400">Session</div>
                {loading ? (
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-16"></div>
                ) : sessionData ? (
                  <div className="text-white">#{sessionData.id}</div>
                ) : (
                  <div className="text-gray-500">-</div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-400">Duration</div>
                {loading ? (
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-16"></div>
                ) : sessionData ? (
                  <div className="text-white">{sessionData.duration} min</div>
                ) : (
                  <div className="text-gray-500">-</div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-400">Mood</div>
                {loading ? (
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-20"></div>
                ) : sessionData ? (
                  <div className="text-white capitalize">{sessionData.mood}</div>
                ) : (
                  <div className="text-gray-500">-</div>
                )}
              </div>
            </div>
            
            {/* Bottom row - Notes (full width) */}
            {sessionData?.user_notes && (
              <div className="w-full">
                <div className="font-medium text-gray-400 mb-2">Notes</div>
                <div className="text-white text-sm bg-gray-800/50 rounded-lg p-3">{sessionData.user_notes}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Audio Player */}
        {loading || isGenerating ? (
          <Card className="overflow-hidden p-0">
            <PremiumLoadingAnimation 
              status={generationStatus}
              kind={sessionData?.kind as 'meditation' | 'sleep_story' || 'meditation'}
            />
          </Card>
        ) : sessionData && sessionData.audio_url ? (
          <>
            {/* Soothing Animation above Audio Player */}
            <Card className="overflow-hidden p-0">
              <SoothingAnimation 
                kind={sessionData?.kind as 'meditation' | 'sleep_story' || 'meditation'}
              />
            </Card>
            
            {/* Audio Player */}
            <SessionPlayer 
              sessionId={sessionId!}
              audioUrl={sessionData.audio_url}
              durationSec={sessionData.duration_sec || 0}
              onEnded={() => {}} // No modal for view-only mode
              sessionType={sessionData.kind}
              mood={sessionData.mood}
              sessionName={sessionData.session_name}
            />
          </>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-400">
              Audio not available
            </div>
          </Card>
        )}

        {/* View Only Notice */}
        <Card>
          <div className="text-center text-gray-400 text-sm">
            <div className="mb-2">📖 View Only Mode</div>
            <div>This session is read-only. No editing or generation controls available.</div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card>
            <div className="text-center text-red-500">
              <div className="mb-2">Error: {error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
