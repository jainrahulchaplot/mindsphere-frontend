import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import Button from './Button';
import { useMusicTracks } from '../api/hooks';
import { PlayIcon, PauseIcon, MusicNoteIcon } from './LuxuryIcons';

type Track = { id: string; url: string; order: number; duration_sec: number };
type Props = { tracks: Track[]; onEnded?: ()=>void };
export default function PlayerBar({ tracks, onEnded }: Props){
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const musicAudio = useRef<HTMLAudioElement | null>(null);
  const { data: musicData } = useMusicTracks();

  const current = useMemo(()=> tracks[i] || null, [tracks, i]);

  useEffect(()=>{ if (!current) return; if (!audio.current) audio.current = new Audio(); audio.current.src = current.url; if (playing) audio.current.play().catch(()=>{}); }, [current]);
  useEffect(()=>{ if (!audio.current) return; playing ? audio.current.play().catch(()=>{}) : audio.current.pause(); }, [playing]);

  // Music track management
  useEffect(() => {
    if (!musicEnabled || !selectedTrack) return;
    if (!musicAudio.current) musicAudio.current = new Audio();
    const track = musicData?.tracks.find(t => t.id === selectedTrack);
    if (track) {
      musicAudio.current.src = track.url;
      musicAudio.current.volume = 0.18;
      musicAudio.current.loop = true;
      if (playing) musicAudio.current.play().catch(() => {});
    }
  }, [selectedTrack, musicEnabled, musicData]);

  useEffect(() => {
    if (!musicAudio.current) return;
    if (playing && musicEnabled) {
      musicAudio.current.play().catch(() => {});
    } else {
      musicAudio.current.pause();
    }
  }, [playing, musicEnabled]);

  useEffect(()=>{
    const el = audio.current || new Audio();
    const onEnded = () => {
      if (i < tracks.length - 1) setI(i+1); else { setPlaying(false); onEndedCb(); }
    };
    el.addEventListener('ended', onEnded);
    audio.current = el;
    return () => { el.removeEventListener('ended', onEnded); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, tracks.length]);

  const prev = () => { if (i>0){ setI(i-1); setPlaying(true); } };
  const next = () => { if (i<tracks.length-1){ setI(i+1); setPlaying(true); } else { setPlaying(false); onEndedCb(); } };
  const onEndedCb = () => { onEnded && onEnded(); };

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div className="subtle">Track {i+1}/{tracks.length}</div>
        <div className="flex items-center gap-2">
          <button className="btn px-2 py-1" onClick={prev}>⏮</button>
          <button className="btn px-2 py-1" onClick={()=>setPlaying(p=>!p)}>{playing? <PauseIcon className="w-4 h-4" />:<PlayIcon className="w-4 h-4" />}</button>
          <button className="btn px-2 py-1" onClick={next}>⏭</button>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <button 
          className={`btn px-2 py-1 text-xs ${musicEnabled ? 'opacity-100' : 'opacity-70'}`}
          onClick={() => setMusicEnabled(!musicEnabled)}
        >
          <MusicNoteIcon className="w-4 h-4" />
        </button>
        
        {musicEnabled && musicData?.tracks && (
          <select 
            className="bg-graphite text-white border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-white/10"
            value={selectedTrack || ''}
            onChange={(e) => setSelectedTrack(e.target.value || null)}
          >
            <option value="">Select track</option>
            {musicData.tracks.map(track => (
              <option key={track.id} value={track.id}>{track.title}</option>
            ))}
          </select>
        )}
      </div>
    </Card>
  );
}
