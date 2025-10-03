import { useState } from 'react';
import Card from './Card';
import Button from './Button';
import PremiumVoiceNotes from './PremiumVoiceNotes';

interface SessionFeedbackProps {
  onSubmit: (feedback: { rating: number; text: string }) => void;
  initialRating?: number;
  initialFeedback?: string;
  userId: string;
}

const ratingOptions = [
  {
    value: 1,
    label: "Needs Improvement",
    description: "I didn't feel much better",
    icon: "😔",
    color: "text-red-400",
    bgColor: "bg-gradient-to-br from-red-900/20 to-red-800/10",
    borderColor: "border-red-400/30",
    hoverColor: "hover:from-red-900/30 hover:to-red-800/20",
    selectedColor: "from-red-500/20 to-red-400/10"
  },
  {
    value: 2,
    label: "Neutral",
    description: "No significant change",
    icon: "😐",
    color: "text-yellow-400",
    bgColor: "bg-gradient-to-br from-yellow-900/20 to-yellow-800/10",
    borderColor: "border-yellow-400/30",
    hoverColor: "hover:from-yellow-900/30 hover:to-yellow-800/20",
    selectedColor: "from-yellow-500/20 to-yellow-400/10"
  },
  {
    value: 3,
    label: "Feel Better",
    description: "I feel more relaxed and centered",
    icon: "😌",
    color: "text-green-400",
    bgColor: "bg-gradient-to-br from-green-900/20 to-green-800/10",
    borderColor: "border-green-400/30",
    hoverColor: "hover:from-green-900/30 hover:to-green-800/20",
    selectedColor: "from-green-500/20 to-green-400/10"
  }
];

export default function SessionFeedback({ 
  onSubmit, 
  initialRating, 
  initialFeedback,
  userId
}: SessionFeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<number>(initialRating || 0);
  const [feedbackText, setFeedbackText] = useState<string>(initialFeedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRating === 0) {
      alert('Please select how you feel after this session');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating: selectedRating,
        text: feedbackText.trim()
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-premium">
        <div className="text-center">
          <div className="heading mb-3 text-gradient">How do you feel?</div>
          <div className="subtle text-white/70">Your feedback helps us improve your experience</div>
        </div>
      </Card>

      {/* Rating System */}
      <Card className="card-premium">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <div className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <span>✨</span>
              <span>Rate your experience:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRating(option.value)}
                  className={`
                    p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
                    ${selectedRating === option.value
                      ? `${option.bgColor} ${option.borderColor} border-2 shadow-lg scale-105`
                      : `border-white/10 ${option.hoverColor} hover:border-white/20 hover:scale-102`
                    }
                    hover:shadow-xl active:scale-95
                  `}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl animate-premium-float">{option.icon}</div>
                    <div className={`font-semibold text-lg ${option.color}`}>
                      {option.label}
                    </div>
                    <div className="text-sm text-white/60">
                      {option.description}
                    </div>
                    {selectedRating === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto animate-premium-pulse" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Free Text Feedback */}
          <div>
            <label className="block text-lg font-semibold mb-3 text-white flex items-center gap-2">
              <span>💭</span>
              <span>Share your thoughts (optional)</span>
            </label>
            <PremiumVoiceNotes
              value={feedbackText}
              onChange={setFeedbackText}
              placeholder="How did this session make you feel? What worked well or could be improved?"
              disabled={false}
              userId={userId}
            />
            <div className="text-right text-sm text-white/50 mt-2">
              {feedbackText.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              label="Submit Session Feedback"
              disabled={selectedRating === 0 || isSubmitting}
              isLoading={isSubmitting}
              variant="premium"
              size="lg"
              className="px-12"
            />
          </div>
        </form>
      </Card>

      {/* Session Summary */}
      <Card className="card-premium">
        <div className="text-center">
          <div className="text-2xl mb-3">🙏</div>
          <div className="text-white/80 font-medium mb-2">Thank you for completing this session!</div>
          <div className="text-white/60">Your feedback helps us create better experiences for you.</div>
        </div>
      </Card>
    </div>
  );
}
