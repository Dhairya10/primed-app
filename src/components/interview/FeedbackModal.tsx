import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  reasons: string[];
  additionalFeedback: string;
}

const FEEDBACK_OPTIONS = [
  { id: 'exploring', label: 'Just exploring the platform' },
  { id: 'question_quality', label: "Didn't like the questions" },
  { id: 'interviewer_style', label: "Didn't like the interviewer's style" },
  { id: 'technical_issues', label: 'Encountered technical issues' },
  { id: 'other', label: 'Other reason' },
];

export function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReason = (reasonId: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonId)
        ? prev.filter((id) => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({
      reasons: selectedReasons,
      additionalFeedback: additionalFeedback.trim(),
    });
    setIsSubmitting(false);
  };

  const canSubmit = selectedReasons.length > 0 || additionalFeedback.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-black border-2 border-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Help Us Improve</h2>
            <p className="text-sm text-white/60 mt-1">
              Your feedback helps us create better interview experiences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Multi-select options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white block">
              Why are you ending this interview? (Select all that apply)
            </label>
            <div className="space-y-2">
              {FEEDBACK_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleReason(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedReasons.includes(option.id)
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedReasons.includes(option.id)
                          ? 'bg-black border-black'
                          : 'border-white/40'
                      }`}
                    >
                      {selectedReasons.includes(option.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional feedback text area */}
          <div className="space-y-3">
            <label htmlFor="additional-feedback" className="text-sm font-medium text-white block">
              Additional feedback (optional)
            </label>
            <textarea
              id="additional-feedback"
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full h-32 px-4 py-3 bg-transparent border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-white/40 text-right">
              {additionalFeedback.length}/500 characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-white/20 flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            fullWidth
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
