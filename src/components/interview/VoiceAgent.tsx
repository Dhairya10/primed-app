import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { AudioCaptureService } from '@/services/audioCapture';
import { AudioPlaybackService } from '@/services/audioPlayback';
import { useAuthStore } from '@/lib/auth-store';

interface VoiceAgentProps {
  sessionId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

type WaveformMode = 'speaking' | 'listening' | 'thinking';

export function VoiceAgent({ sessionId, onConnect, onDisconnect }: VoiceAgentProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [mode, setMode] = useState<WaveformMode>('thinking');
  const [audioVolume, setAudioVolume] = useState({ input: 0, output: 0 });
  const modeRef = useRef<WaveformMode>('thinking');

  const authToken = useAuthStore((state) => state.session?.access_token);

  const audioCaptureRef = useRef<AudioCaptureService | null>(null);
  const audioPlaybackRef = useRef<AudioPlaybackService | null>(null);
  const sendAudioRef = useRef<(audioData: ArrayBuffer) => void>(() => {});
  const disconnectRef = useRef<() => void>(() => {});

  if (!audioCaptureRef.current) {
    audioCaptureRef.current = new AudioCaptureService((audioData) => {
      sendAudioRef.current(audioData);
    });
  }

  if (!audioPlaybackRef.current) {
    audioPlaybackRef.current = new AudioPlaybackService();
  }

  const audioCapture = audioCaptureRef.current!;
  const audioPlayback = audioPlaybackRef.current!;

  const getMicErrorMessage = (err: unknown) => {
    const name = err instanceof Error ? err.name : '';
    if (name === 'NotAllowedError') {
      return 'Microphone access denied. Please allow microphone access to continue.';
    }
    if (name === 'NotFoundError') {
      return 'No microphone found. Please connect a microphone.';
    }
    if (name === 'NotReadableError') {
      return 'Microphone is already in use by another application.';
    }
    return 'Microphone access failed. Please check your audio settings.';
  };

  const { connectionStatus: agentStatus, sendAudio, disconnect } = useVoiceAgent({
    sessionId: activeSessionId,
    authToken,
    onConnected: async () => {
      try {
        audioCapture.unmute();
        await audioCapture.start();
        onConnect?.();
      } catch (err) {
        const message = getMicErrorMessage(err);
        setError(message);
        disconnectRef.current();
      }
    },
    onDisconnected: () => {
      audioCapture.unmute();
      audioCapture.stop();
      audioPlayback.stop();
      setMode('thinking');
      setAudioVolume({ input: 0, output: 0 });
      onDisconnect?.();
    },
    onAudioReceived: (audioData, mimeType) => {
      void audioPlayback.playAudio(audioData, mimeType);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    sendAudioRef.current = sendAudio;
  }, [sendAudio]);

  useEffect(() => {
    disconnectRef.current = disconnect;
  }, [disconnect]);

  useEffect(() => {
    if (agentStatus === 'connecting' || agentStatus === 'connected') {
      setStatus(agentStatus);
      if (agentStatus === 'connected') {
        setError(null);
      }
    } else if (status !== 'disconnecting') {
      setStatus('disconnected');
    }
  }, [agentStatus, status]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const input = audioCapture.getInputVolume();
      const output = audioPlayback.getOutputVolume();
      setAudioVolume({ input, output });

      const nextMode: WaveformMode = agentStatus !== 'connected'
        ? 'thinking'
        : output > 0.03
          ? 'speaking'
          : input > 0.03
            ? 'listening'
            : 'thinking';

      if (nextMode !== modeRef.current) {
        setMode(nextMode);
        modeRef.current = nextMode;
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [agentStatus, audioCapture, audioPlayback]);

  useEffect(() => {
    return () => {
      audioCapture.stop();
      audioPlayback.stop();
      disconnect();
    };
  }, [audioCapture, audioPlayback, disconnect]);

  const handleStartConversation = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    if (!sessionId) {
      setError('Session ID not configured');
      setStatus('disconnected');
      return;
    }

    setActiveSessionId(sessionId);
  }, [sessionId]);

  const handleEndConversation = useCallback(async () => {
    setStatus('disconnecting');
    disconnect();
    setActiveSessionId('');
    setStatus('disconnected');
  }, [disconnect]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6">
      {/* Waveform Visualization */}
      <div className="w-full h-[280px] flex items-center justify-center">
        <AudioWaveform
          inputVolume={audioVolume.input}
          outputVolume={audioVolume.output}
          mode={status === 'connected' ? mode : 'thinking'}
          isConnected={status === 'connected'}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md text-center text-white/90 text-sm bg-white/10 border border-white/20 px-4 py-3"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-2">
        {status === 'disconnected' && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartConversation}
            className="min-h-[44px] min-w-[44px] px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors touch-manipulation"
          >
            Start Interview
          </motion.button>
        )}

        {status === 'connecting' && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            disabled
            className="min-h-[44px] min-w-[44px] px-6 py-3 bg-white/50 text-black/50 font-medium cursor-not-allowed"
          >
            Connecting...
          </motion.button>
        )}

        {status === 'connected' && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndConversation}
            className="min-h-[44px] min-w-[44px] px-6 py-3 bg-white/10 text-white border-2 border-white/20 font-medium hover:bg-white/20 hover:border-white/30 transition-colors touch-manipulation flex items-center space-x-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Interview</span>
          </motion.button>
        )}

        {status === 'disconnecting' && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            disabled
            className="min-h-[44px] min-w-[44px] px-6 py-3 bg-white/10 text-white/50 font-medium cursor-not-allowed"
          >
            Disconnecting...
          </motion.button>
        )}
      </div>
    </div>
  );
}
