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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleMute();
    }
  };

  return (
    <button
      onClick={onToggleMute}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      aria-pressed={isMuted}
      className="
        min-h-[44px] min-w-[44px]
        w-16 h-16
        rounded-full
        bg-[#2a2a2a]
        text-white
        flex items-center justify-center
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        touch-manipulation
      "
    >
      {isMuted ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}
