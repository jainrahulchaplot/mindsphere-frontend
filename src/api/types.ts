export type StartSessionReq = { 
  kind?: 'meditation' | 'sleep_story';
  mood: string; 
  duration: number; 
  user_notes?: string; 
  user_name?: string;
};
export type StartSessionRes = { 
  session_id: string; 
  script: string; 
  paragraphs: string[]; 
  tracks: Array<{id: string, url: string, order: number, duration_sec: number}>;
  errors?: Array<{trackIndex: number, error: string}>;
  partial_success?: boolean;
};

export type TTSReq = { paragraphs: string[] };
export type TTSRes = { session_id: string; audio_urls: string[] };

export type JournalReq = { text: string; session_id?: string | null; user_id?: string | null };
export type JournalRes = { summary: string; emotions: string[]; stored?: boolean; note?: string };

export type StreaksRes = { current_streak: number; best_streak: number; note?: string };

export type MusicTrack = { id: string; title: string; url: string; sort_order: number };
export type MusicTracksRes = { tracks: MusicTrack[]; note?: string };

export type JournalEntry = { id: string; created_at: string; summary: string; emotions: string[] };
export type JournalListRes = { entries: JournalEntry[]; note?: string };

export type NudgeReq = { user_id: string; lookback_days?: number };
export type NudgeRes = { nudge: string };

export type VoiceSTTReq = { audio: File; user_id?: string; session_id?: string; duration_sec?: number };
export type VoiceSTTRes = { text: string; duration_sec: number; user_id: string | null; session_id: string | null };

// STT types
export type STTReq = { audio: File; user_id?: string; session_id?: string };
export type STTRes = { text: string; duration_sec: number };

// Session types
export type SessionReq = { 
  kind?: 'meditation' | 'sleep_story';
  mood: string; 
  duration: number; 
  user_notes?: string; 
  user_id?: string 
};
export type SessionRes = { 
  session_id: string; 
  audio_url: string; 
  duration_sec: number 
};

export type CoachChatReq = { user_id: string; message: string; lookback_days?: number };
export type CoachChatRes = { reply: string };
