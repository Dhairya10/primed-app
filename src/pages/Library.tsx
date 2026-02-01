import { ToastViewport } from '@/components/ui/Toast';
import { useToastStore } from '@/lib/store';
import { DrillsTab } from '@/components/library/DrillsTab';

export function Library() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-[88px] pb-[88px] md:pb-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">All Drills</h1>
            <p className="text-sm text-white/60">
              Pick a drill and start practicing, each one takes about 15–20 minutes
            </p>
          </div>

          <DrillsTab />
        </div>
      </main>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
