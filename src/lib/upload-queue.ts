import type { UploadQueueItem, InterviewEndReason } from '@/types/interview';
import { addUploadToQueue } from './indexed-db';

export function isBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
}

export async function queueUpload(
  sessionId: string,
  audioBlob: Blob,
  transcript: Record<string, unknown>,
  reason: InterviewEndReason,
  durationSeconds: number,
  authToken: string
): Promise<void> {
  const item: UploadQueueItem = {
    id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    audioBlob,
    transcript,
    reason,
    durationSeconds,
    authToken,
    createdAt: Date.now(),
  };

  await addUploadToQueue(item);
}

export async function triggerBackgroundSync(): Promise<void> {
  if (!isBackgroundSyncSupported()) {
    throw new Error('Background Sync not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  // Type assertion needed as TypeScript doesn't have built-in types for Background Sync API
  await (registration as any).sync.register('interview-audio-upload');
}
