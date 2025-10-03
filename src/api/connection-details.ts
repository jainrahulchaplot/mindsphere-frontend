import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';

// LiveKit configuration - credentials are managed by backend
// Frontend should not have direct access to API keys for security
const LIVEKIT_URL = 'wss://mindsphere-1613vohm.livekit.cloud'; // This can be public

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// DEPRECATED: Use backend API instead for security
// This function is kept for backward compatibility but should not be used
export async function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  throw new Error(
    'Direct token creation is deprecated. Use the backend API endpoint /api/voice/token instead for security.'
  );
}

// DEPRECATED: Use backend API instead for security
// This function is kept for backward compatibility but should not be used
export async function getConnectionDetails(): Promise<ConnectionDetails> {
  throw new Error(
    'Direct connection details creation is deprecated. Use the backend API endpoint /api/voice/token instead for security.'
  );
}
