import { useEffect, useRef } from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when dialog opens
      confirmButtonRef.current?.focus();

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/90"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-paper-50 p-6 border-2 border-ink-950 shadow-2xl">
        <h2
          id="dialog-title"
          className="text-xl font-bold text-ink-950 mb-2"
        >
          {title}
        </h2>

        <p className="text-base text-ink-700 mb-6">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-4">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="
              min-h-[44px] px-4 py-2
              bg-paper-50 text-ink-950
              border-2 border-ink-950
              hover:bg-paper-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink-950
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="
              min-h-[44px] px-4 py-2
              bg-ink-950 text-paper-50
              hover:bg-ink-800
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink-950
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}
