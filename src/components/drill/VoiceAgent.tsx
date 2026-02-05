import { useEffect, useRef, useState } from 'react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { AudioCaptureService } from '@/services/audioCapture';
import { AudioPlaybackService } from '@/services/audioPlayback';
import { useAuthStore } from '@/lib/auth-store';
import { AudioWaveform } from './AudioWaveform';
import { MicrophoneButton } from './MicrophoneButton';
import { Timer } from './Timer';
import { ConfirmationDialog } from './ConfirmationDialog';
import { Phone } from 'lucide-react';

interface VoiceAgentProps {
  sessionId: string;
  onSessionEnd: () => void;
}

type WaveformMode = 'listening' | 'speaking' | 'thinking';

export function VoiceAgent({ sessionId, onSessionEnd }: VoiceAgentProps) {
  const session = useAuthStore((state) => state.session);
  const [isMuted, setIsMuted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [audioVolume, setAudioVolume] = useState({ input: 0, output: 0 });

  const audioCaptureRef = useRef<AudioCaptureService | null>(null);
  const audioPlaybackRef = useRef<AudioPlaybackService | null>(null);
  const volumePollIntervalRef = useRef<number | null>(null);

  // Initialize voice agent with WebSocket connection
  const { connectionStatus, sendAudio, disconnect, error } = useVoiceAgent({
    sessionId,
    authToken: session?.access_token,
    onConnected: () => {
      console.log('WebSocket connected');
      setStartTime(new Date());
      startAudioCapture();
    },
    onDisconnected: () => {
      console.log('WebSocket disconnected');
      stopAudioCapture();
    },
    onAudioReceived: (data, mimeType) => {
      audioPlaybackRef.current?.playAudio(data, mimeType);
    },
    onTranscript: (role, text) => {
      console.log(`${role}: ${text}`);
    },
    onError: (err) => {
      console.error('Voice agent error:', err);
    },
  });

  // Initialize audio capture service
  useEffect(() => {
    const service = new AudioCaptureService((pcmData) => {
      sendAudio(pcmData);
    });
    audioCaptureRef.current = service;

    return () => {
      service.stop();
    };
  }, [sendAudio]);

  // Initialize audio playback service
  useEffect(() => {
    audioPlaybackRef.current = new AudioPlaybackService();

    return () => {
      audioPlaybackRef.current?.stop();
    };
  }, []);

  // Start audio capture when connected
  const startAudioCapture = async () => {
    try {
      await audioCaptureRef.current?.start();
    } catch (err) {
      console.error('Failed to start audio capture:', err);
    }
  };

  // Stop audio capture
  const stopAudioCapture = () => {
    audioCaptureRef.current?.stop();
  };

  // Poll audio volume for waveform visualization
  useEffect(() => {
    volumePollIntervalRef.current = window.setInterval(() => {
      const input = audioCaptureRef.current?.getInputVolume() ?? 0;
      const output = audioPlaybackRef.current?.getOutputVolume() ?? 0;
      setAudioVolume({ input, output });
    }, 100);

    return () => {
      if (volumePollIntervalRef.current !== null) {
        clearInterval(volumePollIntervalRef.current);
      }
    };
  }, []);

  // Handle mute/unmute
  const handleToggleMute = () => {
    if (!audioCaptureRef.current) return;

    if (isMuted) {
      audioCaptureRef.current.unmute();
      setIsMuted(false);
    } else {
      audioCaptureRef.current.mute();
      setIsMuted(true);
    }
  };

  // Handle end interview
  const handleEndInterview = () => {
    setShowExitDialog(false);
    disconnect();
    onSessionEnd();
  };

  // Determine waveform mode based on connection and playback state
  const getWaveformMode = (): WaveformMode => {
    if (connectionStatus !== 'connected') return 'thinking';
    if (audioPlaybackRef.current?.isPlaying) return 'speaking';
    return 'listening';
  };

  // Get current volume for waveform
  const getCurrentVolume = (): number => {
    const mode = getWaveformMode();
    if (mode === 'speaking') return audioVolume.output;
    if (mode === 'listening') return audioVolume.input;
    return 0.3; // Default for thinking mode
  };

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex flex-col">
      {/* Header with Timer */}
      <div className="p-4 flex justify-end border-b border-white/10">
        {startTime && <Timer startTime={startTime} />}
      </div>

      {/* Main Content: Waveform */}
      <div className="flex-1 flex items-center justify-center">
        <AudioWaveform
          mode={getWaveformMode()}
          volume={getCurrentVolume()}
        />
      </div>

      {/* Connection Status */}
      {connectionStatus === 'connecting' && (
        <div className="text-center text-sm text-paper-400 pb-2">
          Connecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-sm text-paper-200 pb-2 px-4">
          {error.message}
        </div>
      )}

      {/* Controls: Mute + End Call */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center space-x-12">
          {/* Mute Button */}
          <MicrophoneButton
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            disabled={connectionStatus !== 'connected'}
          />

          {/* End Interview Button */}
          {connectionStatus === 'connected' && (
            <button
              onClick={() => setShowExitDialog(true)}
              aria-label="End interview"
              className="
                min-h-[44px] min-w-[44px] p-3
                bg-paper-50 text-ink-950 border-2 border-ink-950
                hover:bg-paper-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 focus:ring-paper-50
                transition-all duration-200
                active:scale-95
              "
            >
              <Phone className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showExitDialog}
        title="End Interview?"
        message="Are you sure you want to end this interview? Your progress will not be saved."
        onConfirm={handleEndInterview}
        onCancel={() => setShowExitDialog(false)}
      />
    </div>
  );
}
