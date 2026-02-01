import { create } from 'zustand';

interface InterviewStore {
  // Connection
  connectionStatus: 'connecting' | 'connected' | 'disconnected';

  // Timing
  elapsedSeconds: number;
  interviewStartTime: number | null;

  // Session tracking
  sessionId: string | null;
  problemId: string | null;
  estimatedDurationMinutes: number;

  // Audio state
  mode: 'speaking' | 'listening' | 'thinking';
  isMuted: boolean;
  transcriptHistory: Array<{ role: 'user' | 'assistant'; text: string }>;
  audioVolume: { input: number; output: number };

  // Actions
  setConnectionStatus: (status: InterviewStore['connectionStatus']) => void;
  setInterviewStartTime: (time: number) => void;
  incrementElapsedSeconds: () => void;
  setSessionId: (id: string) => void;
  setProblemId: (id: string) => void;
  setEstimatedDurationMinutes: (minutes: number) => void;
  setMode: (mode: InterviewStore['mode']) => void;
  setMuted: (muted: boolean) => void;
  addTranscript: (role: 'user' | 'assistant', text: string) => void;
  updateAudioVolume: (input: number, output: number) => void;
  resetStore: () => void;
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  // Initial state
  connectionStatus: 'disconnected',
  elapsedSeconds: 0,
  interviewStartTime: null,
  sessionId: null,
  problemId: null,
  estimatedDurationMinutes: 45,
  mode: 'listening',
  isMuted: false,
  transcriptHistory: [],
  audioVolume: { input: 0, output: 0 },

  // Actions
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setInterviewStartTime: (time) => set({ interviewStartTime: time }),
  incrementElapsedSeconds: () =>
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),
  setSessionId: (id) => set({ sessionId: id }),
  setProblemId: (id) => set({ problemId: id }),
  setEstimatedDurationMinutes: (minutes) => set({ estimatedDurationMinutes: minutes }),
  setMode: (mode) => set({ mode }),
  setMuted: (isMuted) => set({ isMuted }),
  addTranscript: (role, text) =>
    set((state) => ({
      transcriptHistory: [...state.transcriptHistory, { role, text }],
    })),
  updateAudioVolume: (input, output) => set({ audioVolume: { input, output } }),
  resetStore: () =>
    set({
      connectionStatus: 'disconnected',
      elapsedSeconds: 0,
      interviewStartTime: null,
      sessionId: null,
      problemId: null,
      estimatedDurationMinutes: 45,
      mode: 'listening',
      isMuted: false,
      transcriptHistory: [],
      audioVolume: { input: 0, output: 0 },
    }),
}));
