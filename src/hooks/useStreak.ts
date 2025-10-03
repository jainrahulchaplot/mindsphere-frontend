import { useQuery } from '@tanstack/react-query';
import { api, getData } from '../api/client';
import type { StreaksRes } from '../api/types';

export function useStreak(userId: string | null) {
  return useQuery<StreaksRes, Error>({
    queryKey: ['streak', userId],
    enabled: !!userId,
    queryFn: () => getData(api.get(`/streaks/`))
  });
}
