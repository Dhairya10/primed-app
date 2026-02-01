import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    confirmButtonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className="
          bg-black border-2 border-white/30
          w-full max-w-md
          animate-in slide-in-from-bottom fade-in duration-200
          p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 id="dialog-title" className="text-xl font-semibold text-white mb-2">
              {title}
            </h2>
            <p className="text-base text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="min-h-[44px]"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            variant="primary"
            className="min-h-[44px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
