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

  // Actions
  setConnectionStatus: (status: InterviewStore['connectionStatus']) => void;
  setInterviewStartTime: (time: number) => void;
  incrementElapsedSeconds: () => void;
  setSessionId: (id: string) => void;
  setProblemId: (id: string) => void;
  setEstimatedDurationMinutes: (minutes: number) => void;
  setMode: (mode: InterviewStore['mode']) => void;
  setMuted: (muted: boolean) => void;
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
    }),
}));
