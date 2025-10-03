import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from './Card';

type DailyData = { date: string; sessions: number; minutes: number };
type UsageData = {
  first_use_date: string; // YYYY-MM-DD
  days: DailyData[];      // in requested range
  streaks: { current: number; best: number }; // overall from backend
  analytics: {
    totalSessions: number;
    totalMinutes: number;
    completionRate: number;
    avgSessionDuration: number;
    longestBreak: number;
    kind: string;
  };
};
type HabitTrackerCardProps = { userId: string };

/* ---------- LOCAL date helpers (no UTC ISO!) ---------- */
const toKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const startOfWeekMonday = (d: Date) => {
  const tmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (tmp.getDay() + 6) % 7; // Mon=0
  tmp.setDate(tmp.getDate() - day);
  return tmp;
};

export default function HabitTrackerCard({ userId }: HabitTrackerCardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'meditation' | 'sleep_story'>('meditation');
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const from = toKey(monthStart);
  const to = toKey(monthEnd);
  const todayKey = toKey(new Date());

  /* 1) Fetch MONTH data */
  const monthQ = useQuery<UsageData>({
    queryKey: ['usage-month', userId, from, to, activeTab],
    queryFn: async () => {
      console.log('🔍 HabitTrackerCard: Fetching usage data for userId:', userId, 'from:', from, 'to:', to, 'kind:', activeTab);
      const { api } = await import('../api/client');
      const res = await api.get(`/usage/daily?from=${from}&to=${to}&kind=${activeTab}`);
      console.log('🔍 HabitTrackerCard: Received usage data:', res.data);
      return res.data;
    },
    enabled: !!userId,
  });

  /* 2) Fetch OVERALL data (from first_use_date → today) */
  const overallQ = useQuery<UsageData>({
    queryKey: ['usage-overall', userId, monthQ.data?.first_use_date, activeTab],
    queryFn: async () => {
      const first = monthQ.data?.first_use_date;
      if (!first) throw new Error('No first use date available');
      const { api } = await import('../api/client');
      const res = await api.get(`/usage/daily?from=${first}&to=${todayKey}&kind=${activeTab}`);
      return res.data;
    },
    enabled: !!userId && !!monthQ.data?.first_use_date,
    staleTime: 60_000,
  });

  const dayMap = useMemo(() => {
    const m = new Map<string, DailyData>();
    monthQ.data?.days.forEach((d: DailyData) => m.set(d.date, d));
    return m;
  }, [monthQ.data]);

  const firstSessionKey = useMemo(() => {
    if (!overallQ.data) return null;
    const hit = [...overallQ.data.days]
      .sort((a: DailyData, b: DailyData) => a.date.localeCompare(b.date))
      .find((d: DailyData) => d.sessions > 0);
    return hit?.date ?? null;
  }, [overallQ.data]);

  /* Check if user is fresh (no sessions ever) */
  const isFreshUser = useMemo(() => {
    if (!monthQ.data) return false;
    return !monthQ.data.first_use_date || monthQ.data.analytics.totalSessions === 0;
  }, [monthQ.data]);

  /* Calendar grid (6 weeks) */
  const calendarGrid = useMemo(() => {
    if (!monthQ.data) return [];
    const firstGridDay = startOfWeekMonday(monthStart);
    const items: Array<{
      key: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      dotColor: '' | 'bg-green-500' | 'bg-red-500' | 'bg-indigo-400/30';
      isDimmed: boolean;
      isPlaceholder: boolean;
    }> = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(firstGridDay, i);
      const key = toKey(d);
      const entry = dayMap.get(key);
      let dot: '' | 'bg-green-500' | 'bg-red-500' | 'bg-indigo-400/30' = '';
      let isPlaceholder = false;

      const firstUse = monthQ.data.first_use_date;
      if (firstUse && key < firstUse) {
        dot = '';
      } else if (key > todayKey) {
        dot = '';
      } else if (entry?.sessions && entry.sessions > 0) {
        dot = 'bg-green-500';
      } else if (isFreshUser) {
        // For fresh users, show subtle placeholder dots instead of red
        dot = 'bg-indigo-400/30';
        isPlaceholder = true;
      } else {
        dot = 'bg-red-500';
      }

      const isDimmed = !!firstSessionKey && key < firstSessionKey;

      items.push({
        key,
        dayNumber: d.getDate(),
        isCurrentMonth: d.getMonth() === currentMonth.getMonth(),
        isToday: key === todayKey,
        dotColor: dot,
        isDimmed,
        isPlaceholder,
      });
    }
    return items;
  }, [monthQ.data, monthStart, currentMonth, dayMap, todayKey, firstSessionKey, isFreshUser]);

  /* Month analytics from backend */
  const monthAnalytics = useMemo(() => {
    const data = monthQ.data;
    if (!data) return null;

    return {
      totalSessions: data.analytics.totalSessions,
      totalMinutes: data.analytics.totalMinutes,
      completionRate: data.analytics.completionRate,
      avgSessionDuration: data.analytics.avgSessionDuration,
      longestBreak: data.analytics.longestBreak,
      kind: data.analytics.kind,
    };
  }, [monthQ.data]);

  /* Overall analytics from backend */
  const overallAnalytics = useMemo(() => {
    const data = overallQ.data;
    if (!data) return null;

    return {
      currentStreak: data.streaks.current,
      bestStreak: data.streaks.best,
    };
  }, [overallQ.data]);

  /* Month navigation with lower bound = month(first session) */
  const minMonth = useMemo(() => {
    if (!firstSessionKey) return null;
    const [y, m] = firstSessionKey.split('-').map(Number);
    return new Date(y!, (m! - 1), 1);
  }, [firstSessionKey]);

  const canGoPrev = useMemo(() => {
    if (!minMonth) return true; // while loading, allow
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prev >= startOfMonth(minMonth);
  }, [currentMonth, minMonth]);

  const navigateMonth = (dir: 'prev' | 'next') => {
    if (dir === 'prev' && !canGoPrev) return;
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + (dir === 'next' ? 1 : -1), 1));
  };
  const goToToday = () => setCurrentMonth(new Date());

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  if (monthQ.error || overallQ.error) {
    return (
      <Card>
        <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Habit tracker</div>
        <div className="text-red-400 text-sm mt-2">
          Failed to load data
          <button onClick={() => { monthQ.refetch(); overallQ.refetch(); }} className="ml-2 text-blue-400 hover:text-blue-300 underline">Retry</button>
        </div>
      </Card>
    );
  }

  const isLoading = monthQ.isLoading || overallQ.isLoading;

  return (
    <Card>
      <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Habit tracker</div>
      
      {/* Session Type Tabs */}
      <div className="flex mt-3 mb-2">
        <button
          onClick={() => setActiveTab('meditation')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md transition-colors ${
            activeTab === 'meditation'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Meditation
        </button>
        <button
          onClick={() => setActiveTab('sleep_story')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md transition-colors ${
            activeTab === 'sleep_story'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Sleep Story
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center mt-3">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={!canGoPrev}
          className={`mr-3 p-1 rounded transition-colors ${canGoPrev ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
          aria-label="Previous month"
        >
          ←
        </button>
        <div className="text-sm font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={() => navigateMonth('next')}
          className="ml-3 p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Today Button */}
      <div className="flex justify-center mt-2">
        <button onClick={goToToday} className="text-xs text-silver hover:text-white px-2 py-1 rounded transition-colors">
          Today
        </button>
      </div>

      {/* Calendar */}
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
            <div key={d} className="text-xs text-silver text-center py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {isLoading
            ? Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-700 rounded-full animate-pulse" />
                </div>
              ))
            : calendarGrid.map(day => (
                <div
                  key={day.key}
                  className={`aspect-square flex flex-col items-center justify-center text-sm transition-all hover:scale-110 ${
                    day.isCurrentMonth
                      ? day.isDimmed ? 'text-white/30' : 'text-white'
                      : 'text-silver/50'
                  } ${day.isToday ? 'ring-1 ring-white/30 rounded' : ''}`}
                >
                  <div className="text-xs mb-1 font-medium">{day.dayNumber}</div>
                  {day.dotColor && (
                    <div className={`w-3 h-3 rounded-full ${day.dotColor} ${day.isDimmed ? 'opacity-30' : ''} ${
                      day.isPlaceholder ? 'animate-pulse' : ''
                    }`} />
                  )}
                </div>
              ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-silver">
        {isFreshUser ? (
          <>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-400/30 rounded-full animate-pulse" />
              <span>Start your journey</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Completed</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Done</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Missed</span>
            </div>
          </>
        )}
      </div>

      {/* MONTH Analytics - Filtered by Session Type */}
      {monthAnalytics && !isFreshUser && (
        <div className="border-t border-white/10 mt-4 pt-4">
          {/* Main metrics - Total Sessions, Total Time, Completion Rate */}
          {/* <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            <div className="text-center">
              <div className="text-silver text-xs">Total Sessions</div>
              <div className="font-medium text-indigo-400 text-sm">{monthAnalytics.totalSessions}</div>
            </div>
            <div className="text-center">
              <div className="text-silver text-xs">Total Time</div>
              <div className="font-medium text-purple-400 text-sm">{monthAnalytics.totalMinutes}m</div>
            </div>
            <div className="text-center">
              <div className="text-silver text-xs">Completion Rate</div>
              <div className="font-medium text-green-400 text-sm">{monthAnalytics.completionRate}%</div>
            </div>
          </div> */}
          
          {/* Secondary metrics - Streaks and Break */}
          {overallAnalytics && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-silver text-xs">Current Streak</div>
                <div className="font-medium text-indigo-400 text-sm">{overallAnalytics.currentStreak} days</div>
              </div>
              <div className="text-center">
                <div className="text-silver text-xs">Best Streak</div>
                <div className="font-medium text-purple-400 text-sm">{overallAnalytics.bestStreak} days</div>
              </div>
              <div className="text-center">
                <div className="text-silver text-xs">Longest Break</div>
                <div className="font-medium text-red-400 text-sm">{monthAnalytics.longestBreak} days</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fresh User Onboarding */}
      {!isLoading && isFreshUser && (
        <div className="text-center mt-6 py-6 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl border border-indigo-400/20">
          <div className="text-4xl mb-3">🌟</div>
          <div className="text-white font-medium text-lg mb-2">Start Your Mindfulness Journey</div>
          <div className="text-silver text-sm mb-4 max-w-sm mx-auto">
            Complete your first meditation session to begin building your habit streak. 
            Each day you practice will light up your calendar!
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-indigo-300">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span>Ready to begin? Head to the home page to start your first session</span>
          </div>
        </div>
      )}

      {/* First-render no data */}
      {!isLoading && !monthQ.data && (
        <div className="text-center mt-4 py-8">
          <div className="text-silver text-sm mb-2">Make your first session to start your habit!</div>
          <button className="text-blue-400 hover:text-blue-300 text-sm underline">Go to Home</button>
        </div>
      )}
    </Card>
  );
}
