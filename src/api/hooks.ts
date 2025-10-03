import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getData } from './client';
import type { STTReq, STTRes, SessionReq, SessionRes } from './types';
import type { StartSessionReq, StartSessionRes, TTSReq, TTSRes, JournalReq, JournalRes, StreaksRes, MusicTracksRes, JournalListRes, NudgeReq, NudgeRes, VoiceSTTRes, CoachChatReq, CoachChatRes } from './types';

/** Session: generate meditation script */
export function useStartSession() {
  return useMutation<StartSessionRes, Error, StartSessionReq>({
    mutationFn: (body) => getData(api.post('/session/start', body))
  });
}

/** Session: create meditation or sleep story (legacy) */
export function useCreateSession() {
  return useMutation<SessionRes, Error, SessionReq>({
    mutationFn: (body) => {
      const idempotencyKey = `session-${Date.now()}`;
      return getData(api.post('/session/start', body, {
        headers: { 'X-Idempotency-Key': idempotencyKey }
      }));
    }
  });
}

/** Session: create session without audio (new sequential flow) */
export function useCreateSessionOnly() {
  return useMutation<{session_id: string, status: string, generation_status: string}, Error, StartSessionReq>({
    mutationFn: (body) => {
      const idempotencyKey = `session-${Date.now()}`;
      return getData(api.post('/session/create', body, {
        headers: { 'X-Idempotency-Key': idempotencyKey }
      }));
    }
  });
}

/** Session: generate SSML script for session */
export function useGenerateScript() {
  return useMutation<{session_id: string, status: string, script_content: string, session_name?: string}, Error, {sessionId: string}>({
    mutationFn: ({sessionId}) => getData(api.post(`/session/${sessionId}/generate-script`))
  });
}

// SANITIZATION HOOK REMOVED - Using raw AI output directly

/** Session: generate TTS audio for session */
export function useGenerateAudio() {
  return useMutation<{session_id: string, status: string, audio_url: string, duration_sec: number}, Error, {sessionId: string}>({
    mutationFn: ({sessionId}) => getData(api.post(`/session/${sessionId}/generate-audio`))
  });
}

/** TTS: paragraphs -> audio URLs */
export function useTTS() {
  return useMutation<TTSRes, Error, TTSReq>({
    mutationFn: (body) => getData(api.post('/session/tts', body))
  });
}

/** Journal: submit entry -> summary/emotions */
export function useJournalSubmit() {
  return useMutation<JournalRes, Error, JournalReq>({
    mutationFn: (body) => getData(api.post('/journal/submit', body))
  });
}

/** Streaks: read current/best for a user */
export function useStreaks(userId: string | null) {
  return useQuery<StreaksRes, Error>({
    queryKey: ['streaks', userId],
    enabled: !!userId,
    queryFn: () => getData(api.get(`/streaks/`))
  });
}

/** Streaks: update after completion (e.g., after journal submit) */
export function useUpdateStreak() {
  const qc = useQueryClient();
  return useMutation<StreaksRes, Error, { userId: string }>({
    mutationFn: ({ userId }) => getData(api.post(`/streaks/`)),
    onSuccess: (_data, { userId }) => { qc.invalidateQueries({ queryKey: ['streaks', userId] }); }
  });
}

// Mental health quotes
export function useMentalHealthQuote() {
  return useQuery<{ quote: string; timestamp: string }, Error>({
    queryKey: ['mental-health-quote'],
    queryFn: () => getData(api.get('/quotes/mental-health')),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/** Music: get available tracks */
export function useMusicTracks() {
  return useQuery<MusicTracksRes, Error>({
    queryKey: ['music-tracks'],
    queryFn: () => getData(api.get('/music_tracks'))
  });
}

/** Journal: get paginated entries */
export function useJournalList(userId: string | null, options: { limit?: number; offset?: number } = {}) {
  const { limit = 50, offset = 0 } = options;
  return useQuery<JournalListRes, Error>({
    queryKey: ['journal-list', userId, limit, offset],
    enabled: !!userId,
    queryFn: () => getData(api.get(`/journal?limit=${limit}&offset=${offset}`))
  });
}

/** Nudges: generate personalized nudge */
export function useNudgePreview() {
  return useMutation<NudgeRes, Error, NudgeReq>({
    mutationFn: (body) => getData(api.post('/nudges/preview', body))
  });
}

/** Voice: speech-to-text transcription */
export function useVoiceSTT() {
  return useMutation<VoiceSTTRes, Error, FormData>({
    mutationFn: (formData) => getData(api.post('/journal/stt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }))
  });
}

/** Coach: AI chat with context */
export function useCoachChat() {
  return useMutation<CoachChatRes, Error, CoachChatReq>({
    mutationFn: (body) => getData(api.post('/coach/chat', body))
  });
}

/** STT: Voice transcription */
export function useSTT() {
  return useMutation<STTRes, Error, STTReq>({
    mutationFn: async ({ audio, user_id, session_id }) => {
      const formData = new FormData();
      formData.append('audio', audio);
      if (user_id) formData.append('user_id', user_id);
      if (session_id) formData.append('session_id', session_id);
      
      return getData(api.post('/journal/stt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }));
    }
  });
}

/** Profile: Sync Google user data on first load */
export function useSyncMe() {
  return useMutation({
    mutationFn: async (payload: any) => (await api.post('/me/sync', payload)).data
  });
}

/** Profile: Get basic profile data */
export function useBasicProfile() {
  return useQuery({
    queryKey: ['basic_profile'],
    queryFn: async () => (await api.get('/profile/basic')).data
  });
}

/** Profile: Save basic profile data */
export function useSaveBasicProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.put('/profile/basic', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['basic_profile'] })
  });
}

