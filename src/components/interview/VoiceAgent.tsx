import { useCallback, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface VoiceAgentProps {
  agentId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export function VoiceAgent({
  agentId,
  onConnect,
  onDisconnect,
}: VoiceAgentProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setStatus('connected');
      setError(null);
      onConnect?.();
    },
    onDisconnect: () => {
      setStatus('disconnected');
      onDisconnect?.();
    },
    onError: (error) => {
      console.error('Voice agent error:', error);
      setError(typeof error === 'string' ? error : 'Connection failed');
      setStatus('disconnected');
    },
  });

  const handleStartConversation = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get agent ID from env or props
      const finalAgentId = agentId || import.meta.env.VITE_ELEVENLABS_AGENT_ID;

      if (!finalAgentId) {
        throw new Error('Agent ID not configured');
      }

      // Start conversation
      await conversation.startSession({
        agentId: finalAgentId,
        connectionType: 'webrtc',
      });
    } catch (err) {
      const message = err instanceof Error ? err.name : 'Unknown error';

      // Handle specific errors
      if (message === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access to continue.');
      } else if (message === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError('Failed to start conversation. Please try again.');
      }

      setStatus('disconnected');
    }
  }, [agentId, conversation]);

  const handleEndConversation = useCallback(async () => {
    setStatus('disconnecting');
    await conversation.endSession();
    setStatus('disconnected');
  }, [conversation]);

  // Determine waveform mode based on conversation state
  const getWaveformMode = (): 'speaking' | 'listening' | 'thinking' => {
    if (!conversation.isSpeaking) return 'listening';
    return 'speaking';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6">
      {/* Waveform Visualization */}
      <div className="w-full h-[280px] flex items-center justify-center">
        <AudioWaveform
          conversation={status === 'connected' ? (conversation as any) : null}
          mode={status === 'connected' ? getWaveformMode() : 'thinking'}
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
