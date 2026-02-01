import { create } from 'zustand';

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
