import { useCallback, useEffect, useRef, useState } from 'react';
import { getVoiceAgentWebSocketUrl } from '@/lib/api';

type TranscriptRole = 'user' | 'assistant';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface VoiceAgentConfig {
  sessionId: string;
  authToken?: string | null;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
  onAudioReceived?: (audioData: ArrayBuffer, mimeType: string) => void;
  onTranscript?: (role: TranscriptRole, text: string) => void;
  onMetadata?: (data: Record<string, unknown>) => void;
}

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAYS_MS = [1000, 2000, 4000];

export function useVoiceAgent(config: VoiceAgentConfig) {
  const {
    sessionId,
    authToken,
    onConnected,
    onDisconnected,
    onError,
    onAudioReceived,
    onTranscript,
    onMetadata,
  } = config;

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const connectRef = useRef<() => void>(() => { });
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef(true);

  const onConnectedRef = useRef(onConnected);
  const onDisconnectedRef = useRef(onDisconnected);
  const onErrorRef = useRef(onError);
  const onAudioReceivedRef = useRef(onAudioReceived);
  const onTranscriptRef = useRef(onTranscript);
  const onMetadataRef = useRef(onMetadata);

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    onDisconnectedRef.current = onDisconnected;
  }, [onDisconnected]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onAudioReceivedRef.current = onAudioReceived;
  }, [onAudioReceived]);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onMetadataRef.current = onMetadata;
  }, [onMetadata]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const cleanupSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!shouldReconnectRef.current) return;

    const attempt = reconnectAttemptRef.current;
    if (attempt >= MAX_RECONNECT_ATTEMPTS) return;

    const delay = RECONNECT_DELAYS_MS[attempt] ?? RECONNECT_DELAYS_MS[RECONNECT_DELAYS_MS.length - 1];
    reconnectAttemptRef.current += 1;

    clearReconnectTimeout();
    reconnectTimeoutRef.current = window.setTimeout(() => {
      connectRef.current();
    }, delay);
  }, [clearReconnectTimeout]);

  const handleTextMessage = useCallback((payload: string) => {
    let message: any;
    try {
      message = JSON.parse(payload);
    } catch (err) {
      return;
    }

    if (!message || typeof message.type !== 'string') return;

    switch (message.type) {
      case 'audio': {
        if (typeof message.data === 'string') {
          const audioBuffer = base64ToArrayBuffer(message.data);
          const mimeType = typeof message.mime_type === 'string'
            ? message.mime_type
            : 'audio/pcm;rate=24000';
          onAudioReceivedRef.current?.(audioBuffer, mimeType);
        }
        break;
      }
      case 'transcript': {
        if (typeof message.text === 'string' && typeof message.role === 'string') {
          onTranscriptRef.current?.(message.role as TranscriptRole, message.text);
        }
        break;
      }
      case 'metadata': {
        if (typeof message === 'object') {
          onMetadataRef.current?.(message);
        }
        break;
      }
      case 'error': {
        const messageText =
          typeof message.error_message === 'string'
            ? message.error_message
            : 'Voice agent error';
        const err = new Error(messageText);
        setError(err);
        onErrorRef.current?.(err);
        break;
      }
      case 'session_end': {
        shouldReconnectRef.current = false;
        cleanupSocket();
        setConnectionStatus('disconnected');
        onDisconnectedRef.current?.();
        break;
      }
      default:
        break;
    }
  }, [cleanupSocket]);

  const handleSocketMessage = useCallback(async (event: MessageEvent) => {
    if (typeof event.data === 'string') {
      handleTextMessage(event.data);
      return;
    }

    if (event.data instanceof ArrayBuffer) {
      onAudioReceivedRef.current?.(event.data, 'audio/pcm;rate=24000');
      return;
    }

    if (event.data instanceof Blob) {
      const buffer = await event.data.arrayBuffer();
      onAudioReceivedRef.current?.(buffer, 'audio/pcm;rate=24000');
    }
  }, [handleTextMessage]);

  const connect = useCallback(() => {
    if (!sessionId) {
      setConnectionStatus('disconnected');
      return;
    }

    clearReconnectTimeout();
    cleanupSocket();
    setConnectionStatus('connecting');

    const url = getVoiceAgentWebSocketUrl(sessionId, authToken ?? undefined);
    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
      setError(null);
      setConnectionStatus('connected');
      // Trigger agent to speak first
      ws.send(JSON.stringify({ type: 'session_start' }));
      onConnectedRef.current?.();
    };

    ws.onmessage = handleSocketMessage;

    ws.onerror = () => {
      const err = new Error('WebSocket connection error');
      setError(err);
      onErrorRef.current?.(err);
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      onDisconnectedRef.current?.();
      scheduleReconnect();
    };

    wsRef.current = ws;
  }, [authToken, cleanupSocket, clearReconnectTimeout, handleSocketMessage, scheduleReconnect, sessionId]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    if (sessionId) {
      connect();
    }

    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      cleanupSocket();
    };
  }, [clearReconnectTimeout, connect, cleanupSocket, sessionId]);

  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(audioData);
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    cleanupSocket();
    setConnectionStatus('disconnected');
  }, [cleanupSocket, clearReconnectTimeout]);

  return {
    connectionStatus,
    sendAudio,
    disconnect,
    error,
  };
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
