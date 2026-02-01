import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { Conversation } from '@elevenlabs/client';

interface MicrophoneButtonProps {
  conversation: Conversation | null;
}

export function MicrophoneButton({ conversation }: MicrophoneButtonProps) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (!conversation) return;

    try {
      const newMutedState = !isMuted;

      // Mute/unmute the candidate's microphone (not the AI agent's audio)
      conversation.setMicMuted(newMutedState);

      setIsMuted(newMutedState);
      console.log(newMutedState ? '🔇 Microphone muted' : '🔊 Microphone unmuted');
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMute();
    }
  };

  return (
    <button
      onClick={toggleMute}
      onKeyDown={handleKeyDown}
      disabled={!conversation}
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
