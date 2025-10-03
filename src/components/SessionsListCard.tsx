import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioManager } from '../contexts/AudioManagerContext';
import { usePageVisibility } from '../hooks/usePageVisibility';
import Card from './Card';
import { MusicNoteIcon, HomeIcon, LoadingIcon, MicrophoneIcon, SearchIcon, ClockIcon } from './LuxuryIcons';

interface SessionItem {
  id: string;
  created_at: string;
  kind: 'meditation' | 'sleep_story';
  mood?: string;
  session_name?: string;
  duration_sec: number;
  audio_url: string;
  user_notes?: string;
  completed_at?: string;
  post_rating?: number;
}

interface SessionsListCardProps {
  userId: string;
}

export default function SessionsListCard({ userId }: SessionsListCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { playAudio, pauseAllExcept } = useAudioManager();
  const [filters, setFilters] = useState({
    kind: 'meditation' as 'meditation' | 'sleep_story',
    mood: 'all' as 'all' | 'calm' | 'anxious' | 'stressed' | 'focused' | 'tired' | 'sad' | 'angry' | 'excited' | 'confused' | 'grateful' | 'peaceful' | 'energetic' | 'relaxed' | 'overwhelmed' | 'hopeful',
    search: '',
  });
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle page visibility - pause all audio when page becomes hidden
  usePageVisibility({
    onHidden: () => {
      // Pause all playing audio when page becomes hidden
      audioRefs.current.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
        }
      });
      setPlayingId(null);
    },
    onVisible: () => {
      // Don't auto-resume when page becomes visible
      // User needs to manually play again
    }
  });

  // Handle route changes - pause audio when navigating away from sessions list
  useEffect(() => {
    const handleRouteChange = () => {
      // Pause all audio when navigating away
      audioRefs.current.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
        }
      });
      setPlayingId(null);
    };

    // Clean up audio when component unmounts or route changes
    return () => {
      handleRouteChange();
    };
  }, [location.pathname]);

  // Fetch sessions data with infinite scroll
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery<{sessions: SessionItem[], stats: any}, Error, {sessions: SessionItem[], stats: any}, string[], number>({
    queryKey: ['sessions', userId, filters.kind, filters.search],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('🔍 SessionsListCard: Fetching sessions for userId:', userId, 'kind:', filters.kind, 'page:', pageParam);
      const params = new URLSearchParams({
        kind: filters.kind,
        page: pageParam.toString(),
        limit: '20',
        ...(filters.search && { q: filters.search }),
      });
      
      const { api } = await import('../api/client');
      const response = await api.get(`/library?${params}`);
      const data = response.data;
      console.log('🔍 SessionsListCard: Received sessions data:', data.sessions?.length, 'sessions for userId:', userId, 'kind:', filters.kind, 'page:', pageParam);
      return data as {sessions: SessionItem[], stats: any};
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: {sessions: SessionItem[], stats: any}, pages: {sessions: SessionItem[], stats: any}[]) => {
      // If last page has less than 20 items, we've reached the end
      if (lastPage.sessions.length < 20) {
        return undefined;
      }
      return pages.length + 1;
    },
    enabled: !!userId,
    staleTime: 0, // Force refetch when data changes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: true, // Always refetch on mount
  });

  // Flatten all pages into a single array
  const sessionsData = useMemo(() => {
    if ((infiniteData as any)?.pages) {
      return (infiniteData as any).pages.map((page: any) => page.sessions).flat();
    }
    return [];
  }, [infiniteData]);

  // Get stats from the first page (stats are the same for all pages)
  const overallStats = useMemo(() => {
    if ((infiniteData as any)?.pages?.[0]?.stats) {
      return (infiniteData as any).pages[0].stats;
    }
    return null;
  }, [infiniteData]);

  // Force refetch when session type or search changes
  useEffect(() => {
    console.log('Session type or search changed to:', filters.kind, filters.search);
    refetch();
  }, [filters.kind, filters.search, refetch]);

  // Intersection Observer for infinite scroll
  const lastSessionElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter and sort sessions - only apply mood filter since API handles kind and search
  const filteredSessions = useMemo(() => {
    if (!sessionsData) return [];
    
    let filtered = [...sessionsData];
    
    // Apply mood filter (API already handles kind and search filtering)
    if (filters.mood !== 'all') {
      filtered = filtered.filter(session => session.mood === filters.mood);
    }
    
    // Sort by date (newest first) - default sorting
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [sessionsData, filters.mood]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toISOString().split('T')[0];
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
    return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'calm': '😌',
      'anxious': '😰',
      'stressed': '😤',
      'focused': '🎯',
      'tired': '😴',
      'sad': '😢',
      'angry': '😠',
      'excited': '🤩',
      'confused': '😕',
      'grateful': '🙏',
      'peaceful': '🕊️',
      'energetic': '⚡',
      'relaxed': '🧘',
      'overwhelmed': '😵',
      'hopeful': '🌟',
    };
    return moodEmojis[mood.toLowerCase()] || '💭';
  };



  const handlePlay = (session: SessionItem) => {
    const sessionId = `session-${session.id}`;
    
    if (playingId === session.id) {
      // Pause current audio
      const audio = audioRefs.current.get(session.id);
      if (audio) {
        audio.pause();
        audioRefs.current.delete(session.id);
      }
      setPlayingId(null);
    } else {
      // Pause all other audio except ambient
      pauseAllExcept(sessionId);
      
      // Play new audio
      const audio = new Audio(session.audio_url);
      audioRefs.current.set(session.id, audio);
      
      // Create a ref for the global audio manager
      const audioRef = { current: audio };
      playAudio(sessionId, audioRef);
      
      setPlayingId(session.id);
      
      // Start playing the audio
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setPlayingId(null);
        audioRefs.current.delete(session.id);
      });
      
      audio.onended = () => {
        setPlayingId(null);
        audioRefs.current.delete(session.id);
      };
    }
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/view-session/${sessionId}`);
  };

  if (error) {
    return (
      <Card>
        <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">All sessions</div>
        <div className="text-red-400 text-sm mt-2">
          Failed to load sessions
          <button 
            onClick={() => refetch()}
            className="ml-2 text-blue-400 hover:text-blue-300 underline"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  // Use overall stats from backend (total across all sessions, not just loaded ones)
  const stats = overallStats;
  
  // Debug logging
  console.log('SessionsListCard Debug:', {
    sessionType: filters.kind,
    loadedSessionsCount: sessionsData?.length || 0,
    overallStats: stats
  });
  
  // Get available moods for current session type (API already filters by kind)
  const getAvailableMoods = () => {
    if (!sessionsData) return [];
    
    // sessionsData is already filtered by kind from the API
    const moodCounts = sessionsData.reduce((acc: Record<string, number>, session: SessionItem) => {
      if (session.mood) {
        acc[session.mood] = (acc[session.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Return moods that have at least 1 session
    return Object.entries(moodCounts)
      .filter(([_, count]) => (count as number) > 0)
      .map(([mood, _]) => mood);
  };
  
  const availableMoods = getAvailableMoods();

  return (
    <Card>
      <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">All sessions</div>
      
      
      {/* Enhanced Filters */}
      <div className="mt-4 space-y-3">
        {/* Tab Selection - Same as SessionSetup */}
        <div className="flex bg-white/5 rounded-lg p-1" role="tablist" aria-label="Session type">
          <button
            onClick={() => setFilters(prev => ({ ...prev, kind: 'meditation', mood: 'all' }))}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              filters.kind === 'meditation'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-400/30'
                : 'text-white/70 hover:text-white'
            }`}
            role="tab"
            aria-selected={filters.kind === 'meditation'}
            aria-controls="meditation-panel"
          >
            Meditation
          </button>
            <button
            onClick={() => setFilters(prev => ({ ...prev, kind: 'sleep_story', mood: 'all' }))}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              filters.kind === 'sleep_story'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-indigo-400/30'
                : 'text-white/70 hover:text-white'
            }`}
            role="tab"
            aria-selected={filters.kind === 'sleep_story'}
            aria-controls="sleep-story-panel"
          >
            Sleep Story
            </button>
        </div>
        
        {/* Session Type Stats - Filtered by selected session type */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 text-xs mt-4 mb-4">
            <div className="text-center">
              <div className="text-silver text-xs">Total Sessions</div>
              <div className="font-medium text-indigo-400 text-sm">{stats?.totalSessions || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-silver text-xs">Total Time</div>
              <div className="font-medium text-purple-400 text-sm">{formatDuration(stats?.totalTime || 0)}</div>
            </div>
            <div className="text-center">
              <div className="text-silver text-xs">Completion Rate</div>
              <div className="font-medium text-green-400 text-sm">{stats?.completionRate || 0}%</div>
            </div>
          </div>
        )}
        
        {/* Mood Filter - Only show moods with sessions */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All Moods'},
            { value: 'calm', label: 'Calm'},
            { value: 'anxious', label: 'Anxious'},
            { value: 'stressed', label: 'Stressed'},
            { value: 'focused', label: 'Focused'},
            { value: 'tired', label: 'Tired'},
            { value: 'sad', label: 'Sad'},
            { value: 'grateful', label: 'Grateful'},
            { value: 'peaceful', label: 'Peaceful'},
            { value: 'energetic', label: 'Energetic'},
          ].filter(option => option.value === 'all' || availableMoods.includes(option.value))
          .map(option => (
            <button
              key={option.value}
              onClick={() => setFilters(prev => ({ ...prev, mood: option.value as any }))}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-2 ${
                filters.mood === option.value
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border-indigo-400/50 text-white'
                  : 'border-white/20 text-silver hover:text-white hover:border-white/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative">
        <input
          type="text"
            placeholder="Search mood, session name, notes..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-2 pl-8 text-xs bg-graphite/50 border border-white/20 rounded-lg text-white placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50"
        />
          <div className="absolute left-2.5 top-2.5 text-silver/60">
            <SearchIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          // Enhanced Skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 bg-graphite/30 rounded-xl animate-pulse border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-40 mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-6 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session, index) => (
            <div
              key={session.id}
              ref={index === filteredSessions.length - 1 ? lastSessionElementRef : null}
              className="group p-4 bg-gradient-to-r from-graphite/30 to-graphite/20 rounded-xl hover:from-graphite/50 hover:to-graphite/40 transition-all duration-300 cursor-pointer border border-white/10 hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10"
              onClick={() => handleSessionClick(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header with date and type */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-silver font-medium">{formatDate(session.created_at)}</span>
                    {/* <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      session.kind === 'meditation' 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30' 
                        : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30'
                    }`}>
                      {session.kind === 'meditation' ? '🧘 Meditation' : '🌙 Sleep Story'}
                    </span> */}
                    {session.completed_at && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  
                  {/* Session name */}
                  {session.session_name && (
                    <div className="text-sm font-medium text-indigo-300 mb-2 line-clamp-1">
                      {session.session_name}
                    </div>
                  )}
                  
                  {/* Session ID, Duration, and Mood in same row */}
                  <div className="flex items-center gap-3 text-xs mb-2">
                    {/* Session ID */}
                    <div className="flex items-center gap-1 text-silver">
                      <span>#</span>
                      <span>{session.id}</span>
                    </div>
                    
                    {/* Duration */}
                    <div className="flex items-center gap-1 text-silver">
                      <ClockIcon className="w-3 h-3" />
                      <span>{formatDuration(session.duration_sec)}</span>
                    </div>
                    
                    {/* Mood */}
                    {session.mood && (
                      <div className="flex items-center gap-1 text-silver">
                        <span className="text-sm">{getMoodEmoji(session.mood)}</span>
                        <span className="capitalize">{session.mood}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* User notes preview */}
                  {session.user_notes && (
                    <div className="mt-2 text-xs text-silver/80 line-clamp-2 italic">
                      "{session.user_notes}"
                  </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(session);
                    }}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      playingId === session.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 hover:from-indigo-500/30 hover:to-purple-600/30 text-indigo-300 hover:text-white border border-indigo-400/30'
                    }`}
                    aria-label={playingId === session.id ? 'Pause' : 'Play'}
                  >
                    {playingId === session.id ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-2 h-3 bg-current rounded-sm"></div>
                        <div className="w-2 h-3 bg-current rounded-sm ml-0.5"></div>
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-l-[8px] border-l-current border-y-[6px] border-y-transparent ml-1"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <HomeIcon className="w-16 h-16 text-silver/60" />
            </div>
            <div className="text-silver text-sm mb-2 font-medium">No sessions found</div>
            <div className="text-silver/60 text-xs mb-4">
              {filters.search || filters.mood !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Create your first session on the Home tab'
              }
            </div>
            {filters.search || filters.mood !== 'all' ? (
              <button
                onClick={() => setFilters(prev => ({ ...prev, mood: 'all', search: '' }))}
                className="text-indigo-400 hover:text-indigo-300 text-xs underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
        
        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-silver text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
              Loading more sessions...
            </div>
          </div>
        )}
        
        {/* End of list indicator */}
        {!hasNextPage && filteredSessions.length > 0 && (
          <div className="text-center py-4 text-silver/60 text-xs">
            You've reached the end of your sessions
          </div>
        )}
      </div>
    </Card>
  );
}
