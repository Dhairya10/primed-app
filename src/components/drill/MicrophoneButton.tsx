import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
  disabled?: boolean;
}

export function MicrophoneButton({
  isMuted,
  onToggleMute,
  disabled = false,
}: MicrophoneButtonProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleMute();
    }
  };

  return (
    <button
      onClick={onToggleMute}
      onKeyDown={handleKeyPress}
      disabled={disabled}
      aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      aria-pressed={isMuted}
      className={`
        min-h-[44px] min-w-[44px] p-3
        bg-ink-950 text-paper-50
        border-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paper-50
        active:scale-95
        ${isMuted ? 'border-paper-400' : 'border-paper-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-ink-800'}
      `}
    >
      {isMuted ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
