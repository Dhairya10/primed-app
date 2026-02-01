/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// ============================================================================
// IndexedDB utilities inlined (no imports allowed in service workers)
// ============================================================================
const DB_NAME = 'primed-interview-db';
const DB_VERSION = 1;
const UPLOAD_STORE_NAME = 'upload-queue';

async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(UPLOAD_STORE_NAME)) {
        const objectStore = db.createObjectStore(UPLOAD_STORE_NAME, {
          keyPath: 'id',
        });
        objectStore.createIndex('sessionId', 'sessionId', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

async function getAllPendingUploads(): Promise<any[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readonly');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removeUploadFromQueue(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clearExpiredUploads(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
  const db = await openDatabase();
  const now = Date.now();
  const uploads = await getAllPendingUploads();

  const expiredIds = uploads
    .filter((upload) => now - upload.createdAt > maxAgeMs)
    .map((upload) => upload.id);

  if (expiredIds.length === 0) return;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);

    let completed = 0;
    expiredIds.forEach((id) => {
      const request = store.delete(id);
      request.onsuccess = () => {
        completed++;
        if (completed === expiredIds.length) {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

// ============================================================================
// Service Worker Logic
// ============================================================================

interface SyncEvent extends ExtendableEvent {
  tag: string;
}

const API_BASE_URL = 'https://3a43800cf648.ngrok-free.app'; // Backend URL for audio upload

// Service Worker activation - clear expired uploads
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearExpiredUploads(24 * 60 * 60 * 1000) // 24 hours
      .then(() => self.clients.claim())
  );
});

// Handle background sync events
self.addEventListener('sync', (event: Event) => {
  const syncEvent = event as SyncEvent;
  if (syncEvent.tag === 'interview-audio-upload') {
    syncEvent.waitUntil(processUploadQueue());
  }
});

async function processUploadQueue(): Promise<void> {
  try {
    const pendingUploads = await getAllPendingUploads();
    
    for (const upload of pendingUploads) {
      try {
        await uploadInterview(upload);
        await removeUploadFromQueue(upload.id);
        await notifyClient(upload.sessionId, 'UPLOAD_SUCCESS');
      } catch (error) {
        console.error('Upload failed:', error);
        await notifyClient(upload.sessionId, 'UPLOAD_FAILED', String(error));
        // Let Background Sync retry automatically
        throw error;
      }
    }
  } catch (error) {
    console.error('Error processing upload queue:', error);
    throw error;
  }
}

async function uploadInterview(upload: any): Promise<void> {
  const formData = new FormData();
  formData.append('audio', upload.audioBlob, 'interview.webm');
  formData.append('transcript', JSON.stringify(upload.transcript));
  formData.append('reason', upload.reason);
  formData.append('duration_seconds', upload.durationSeconds.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/interviews/sessions/${upload.sessionId}/end`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upload.authToken}`,
        'ngrok-skip-browser-warning': 'true', // Bypass ngrok browser warning
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
}

async function notifyClient(
  sessionId: string,
  type: 'UPLOAD_SUCCESS' | 'UPLOAD_FAILED',
  error?: string
): Promise<void> {
  const clients = await self.clients.matchAll({ type: 'window' });
  
  for (const client of clients) {
    client.postMessage({
      type,
      sessionId,
      error,
    });
  }
}

// Keep the service worker alive
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

export {};
