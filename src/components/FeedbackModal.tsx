import { useEffect, useMemo, useState } from 'react';
import PremiumVoiceNotes from './PremiumVoiceNotes';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; text: string }) => void;
  initialRating?: number;
  initialFeedback?: string;
  userId: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialFeedback = '',
  userId,
}: FeedbackModalProps) {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [feedbackText, setFeedbackText] = useState(initialFeedback);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(initialRating);
      setFeedbackText(initialFeedback);
      setCelebrate(false);
    }
  }, [isOpen, initialRating, initialFeedback]);

  // Subtle brand accent — indigo-purple to match app theme
  const accent = useMemo(
    () => ({
      ring: 'ring-indigo-400/50',
      glow: 'shadow-[0_0_0_1px_rgba(99,102,241,0.18),0_10px_30px_-10px_rgba(99,102,241,0.25)]',
      text: 'text-indigo-300',
      dot: 'bg-indigo-300/80',
      grad: 'from-indigo-400/20 via-purple-300/10 to-purple-200/0',
    }),
    []
  );

  const ratingOptions = [
    { value: 1, emoji: '🙁', label: 'Nothing Changed'},
    { value: 2, emoji: '🙂', label: 'Little Bit Better'},
    { value: 3, emoji: '😀', label: 'I Feel Good Now' },
  ];

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmit({ rating: selectedRating, text: feedbackText });
      // Play celebration, then close
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        onClose();
      }, 2800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center">
      {/* Dimmed + crystal blur background */}
      <div
        className="absolute inset-0 bg-[rgba(8,10,14,0.8)] backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Subtle top crystal bar (frosted highlight) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/6 via-white/3 to-transparent backdrop-blur-[12px]" />

      {/* Celebration overlay */}
      {celebrate && <CelebrationOverlay accentClass={accent.text} />}

      {/* Glass Modal (bottom sheet style) */}
      <div
        className={[
          'relative w-full max-w-md mx-4 rounded-t-[28px]',
          'border border-white/10',
          'bg-[rgba(20,22,28,0.2)] backdrop-blur-2xl',
          'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]',
          'overflow-hidden transform transition-transform duration-300 ease-out',
          accent.glow,
        ].join(' ')}
        style={{ height: '75vh', minHeight: '75vh' }}
      >
        {/* Decorative crystal sheen */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.grad}`} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 grid place-content-center rounded-full bg-white/20 text-white/80 hover:text-white hover:bg-white/10 transition" style={{ width: '24px', height: '24px' }}
          aria-label="Close feedback modal"
        >
          ✕
        </button>

        {/* Content */}
        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="px-6 pt-7 pb-4">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/10" />
            <h2 className="text-xl font-semibold tracking-tight text-white text-center">
              Wow! So glad you did it!
            </h2>
            {/* <p className="mt-2 text-[13px] text-white/60 text-center">
              Your feedback helps us improve your experience
            </p> */}
          </div>

          {/* Rating */}
          <div className="px-6 pb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-4">
              <span className={`${accent.dot} inline-block h-1.5 w-1.5 rounded-full`} />
              <span>How was the experience?</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ratingOptions.map((option) => {
                const active = selectedRating === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedRating(option.value)}
                    className={[
                      'group relative overflow-hidden',
                      'rounded-2xl px-3 py-3 text-left',
                      'bg-white/[0.04] border border-white/10',
                      'hover:bg-white/[0.06] transition-all duration-200',
                      active
                        ? `ring-2 ${accent.ring} bg-white/[0.08]`
                        : 'ring-0',
                    ].join(' ')}
                  >
                    {/* subtle shine */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/5 to-transparent" />
                    <div className="text-2xl leading-none mb-2">{option.emoji}</div>
                    <div className={`text-[13px] font-semibold ${active ? accent.text : 'text-white/90'}`}>
                      {option.label}
                    </div>
                    {/* <div className="text-[12px] text-white/55 leading-snug mt-0.5">
                      {option.description}
                    </div> */}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice notes / text */}
          <div className="px-6 pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
              <span className={`${accent.dot} inline-block h-1.5 w-1.5 rounded-full`} />
              <span>How can we improve?</span>
              {/* <span className="text-white/45 text-xs">(optional)</span> */}
            </div>

            <div
              className={[
                'rounded-2xl border border-white/10 bg-white/[0.04]',
                'focus-within:border-white/20 focus-within:bg-white/[0.06] transition-colors',
              ].join(' ')}
            >
              <PremiumVoiceNotes
                value={feedbackText}
                onChange={setFeedbackText}
                placeholder=""
                disabled={false}
                userId={userId}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 pb-7">
            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0}
              className={[
                'w-full py-3.5 px-6 rounded-2xl font-semibold',
                'transition-all duration-200',
                'bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.98]',
                selectedRating === 0 && 'opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              Submit Session Feedback
            </button>

            {/* tiny footnote */}
            <p className="mt-3 text-center text-[11px] text-white/45">
              Thank you for helping us improve.
            </p>
          </div>
        </div>
      </div>

      {/* Styles for custom scrollbar + animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

/* ---------------- Celebration Overlay (no libs) ---------------- */

function CelebrationOverlay({ accentClass = 'text-indigo-300' }: { accentClass?: string }) {
  // Generate a few confetti pieces with CSS only
  const pieces = new Array(18).fill(0).map((_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 z-[10001] overflow-hidden">
      {/* Frosted layer to make it feel premium */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent backdrop-blur-[2px]"></div>

      {/* Trophy */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="animate-trophy-scale">
          <svg
            width="96"
            height="96"
            viewBox="0 0 24 24"
            className={`${accentClass} drop-shadow-[0_6px_24px_rgba(99,102,241,0.45)]`}
            fill="currentColor"
          >
            <path d="M19 5h-2V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v1a5 5 0 0 0 4 4.9V13a3 3 0 0 0 2 2.83V18H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-3v-2.17A3 3 0 0 0 16 13v-1.1A5 5 0 0 0 20 7V6a1 1 0 0 0-1-1Zm-2 3.9a3.01 3.01 0 0 1-2 2.82V13a1 1 0 1 1-2 0v-1.28A3.01 3.01 0 0 1 9 8.9V6h6v2.9ZM6 6v1a3 3 0 0 0 2 2.82V6H6Zm12 0h-2v3.82A3 3 0 0 0 18 7V6Z" />
          </svg>
        </div>
      </div>

      {/* Confetti pieces */}
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute w-2 h-3 rounded-[2px] opacity-90 animate-confetti"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `-${Math.random() * 20 + 5}%`,
            background:
              ['#6366f1', '#a855f7', '#FFFFFF', '#8b5cf6'][i % 4],
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${(i % 12) * 0.07}s`,
            animationDuration: `${2 + (i % 6) * 0.18}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.2, 0.6, 0.2, 1);
          animation-fill-mode: both;
        }
        @keyframes trophy-scale {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          20% {
            transform: scale(1.08);
            opacity: 1;
          }
          60% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-trophy-scale {
          animation: trophy-scale 800ms ease-out forwards;
          filter: drop-shadow(0 12px 40px rgba(99, 102, 241, 0.35));
        }
      `}</style>
    </div>
  );
}
