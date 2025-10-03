import { useState } from 'react';
import VoiceInterface from '../pages/VoiceInterface';
import { useAuth } from '../contexts/AuthContext';

interface VoiceAgentProps {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  className?: string;
}

export default function VoiceAgent({ onSessionStart, onSessionEnd, className = '' }: VoiceAgentProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionData, setConnectionData] = useState<any>(null);
  const { user } = useAuth();

  const startSession = async () => {
    try {
      setIsConnecting(true);
      
      // Get token from backend API (local dev or production)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 
        (import.meta.env.DEV ? 'http://localhost:8000' : 'https://mindsphere-production-fc81.up.railway.app');
      const response = await fetch(`${backendUrl}/api/voice/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: `meditation_room_${user?.id || '550e8400-e29b-41d4-a716-446655440000'}`,
          participantName: 'MindSphere User'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get connection token');
      }
      
      const connectionData = await response.json();
      
      // Store connection data and start voice session inline
      setConnectionData(connectionData);
      setSessionStarted(true);
      onSessionStart?.();
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to start voice session. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    console.log('Ending voice session...');
    
    // Reset local state
    setSessionStarted(false);
    setConnectionData(null);
    
    // Call session end callback
    onSessionEnd?.();
    
    console.log('Voice session ended successfully');
  };

  return (
    <div className={`voice-agent-container ${className}`}>
      {!sessionStarted ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Voice Meditation Assistant
          </h3>
          <p className="text-gray-400 mb-6">
            Start a voice conversation with your AI meditation guide
          </p>
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isConnecting ? 'Connecting...' : 'Start Voice Session'}
          </button>
          <p className="text-gray-500 text-sm">
            Connect to your AI meditation guide
          </p>
        </div>
      ) : connectionData ? (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Voice Session Active</span>
            </div>
            <p className="text-gray-300 text-sm text-center">
              Connected to meditation room: {connectionData.roomName}
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <VoiceInterface 
              token={connectionData.token}
              serverUrl={connectionData.serverUrl}
              roomName={connectionData.roomName}
            />
          </div>
          
          <button
            onClick={endSession}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            End Session
          </button>
        </div>
      ) : null}
    </div>
  );
}
