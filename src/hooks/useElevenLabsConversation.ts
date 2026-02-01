import { useRef, useCallback, useEffect, useState } from 'react';
import { Conversation } from '@elevenlabs/client';
import { useInterviewStore } from '@/lib/interview-store';

interface UseElevenLabsConversationProps {
  signedUrl: string;
  problemTitle: string;
  estimatedDurationMinutes: number;
  onError: (error: Error) => void;
}

export function useElevenLabsConversation({
  signedUrl,
  problemTitle,
  estimatedDurationMinutes,
  onError,
}: UseElevenLabsConversationProps) {
  const conversationRef = useRef<Conversation | null>(null);
  const [mode, setMode] = useState<'speaking' | 'listening' | 'thinking'>('listening');
  const { setConnectionStatus, setInterviewStartTime } = useInterviewStore();

  // Use ref to store the latest onError callback without triggering re-runs
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let mounted = true;

    async function initConversation() {
      try {
        setConnectionStatus('connecting');

        // Start ElevenLabs conversation with dynamic variables
        conversationRef.current = await Conversation.startSession({
          signedUrl,

          // Inject problem context into agent (must match Eleven Labs agent config exactly)
          dynamicVariables: {
            title: problemTitle,
            estimated_duration_minutes: estimatedDurationMinutes,
          },

          onConnect: () => {
            if (!mounted) return;
            console.log('✅ ElevenLabs connected');
            setConnectionStatus('connected');
            setInterviewStartTime(Date.now());
          },

          onDisconnect: () => {
            if (!mounted) return;
            console.log('🔌 ElevenLabs disconnected');
            setConnectionStatus('disconnected');
          },

          onModeChange: (modeData) => {
            if (!mounted) return;
            const newMode = modeData.mode as 'speaking' | 'listening' | 'thinking';
            setMode(newMode);
          },

          onError: (error) => {
            if (!mounted) return;
            console.error('❌ ElevenLabs error:', error);
            setConnectionStatus('disconnected');
            const errorMessage = typeof error === 'string' ? error : (error as any).message || 'Connection error';
            onErrorRef.current(new Error(errorMessage));
          },
        });
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to start conversation:', error);
        setConnectionStatus('disconnected');
        onErrorRef.current(error as Error);
      }
    }

    initConversation();

    return () => {
      mounted = false;
      if (conversationRef.current) {
        conversationRef.current.endSession().catch(console.error);
        conversationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedUrl, problemTitle, estimatedDurationMinutes]); // Removed onError - using ref instead

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
        conversationRef.current = null;
        setConnectionStatus('disconnected');
      } catch (error) {
        console.error('Failed to end conversation:', error);
      }
    }
  }, [setConnectionStatus]);

  return {
    endConversation,
    conversation: conversationRef.current,
    mode,
  };
}
