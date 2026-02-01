import { Button } from '@/components/ui/Button';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmationDialogProps) {
  const variantColors = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-900 border border-white/10 rounded-lg max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${variantColors[variant]}`}>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button variant="secondary" onClick={onCancel} fullWidth>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} fullWidth>
            {confirmLabel}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
