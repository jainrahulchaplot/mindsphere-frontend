// API Response Validators
// These ensure API responses match expected types at runtime

export interface ValidationError {
  field: string;
  message: string;
  received: any;
}

export class ValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super(`Validation failed: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
    this.name = 'ValidationError';
  }
}

// Basic type guards
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !isArray(value);
}

// Track validator
export function validateTrack(track: any): { id: string; url: string; order: number; duration_sec: number } {
  if (!isObject(track)) {
    throw new ValidationError([{ field: 'track', message: 'Must be an object', received: track }]);
  }

  const errors: ValidationError[] = [];

  if (!isString(track.id)) {
    errors.push({ field: 'track.id', message: 'Must be a string', received: track.id });
  }

  if (!isString(track.url)) {
    errors.push({ field: 'track.url', message: 'Must be a string', received: track.url });
  }

  if (!isNumber(track.order) || track.order < 0) {
    errors.push({ field: 'track.order', message: 'Must be a non-negative number', received: track.order });
  }

  if (!isNumber(track.duration_sec) || track.duration_sec <= 0) {
    errors.push({ field: 'track.duration_sec', message: 'Must be a positive number', received: track.duration_sec });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return track as { id: string; url: string; order: number; duration_sec: number };
}

// StartSession response validator
export function validateStartSessionResponse(data: any): {
  session_id: string;
  script: string;
  paragraphs: string[];
  tracks: Array<{ id: string; url: string; order: number; duration_sec: number }>;
  errors?: Array<{ trackIndex: number; error: string }>;
  partial_success?: boolean;
} {
  if (!isObject(data)) {
    throw new ValidationError([{ field: 'response', message: 'Must be an object', received: data }]);
  }

  const errors: ValidationError[] = [];

  if (!isString(data.session_id)) {
    errors.push({ field: 'session_id', message: 'Must be a string', received: data.session_id });
  }

  if (!isString(data.script)) {
    errors.push({ field: 'script', message: 'Must be a string', received: data.script });
  }

  if (!isArray(data.paragraphs)) {
    errors.push({ field: 'paragraphs', message: 'Must be an array', received: data.paragraphs });
  } else {
    data.paragraphs.forEach((p: any, i: number) => {
      if (!isString(p)) {
        errors.push({ field: `paragraphs[${i}]`, message: 'Must be a string', received: p });
      }
    });
  }

  if (!isArray(data.tracks)) {
    errors.push({ field: 'tracks', message: 'Must be an array', received: data.tracks });
  } else {
    data.tracks.forEach((track: any, i: number) => {
      try {
        validateTrack(track);
      } catch (e) {
        if (e instanceof ValidationError) {
          errors.push(...e.errors.map(err => ({ ...err, field: `tracks[${i}].${err.field}` })));
        }
      }
    });
  }

  // Optional fields
  if (data.errors !== undefined) {
    if (!isArray(data.errors)) {
      errors.push({ field: 'errors', message: 'Must be an array', received: data.errors });
    } else {
      data.errors.forEach((error: any, i: number) => {
        if (!isObject(error) || !isNumber(error.trackIndex) || !isString(error.error)) {
          errors.push({ field: `errors[${i}]`, message: 'Must have trackIndex (number) and error (string)', received: error });
        }
      });
    }
  }

  if (data.partial_success !== undefined && typeof data.partial_success !== 'boolean') {
    errors.push({ field: 'partial_success', message: 'Must be a boolean', received: data.partial_success });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data as any;
}

// Journal response validator
export function validateJournalResponse(data: any): {
  summary: string;
  emotions: string[];
  stored?: boolean;
  note?: string;
} {
  if (!isObject(data)) {
    throw new ValidationError([{ field: 'response', message: 'Must be an object', received: data }]);
  }

  const errors: ValidationError[] = [];

  if (!isString(data.summary)) {
    errors.push({ field: 'summary', message: 'Must be a string', received: data.summary });
  }

  if (!isArray(data.emotions)) {
    errors.push({ field: 'emotions', message: 'Must be an array', received: data.emotions });
  } else {
    data.emotions.forEach((emotion: any, i: number) => {
      if (!isString(emotion)) {
        errors.push({ field: `emotions[${i}]`, message: 'Must be a string', received: emotion });
      }
    });
  }

  if (data.stored !== undefined && typeof data.stored !== 'boolean') {
    errors.push({ field: 'stored', message: 'Must be a boolean', received: data.stored });
  }

  if (data.note !== undefined && !isString(data.note)) {
    errors.push({ field: 'note', message: 'Must be a string', received: data.note });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data as any;
}

// Streaks response validator
export function validateStreaksResponse(data: any): {
  current_streak: number;
  best_streak: number;
  note?: string;
} {
  if (!isObject(data)) {
    throw new ValidationError([{ field: 'response', message: 'Must be an object', received: data }]);
  }

  const errors: ValidationError[] = [];

  if (!isNumber(data.current_streak) || data.current_streak < 0) {
    errors.push({ field: 'current_streak', message: 'Must be a non-negative number', received: data.current_streak });
  }

  if (!isNumber(data.best_streak) || data.best_streak < 0) {
    errors.push({ field: 'best_streak', message: 'Must be a non-negative number', received: data.best_streak });
  }

  if (data.note !== undefined && !isString(data.note)) {
    errors.push({ field: 'note', message: 'Must be a string', received: data.note });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data as any;
}

// Music tracks response validator
export function validateMusicTracksResponse(data: any): {
  tracks: Array<{ id: string; title: string; url: string; sort_order: number }>;
  note?: string;
} {
  if (!isObject(data)) {
    throw new ValidationError([{ field: 'response', message: 'Must be an object', received: data }]);
  }

  const errors: ValidationError[] = [];

  if (!isArray(data.tracks)) {
    errors.push({ field: 'tracks', message: 'Must be an array', received: data.tracks });
  } else {
    data.tracks.forEach((track: any, i: number) => {
      if (!isObject(track)) {
        errors.push({ field: `tracks[${i}]`, message: 'Must be an object', received: track });
        return;
      }

      if (!isString(track.id) && !isNumber(track.id)) {
        errors.push({ field: `tracks[${i}].id`, message: 'Must be a string or number', received: track.id });
      }

      if (!isString(track.title)) {
        errors.push({ field: `tracks[${i}].title`, message: 'Must be a string', received: track.title });
      }

      if (!isString(track.url)) {
        errors.push({ field: `tracks[${i}].url`, message: 'Must be a string', received: track.url });
      }

      if (!isNumber(track.sort_order) || track.sort_order < 0) {
        errors.push({ field: `tracks[${i}].sort_order`, message: 'Must be a non-negative number', received: track.sort_order });
      }
    });
  }

  if (data.note !== undefined && !isString(data.note)) {
    errors.push({ field: 'note', message: 'Must be a string', received: data.note });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  // Convert id to string if it's a number
  const tracks = data.tracks.map((track: any) => ({
    ...track,
    id: String(track.id)
  }));

  return { ...data, tracks } as { tracks: Array<{ id: string; title: string; url: string; sort_order: number }>; note?: string };
}

// STT response validator
export function validateSTTResponse(data: any): {
  text: string;
  duration_sec: number;
  user_id: string | null;
  session_id: string | null;
} {
  if (!isObject(data)) {
    throw new ValidationError([{ field: 'response', message: 'Must be an object', received: data }]);
  }

  const errors: ValidationError[] = [];

  if (!isString(data.text)) {
    errors.push({ field: 'text', message: 'Must be a string', received: data.text });
  }

  if (!isNumber(data.duration_sec) || data.duration_sec < 0) {
    errors.push({ field: 'duration_sec', message: 'Must be a non-negative number', received: data.duration_sec });
  }

  if (data.user_id !== null && !isString(data.user_id)) {
    errors.push({ field: 'user_id', message: 'Must be a string or null', received: data.user_id });
  }

  if (data.session_id !== null && !isString(data.session_id)) {
    errors.push({ field: 'session_id', message: 'Must be a string or null', received: data.session_id });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data as any;
}
