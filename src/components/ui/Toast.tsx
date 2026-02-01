interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void;
}

function getIntentClasses(type: ToastItem['type']) {
  switch (type) {
    case 'success':
      return 'border-green-300/40 bg-green-950/50 text-green-100';
    case 'error':
      return 'border-red-400/40 bg-red-950/50 text-red-100';
    default:
      return 'border-white/20 bg-white/10 text-white';
  }
}

export function Toast({ id, message, type = 'info', onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      className={`flex transform items-center justify-between gap-6 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-200 ${getIntentClasses(type)}`}
    >
      <span className="text-sm font-medium leading-snug">{message}</span>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/60 transition-colors duration-150 hover:border-white/40 hover:text-white"
        aria-label="Dismiss notification"
      >
        Close
      </button>
    </div>
  );
}

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:pr-8">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
