import { create } from 'zustand';
import type {
  DomainType,
  ProblemType,
  // Note: Level system types commented out - not used
  // LevelProgress,
  // LevelData,
  Problem,
} from '@/types/api';
import {
  // Note: Level system functions commented out - removed from API
  // getLevelProgress,
  // getCurrentLevel,
  // substituteProblem,
  // completeProblem,
  // moveToNextProblem,
  getProblems,
  getProblemsMetadata,
} from './api';
import { DEFAULT_USER_ID } from './constants';
import { shuffleArray } from './utils';

interface HomeStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedDomain: DomainType | null;
  setSelectedDomain: (domain: DomainType | null) => void;

  selectedProblemType: ProblemType | null;
  setSelectedProblemType: (type: ProblemType | null) => void;

  clearFilters: () => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedDomain: null,
  setSelectedDomain: (selectedDomain) => set({ selectedDomain }),

  selectedProblemType: null,
  setSelectedProblemType: (selectedProblemType) => set({ selectedProblemType }),

  clearFilters: () => set({
    searchQuery: '',
    selectedDomain: null,
    selectedProblemType: null,
  }),
}));

// ===================================
// Level System Store - COMMENTED OUT
// ===================================
// Note: Level system not in current OpenAPI spec
// Commented out to avoid TypeScript errors
// Uncomment when level system is implemented
//
// interface LevelSystemStore {
//   // State
//   levelProgress: LevelProgress | null;
//   currentLevel: LevelData | null;
//   currentProblem: Problem | null;
//   isLoading: boolean;
//   error: string | null;
//
//   // Actions
//   fetchLevelProgress: (userId: string) => Promise<void>;
//   fetchCurrentLevel: (userId: string) => Promise<void>;
//   startProblemAttempt: (problemId: string) => void;
//   handleSubstituteProblem: (userId: string, problemId: string) => Promise<void>;
//   markProblemComplete: (userId: string, problemId: string, sessionId: string) => Promise<void>;
//   handleMoveToNextProblem: (userId: string) => Promise<void>;
//   reset: () => void;
// }
//
// export const useLevelSystemStore = create<LevelSystemStore>((set, get) => ({
//   // Initial state
//   levelProgress: null,
//   currentLevel: null,
//   currentProblem: null,
//   isLoading: false,
//   error: null,
//
//   // Fetch level progress
//   fetchLevelProgress: async (userId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const progress = await getLevelProgress(userId);
//       set({ levelProgress: progress, isLoading: false });
//     } catch (error) {
//       set({ error: 'Failed to fetch level progress', isLoading: false });
//       console.error('Error fetching level progress:', error);
//     }
//   },
//
//   // Fetch current level with all problems
//   fetchCurrentLevel: async (userId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const level = await getCurrentLevel(userId);
//       // Find the current problem
//       const currentProblem = level.problems.find((p) => p.is_current);
//       set({
//         currentLevel: level,
//         currentProblem: currentProblem?.problem || null,
//         isLoading: false,
//       });
//     } catch (error) {
//       set({ error: 'Failed to fetch current level', isLoading: false });
//       console.error('Error fetching current level:', error);
//     }
//   },
//
//   // Start problem attempt
//   startProblemAttempt: (problemId: string) => {
//     const { currentLevel } = get();
//     if (!currentLevel) return;
//
//     // Update the status of the problem to in_progress
//     const updatedProblems = currentLevel.problems.map((p) =>
//       p.problem_id === problemId ? { ...p, status: 'in_progress' as const } : p
//     );
//     set({
//       currentLevel: { ...currentLevel, problems: updatedProblems },
//     });
//   },
//
//   // Handle problem substitution
//   handleSubstituteProblem: async (userId: string, problemId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const result = await substituteProblem(userId, problemId);
//       const { currentLevel } = get();
//
//       if (!currentLevel) return;
//
//       // Update the current problem with the new one
//       const updatedProblems = currentLevel.problems.map((p) =>
//         p.is_current
//           ? {
//               ...p,
//               problem: result.new_problem,
//               problem_id: result.new_problem.id,
//             }
//           : p
//       );
//
//       set({
//         currentLevel: {
//           ...currentLevel,
//           problems: updatedProblems,
//           substitutions_remaining: result.substitutions_remaining,
//         },
//         currentProblem: result.new_problem,
//         isLoading: false,
//       });
//     } catch (error) {
//       set({ error: 'Failed to substitute problem', isLoading: false });
//       console.error('Error substituting problem:', error);
//     }
//   },
//
//   // Mark problem as complete
//   markProblemComplete: async (userId: string, problemId: string, sessionId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       await completeProblem(userId, problemId, sessionId);
//
//       // Refresh both progress and level data
//       await Promise.all([
//         get().fetchLevelProgress(userId),
//         get().fetchCurrentLevel(userId),
//       ]);
//
//       set({ isLoading: false });
//     } catch (error) {
//       set({ error: 'Failed to complete problem', isLoading: false });
//       console.error('Error completing problem:', error);
//     }
//   },
//
//   // Move to next problem
//   handleMoveToNextProblem: async (userId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       await moveToNextProblem(userId);
//
//       // Refresh current level
//       await get().fetchCurrentLevel(userId);
//
//       set({ isLoading: false });
//     } catch (error) {
//       set({ error: 'Failed to move to next problem', isLoading: false });
//       console.error('Error moving to next problem:', error);
//     }
//   },
//
//   // Reset store
//   reset: () => {
//     set({
//       levelProgress: null,
//       currentLevel: null,
//       currentProblem: null,
//       isLoading: false,
//       error: null,
//     });
//   },
// }));

const FILTER_CACHE_TTL_MS = 5 * 60 * 1000;

interface ProblemFeedCacheEntry {
  problems: Problem[];
  fetchedAt: number;
}

interface FetchFilteredProblemsOptions {
  force?: boolean;
}

interface ProblemFeedStore {
  availableTypes: ProblemType[];
  selectedFilter: ProblemType | null;
  filteredProblems: Problem[];
  currentProblemIndex: number;
  isLoadingProblems: boolean;
  filterError: string | null;
  metadataLoaded: boolean;
  cache: Record<string, ProblemFeedCacheEntry>;
  fetchMetadata: () => Promise<void>;
  fetchFilteredProblems: (
    userId?: string,
    filter?: ProblemType | null,
    options?: FetchFilteredProblemsOptions,
  ) => Promise<void>;
  setFilter: (filter: ProblemType | null) => void;
  nextProblem: () => void;
  previousProblem: () => void;
  clear: () => void;
}

export const useProblemFeedStore = create<ProblemFeedStore>((set, get) => ({
  availableTypes: [],
  selectedFilter: null,
  filteredProblems: [],
  currentProblemIndex: 0,
  isLoadingProblems: false,
  filterError: null,
  metadataLoaded: false,
  cache: {},

  fetchMetadata: async () => {
    if (get().metadataLoaded) {
      return;
    }

    try {
      const metadata = await getProblemsMetadata();
      set({ availableTypes: metadata.problem_types ?? [], metadataLoaded: true });
    } catch (error) {
      console.error('Error fetching problem metadata:', error);
      set({ metadataLoaded: true });
    }
  },

  fetchFilteredProblems: async (
    userId = DEFAULT_USER_ID,
    filter = get().selectedFilter,
    options = {},
  ) => {
    const filterKey = filter ?? 'all';
    const cached = get().cache[filterKey];

    if (!options.force && cached && Date.now() - cached.fetchedAt < FILTER_CACHE_TTL_MS) {
      set({
        filteredProblems: cached.problems,
        currentProblemIndex: 0,
        isLoadingProblems: false,
        filterError: null,
      });
      return;
    }

    set({ isLoadingProblems: true, filterError: null });

    try {
      const response = await getProblems({
        user_id: userId,
        problem_type: filter ?? undefined,
        limit: 30,
      });

      const problems = shuffleArray(response.data);

      set((state) => ({
        filteredProblems: problems,
        currentProblemIndex: 0,
        isLoadingProblems: false,
        filterError: null,
        cache: {
          ...state.cache,
          [filterKey]: { problems, fetchedAt: Date.now() },
        },
      }));
    } catch (error) {
      console.error('Error fetching problems:', error);
      set({ filterError: 'Failed to load problems', isLoadingProblems: false });
    }
  },

  setFilter: (filter) => {
    set({ selectedFilter: filter, currentProblemIndex: 0 });
  },

  nextProblem: () => {
    set((state) => {
      if (state.currentProblemIndex >= state.filteredProblems.length - 1) {
        return state;
      }
      return { currentProblemIndex: state.currentProblemIndex + 1 };
    });
  },

  previousProblem: () => {
    set((state) => {
      if (state.currentProblemIndex <= 0) {
        return state;
      }
      return { currentProblemIndex: state.currentProblemIndex - 1 };
    });
  },

  clear: () => {
    set({
      filteredProblems: [],
      currentProblemIndex: 0,
      filterError: null,
    });
  },
}));

interface ToastEntry {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastStore {
  toasts: ToastEntry[];
  showToast: (message: string, type?: ToastEntry['type']) => void;
  dismissToast: (id: string) => void;
}

const createToastId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = createToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
