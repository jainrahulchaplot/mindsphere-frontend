# Session Configuration

This directory contains configuration files for the meditation and sleep story sessions.

## sessionConfig.ts

This file controls the time selection options for both meditation and sleep story sessions.

### Default Configuration

The default time options are set to:
- **30 seconds** (30s)
- **1 minute** (1m) 
- **2 minutes** (2m)

### How to Modify

#### 1. Change Default Time Options

To change the default time chips that appear for both session types:

```typescript
export const SESSION_CONFIG = {
  // Change these values to modify default time options
  defaultTimeOptions: [
    { value: 0.5, label: '30s' },  // 30 seconds
    { value: 1, label: '1m' },     // 1 minute
    { value: 2, label: '2m' },     // 2 minutes
  ],
  // ... rest of config
}
```

#### 2. Modify Meditation Time Options

```typescript
meditation: {
  timeOptions: [
    { value: 0.5, label: '30s' },
    { value: 1, label: '1m' },
    { value: 2, label: '2m' },
    { value: 3, label: '3m' },
    { value: 5, label: '5m' },
    { value: 10, label: '10m' },
  ],
  customRange: {
    min: 0.5,  // 30 seconds minimum
    max: 20,   // 20 minutes maximum
    step: 0.5, // 30 second steps
  }
}
```

#### 3. Modify Sleep Story Time Options

```typescript
sleepStory: {
  timeOptions: [
    { value: 0.5, label: '30s' },
    { value: 1, label: '1m' },
    { value: 2, label: '2m' },
    { value: 5, label: '5m' },
    { value: 10, label: '10m' },
    { value: 20, label: '20m' },
  ],
  customRange: {
    min: 0.5,  // 30 seconds minimum
    max: 60,   // 60 minutes maximum
    step: 0.5, // 30 second steps
  }
}
```

### Value Format

- **value**: Duration in minutes (0.5 = 30 seconds, 1 = 1 minute, etc.)
- **label**: Display text for the chip
- **min/max**: Range for custom slider in minutes
- **step**: Increment for custom slider in minutes

### Examples

#### Quick Sessions (30s, 1m, 2m, 5m)
```typescript
timeOptions: [
  { value: 0.5, label: '30s' },
  { value: 1, label: '1m' },
  { value: 2, label: '2m' },
  { value: 5, label: '5m' },
]
```

#### Longer Sessions (5m, 10m, 20m, 30m)
```typescript
timeOptions: [
  { value: 5, label: '5m' },
  { value: 10, label: '10m' },
  { value: 20, label: '20m' },
  { value: 30, label: '30m' },
]
```

#### Custom Range Examples
```typescript
// For quick sessions (30s to 5m)
customRange: { min: 0.5, max: 5, step: 0.5 }

// For longer sessions (1m to 60m)
customRange: { min: 1, max: 60, step: 1 }

// For precise control (15s to 2m in 15s steps)
customRange: { min: 0.25, max: 2, step: 0.25 }
```

### After Making Changes

1. Save the file
2. The changes will automatically apply to the frontend
3. No server restart needed for configuration changes

### Helper Functions

The config file includes helper functions:

- `getTimeOptions(sessionType)` - Get time options for a specific session type
- `getCustomRange(sessionType)` - Get custom range for a specific session type  
- `formatDuration(minutes)` - Format duration for display (e.g., 0.5 → "30s")
- `parseDuration(duration)` - Parse duration string to minutes
