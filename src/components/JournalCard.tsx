import { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Skeleton from './Skeleton';
import VoiceJournal from './VoiceJournal';
import { useJournalSubmit, useUpdateStreak } from '../api/hooks';

type Props = { userId: string; sessionId?: string | null; onComplete?: ()=>void };
export default function JournalCard({ userId, sessionId=null, onComplete }: Props){
  const [text, setText] = useState('');
  const journal = useJournalSubmit();
  const streak = useUpdateStreak();

  const submit = async () => {
    try {
      const res = await journal.mutateAsync({ text, session_id: sessionId, user_id: userId });
      await streak.mutateAsync({ userId });
      onComplete && onComplete();
      alert(`Summary: ${res.summary}\nEmotions: ${res.emotions?.join(', ')}`);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="grid-gap">
      <VoiceJournal 
        onTranscription={setText}
        userId={userId}
        sessionId={sessionId}
      />
      
      <Card>
        <Skeleton isLoading={journal.isPending}>
          <div className="heading">Reflect</div>
          <textarea 
            className="mt-2 w-full bg-graphite text-white border border-white/10 rounded-lg p-3 h-28 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10" 
            placeholder="Write how you feel…" 
            value={text} 
            onChange={e=>setText(e.target.value)} 
          />
          <div className="mt-2">
            <Button label={journal.isPending? 'Saving…':'Save Journal'} onClick={submit} />
          </div>
        </Skeleton>
      </Card>
    </div>
  );
}
