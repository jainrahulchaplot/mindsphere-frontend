import { useMusicTracks as useMusicTracksQuery } from '../api/hooks';

export function useMusicTracks() {
  return useMusicTracksQuery();
}
