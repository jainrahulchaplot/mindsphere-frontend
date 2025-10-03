// Session Configuration
// Modify these values to change the default time options for both meditation and sleep story

export const SESSION_CONFIG = {
  // Default time options for both meditation and sleep story
  // Format: { value: number, label: string }
  defaultTimeOptions: [
    { value: 0.5, label: '30s' },  // 30 seconds
    { value: 1, label: '1m' },     // 1 minute
    { value: 2, label: '2m' },     // 2 minutes
  ],

  // Custom time ranges for each session type
  meditation: {
    // Time options for meditation (in minutes)
    timeOptions: [
      // { value: 0.5, label: '30s' },
      { value: 1, label: '1m' },
      // { value: 2, label: '2m' },
      // { value: 3, label: '3m' },
      { value: 5, label: '5m' },
      { value: 10, label: '10m' },
      { value: 15, label: '15m' },
    ],
    // Custom slider range (in minutes)
    customRange: {
      min: 0.5,  // 30 seconds
      max: 20,   // 20 minutes
      step: 0.5, // 30 second steps
    }
  },

  sleepStory: {
    // Time options for sleep story (in minutes)
    timeOptions: [
      { value: 1, label: '1m' },
      // { value: 2, label: '2m' },
      // { value: 3, label: '3m' },
      { value: 5, label: '5m' },
      { value: 10, label: '10m' },
      { value: 15, label: '15m' },
      { value: 25, label: '25m' },
    ],
    // Custom slider range (in minutes)
    customRange: {
      min: 0.5,  // 30 seconds
      max: 60,   // 60 minutes
      step: 0.5, // 30 second steps
    }
  }
} as const;

// Helper function to get time options for a specific session type
export function getTimeOptions(sessionType: 'meditation' | 'sleep_story') {
  // Map 'sleep_story' to 'sleepStory' to match SESSION_CONFIG key
  const key = sessionType === 'sleep_story' ? 'sleepStory' : sessionType;
  return SESSION_CONFIG[key].timeOptions;
}

// Helper function to get custom range for a specific session type
export function getCustomRange(sessionType: 'meditation' | 'sleep_story') {
  // Map 'sleep_story' to 'sleepStory' to match SESSION_CONFIG key
  const key = sessionType === 'sleep_story' ? 'sleepStory' : sessionType;
  return SESSION_CONFIG[key].customRange;
}

// Helper function to format duration for display
export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return `${Math.round(minutes * 60)}s`;
  } else if (minutes === Math.floor(minutes)) {
    return `${Math.floor(minutes)}m`;
  } else {
    return `${minutes}m`;
  }
}

// Helper function to parse duration from string
export function parseDuration(duration: string): number {
  if (duration.endsWith('s')) {
    return parseInt(duration) / 60; // Convert seconds to minutes
  } else if (duration.endsWith('m')) {
    return parseFloat(duration);
  }
  return parseFloat(duration);
}
