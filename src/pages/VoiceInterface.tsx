import React, { useEffect, useState } from 'react';
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client';
import VoiceVisualizer from '../components/VoiceVisualizer';

interface VoiceInterfaceProps {
  token: string;
  serverUrl: string;
  roomName: string;
}

export default function VoiceInterface({ token, serverUrl, roomName }: VoiceInterfaceProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [agentTranscript, setAgentTranscript] = useState<string>('');
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);

  useEffect(() => {
    if (!token || !serverUrl || !roomName) {
      setError('Missing connection parameters');
      return;
    }

    connectToRoom();
    
    // Cleanup function to ensure proper disconnect
    return () => {
      if (room) {
        console.log('Component unmounting, disconnecting from room:', room.name);
        room.disconnect();
      }
    };
  }, [token, serverUrl, roomName]);

  // Additional cleanup effect for room disconnect
  useEffect(() => {
    return () => {
      if (room) {
        console.log('VoiceInterface cleanup: disconnecting from room');
        room.disconnect();
      }
    };
  }, [room]);

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          videoSimulcastLayers: [],
        },
      });

      // Set up event handlers
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnected(true);
        setIsConnecting(false);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsConnected(false);
        setIsUserSpeaking(false);
        setIsAgentSpeaking(false);
        setMicrophoneEnabled(false);
      });

      newRoom.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        setTranscript(prev => prev + message + '\n');
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.play();
          
          // Track speaking state
          if (participant.identity.includes('agent') || participant.identity.includes('assistant')) {
            setIsAgentSpeaking(true);
            setAgentTranscript(prev => prev + `\n[Agent]: Connected and ready to help`);
          } else {
            setIsUserSpeaking(true);
            setUserTranscript(prev => prev + `\n[You]: Connected to voice session`);
          }
        }
      });

      // Handle local track published
      newRoom.on(RoomEvent.LocalTrackPublished, (publication) => {
        console.log('Local track published:', publication.track?.kind);
        if (publication.track?.kind === Track.Kind.Audio) {
          setMicrophoneEnabled(true);
          setUserTranscript(prev => prev + `\n[You]: Microphone active`);
        }
      });

      // Handle local track unpublished
      newRoom.on(RoomEvent.LocalTrackUnpublished, (publication) => {
        console.log('Local track unpublished:', publication.track?.kind);
        if (publication.track?.kind === Track.Kind.Audio) {
          setMicrophoneEnabled(false);
          setUserTranscript(prev => prev + `\n[You]: Microphone inactive`);
        }
      });

      // Track speaking events
      newRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const userSpeaking = speakers.some(speaker => !speaker.identity.includes('agent') && !speaker.identity.includes('assistant'));
        const agentSpeaking = speakers.some(speaker => speaker.identity.includes('agent') || speaker.identity.includes('assistant'));
        
        setIsUserSpeaking(userSpeaking);
        setIsAgentSpeaking(agentSpeaking);
      });

      // Connect to the room
      await newRoom.connect(serverUrl, token);
      
      // Enable microphone and publish audio
      try {
        // Request microphone permission first
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: false 
        });
        console.log('Microphone permission granted');
        
        // Enable microphone in the room
        await newRoom.localParticipant.enableCameraAndMicrophone();
        console.log('Microphone enabled successfully');
        
        // Stop the temporary stream
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Failed to enable microphone:', err);
        setError('Microphone access denied. Please allow microphone permissions and try again.');
        setIsConnecting(false);
        return;
      }
      
      setRoom(newRoom);

    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (room) {
      console.log('Disconnecting from room:', room.name);
      
      try {
        // Call backend API to delete the room on the server
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 
          (import.meta.env.DEV ? 'http://localhost:8000' : 'https://mindsphere-production-fc81.up.railway.app');
        
        const response = await fetch(`${backendUrl}/api/voice/room/${room.name}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('Room deleted on server successfully');
        } else {
          console.warn('Failed to delete room on server, but continuing with client disconnect');
        }
      } catch (error) {
        console.warn('Error calling room delete API:', error);
      }
      
      // Disconnect from the room
      room.disconnect();
      
      // Reset all state
      setRoom(null);
      setIsConnected(false);
      setIsUserSpeaking(false);
      setIsAgentSpeaking(false);
      setMicrophoneEnabled(false);
      setTranscript('');
      setUserTranscript('');
      setAgentTranscript('');
      
      console.log('Room disconnected successfully');
    }
  };

  return (
    <div className="voice-interface">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center mb-4">Voice Session</h3>
        
        {isConnecting && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-400 text-sm">Connecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-4">
            {/* Voice Visualizers */}
            <div className="flex justify-center space-x-8">
              {/* User Visualizer */}
              <div className="text-center">
                <VoiceVisualizer 
                  isActive={isUserSpeaking} 
                  isUser={true}
                  className="mb-2"
                />
                <p className="text-blue-400 text-xs font-medium">You</p>
                {isUserSpeaking && (
                  <p className="text-blue-300 text-xs animate-pulse">Speaking...</p>
                )}
              </div>

              {/* Agent Visualizer */}
              <div className="text-center">
                <VoiceVisualizer 
                  isActive={isAgentSpeaking} 
                  isUser={false}
                  className="mb-2"
                />
                <p className="text-green-400 text-xs font-medium">Agent</p>
                {isAgentSpeaking && (
                  <p className="text-green-300 text-xs animate-pulse">Speaking...</p>
                )}
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium text-sm">Connected</span>
              </div>
              <p className="text-gray-300 text-xs text-center">Speak naturally with your meditation guide</p>
              
              {/* Microphone Status */}
              <div className="mt-2 flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${microphoneEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${microphoneEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {microphoneEnabled ? 'Microphone Active' : 'Microphone Inactive'}
                </span>
              </div>
            </div>

            {/* Transcripts */}
            <div className="space-y-3">
              {/* User Transcript */}
              {userTranscript && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <h4 className="text-blue-400 font-medium text-sm mb-2 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Your Messages
                  </h4>
                  <div className="text-gray-300 text-xs whitespace-pre-wrap max-h-20 overflow-y-auto">
                    {userTranscript}
                  </div>
                </div>
              )}

              {/* Agent Transcript */}
              {agentTranscript && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <h4 className="text-green-400 font-medium text-sm mb-2 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Agent Responses
                  </h4>
                  <div className="text-gray-300 text-xs whitespace-pre-wrap max-h-20 overflow-y-auto">
                    {agentTranscript}
                  </div>
                </div>
              )}

              {/* General Transcript */}
              {transcript && (
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm mb-2">System Messages</h4>
                  <div className="text-gray-300 text-xs whitespace-pre-wrap max-h-20 overflow-y-auto">
                    {transcript}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isConnected && !isConnecting && !error && (
          <button
            onClick={connectToRoom}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
          >
            Connect to Voice Session
          </button>
        )}
        
        {isConnected && (
          <button
            onClick={disconnect}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
