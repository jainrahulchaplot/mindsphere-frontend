# Database Schema Documentation

## 🗄️ Overview

MindSphere uses Supabase (PostgreSQL) as its primary database with pgvector extensions for similarity search and vector embeddings. The database is designed to support meditation sessions, user management, AI-powered personalization, and comprehensive analytics.

## 📊 Database Statistics

- **Total Tables**: 11 main tables
- **Total Records**: 326 sessions, 4 users, 18 memories, 17 snippets
- **Database Size**: ~10MB total data
- **Vector Embeddings**: 2 tables with pgvector support
- **Row Level Security**: Enabled on sessions table

## 🏗️ Core Tables

### 1. `app_users` - User Management
**Purpose**: Primary user authentication and profile data

```sql
CREATE TABLE app_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'google',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Key Features**:
- UUID primary keys for security
- Email uniqueness constraint
- Google OAuth provider support
- Automatic timestamp management

### 2. `basic_profiles` - User Profiles
**Purpose**: Extended user profile information

```sql
CREATE TABLE basic_profiles (
  user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  given_name TEXT,
  family_name TEXT,
  locale TEXT,
  timezone TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Key Features**:
- Foreign key relationship to app_users
- Cascade delete for data consistency
- Locale and timezone support for internationalization

### 3. `sessions` - Meditation Sessions
**Purpose**: Core meditation and sleep story session data

```sql
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind = ANY (ARRAY['meditation'::text, 'sleep_story'::text])),
  mood TEXT,
  duration INTEGER,
  duration_sec INTEGER,
  words INTEGER,
  prompt TEXT,
  script TEXT,
  user_notes TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  selected_duration INTEGER,
  selected_type TEXT CHECK (selected_type = ANY (ARRAY['meditation'::text, 'sleep_story'::text])),
  additional_notes TEXT,
  post_rating INTEGER CHECK (post_rating >= 1 AND post_rating <= 3),
  post_feedback TEXT,
  feedback_embedding VECTOR(1536),
  completed_at TIMESTAMPTZ,
  session_name TEXT,
  audio_manifest JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Row Level Security (RLS) enabled
- Vector embeddings for feedback analysis
- JSONB for flexible audio manifest storage
- Comprehensive session tracking and analytics
- Check constraints for data validation

### 4. `user_memories` - Long-term Memory
**Purpose**: User's long-term memories for AI personalization

```sql
CREATE TABLE user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  importance INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  embedding VECTOR(1536)
);
```

**Key Features**:
- Vector embeddings for semantic search
- Category-based organization
- Importance scoring system
- Automatic UUID generation

### 5. `user_snippets` - Recent Thoughts
**Purpose**: User's recent thoughts and insights

```sql
CREATE TABLE user_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  embedding VECTOR(1536)
);
```

**Key Features**:
- Character limit constraint (500 chars)
- Vector embeddings for similarity search
- Timestamp tracking for recency

### 6. `user_preferences` - User Settings
**Purpose**: User customization and preference data

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  preferred_voice_style TEXT DEFAULT 'calm',
  preferred_content_themes TEXT[] DEFAULT '{}',
  personal_goals TEXT[] DEFAULT '{}',
  meditation_goals TEXT[] DEFAULT '{}',
  sleep_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Array fields for multiple preferences
- Unique constraint on user_id
- Default values for new users

### 7. `notes` - User Notes
**Purpose**: General user notes with vector search

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding VECTOR(1536),
  mood TEXT,
  emotions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Vector embeddings for semantic search
- Emotion tracking with arrays
- Kind-based categorization

### 8. `journals` - Journal Entries
**Purpose**: User journal entries with AI analysis

```sql
CREATE TABLE journals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  session_id BIGINT,
  text TEXT,
  summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- JSONB for flexible summary storage
- Optional session linkage
- AI-generated summaries

### 9. `streaks` - Habit Tracking
**Purpose**: User engagement and streak tracking

```sql
CREATE TABLE streaks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_completed DATE,
  last_entry_date DATE
);
```

**Key Features**:
- Date-based streak calculation
- Current and best streak tracking
- Last activity timestamps

### 10. `music_tracks` - Audio Content
**Purpose**: Available meditation and ambient music tracks

```sql
CREATE TABLE music_tracks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Sort order for playlist management
- URL-based audio storage
- Simple track metadata

### 11. `profiles` - Legacy Profiles
**Purpose**: Legacy user profile data (deprecated)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Legacy table for backward compatibility
- Minimal profile data
- Superseded by app_users and basic_profiles

## 🔍 Vector Search & Embeddings

### pgvector Configuration
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector indexes for performance
CREATE INDEX ON user_memories USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON user_snippets USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON notes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON sessions USING ivfflat (feedback_embedding vector_cosine_ops);
```

### Vector Search Examples
```sql
-- Find similar memories
SELECT content, category, importance
FROM user_memories
WHERE user_id = 'user-id'
ORDER BY embedding <-> '[0.1, 0.2, ...]'::vector
LIMIT 5;

-- Find similar notes
SELECT text, kind, mood
FROM notes
WHERE user_id = 'user-id'
ORDER BY embedding <-> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

## 🔐 Security & Access Control

### Row Level Security (RLS)
```sql
-- Enable RLS on sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for user data access
CREATE POLICY "Users can access their own sessions" ON sessions
  FOR ALL USING (user_id = current_setting('app.current_user_id'));
```

### Authentication Integration
- **Supabase Auth**: Integrated with Supabase authentication
- **JWT Tokens**: User identification through JWT claims
- **API Security**: Backend validates user access to data
- **Demo Mode**: Fallback authentication for development

## 📊 Analytics & Reporting

### Key Metrics Queries
```sql
-- User engagement metrics
SELECT 
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_sessions,
  AVG(duration_sec) as avg_session_duration,
  AVG(post_rating) as avg_rating
FROM sessions
WHERE created_at > NOW() - INTERVAL '30 days';

-- Session type breakdown
SELECT 
  kind,
  COUNT(*) as session_count,
  AVG(duration_sec) as avg_duration
FROM sessions
GROUP BY kind;

-- User streak analysis
SELECT 
  current_streak,
  COUNT(*) as user_count
FROM streaks
GROUP BY current_streak
ORDER BY current_streak DESC;
```

### Performance Monitoring
```sql
-- Table sizes and row counts
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🚀 Migration & Maintenance

### Database Migrations
- **Location**: `supabase/migrations/`
- **Format**: SQL migration files with timestamps
- **Version Control**: Git-tracked migration history
- **Rollback Support**: Downward migration scripts

### Backup Strategy
- **Automated Backups**: Daily automated backups via Supabase
- **Point-in-Time Recovery**: 7-day retention period
- **Manual Backups**: On-demand backup creation
- **Data Export**: JSON/CSV export capabilities

### Performance Optimization
- **Indexing Strategy**: Optimized indexes for common queries
- **Query Optimization**: Regular query performance analysis
- **Connection Pooling**: Supabase connection pool management
- **Caching**: Application-level caching for frequently accessed data

## 🔮 Future Enhancements

### Planned Schema Changes
- **Advanced Analytics**: Additional metrics and reporting tables
- **Social Features**: User connections and sharing capabilities
- **Content Management**: Enhanced content categorization and tagging
- **AI Training Data**: Tables for machine learning model training

### Scalability Considerations
- **Partitioning**: Table partitioning for large datasets
- **Read Replicas**: Read-only replicas for analytics queries
- **Archival Strategy**: Data archival for historical data
- **Performance Monitoring**: Advanced performance tracking and alerting

---

*Last updated: October 2024*
*Database Version: PostgreSQL 17.6.1.005*
*Supabase Project: MindsphereMe (ylrrlzwphuktzocwjjin)*
