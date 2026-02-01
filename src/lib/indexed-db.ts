// IndexedDB utilities for Service Worker upload queue
import type { UploadQueueItem } from '@/types/interview';

const DB_NAME = 'primed-interview-db';
const DB_VERSION = 1;
const UPLOAD_STORE_NAME = 'upload-queue';

export async function openDatabase(): Promise<IDBDatabase> {
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

export async function addUploadToQueue(item: UploadQueueItem): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.add(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getUploadFromQueue(id: string): Promise<UploadQueueItem | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readonly');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPendingUploads(): Promise<UploadQueueItem[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readonly');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removeUploadFromQueue(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([UPLOAD_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(UPLOAD_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearExpiredUploads(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
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
