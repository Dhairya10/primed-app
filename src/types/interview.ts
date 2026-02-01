// Interview Session Types (matches OpenAPI spec)
export interface CheckEligibilityResponse {
  eligible: boolean; // Whether user is eligible to start an interview
  num_interviews: number; // Number of interviews remaining
  message: string; // Human-readable message about eligibility status
}

export interface SessionStartResponse {
  session_id: string;
  signed_url: string; // ElevenLabs signed WebSocket URL
  status: string; // "ready", "active", "failed"
  message?: string | null; // Optional message
  interview: {
    id: string;
    title: string;
    discipline: string; // "product", "design", "engineering", "marketing"
    estimated_duration_minutes: number;
    [key: string]: any; // Allow additional fields
  };
  started_at: string;
}

export interface AbandonResponse {
  session_id: string;
  status: 'abandoned';
  abandoned_at: string;
}

export interface EndSessionResponse {
  session_id: string;
  status: string;
  completed_at: string;
  duration_minutes: number;
  transcript: Record<string, unknown>;
  audio_recording_url: string;
}

export interface SessionStatusResponse {
  session_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  has_transcript: boolean;
  has_audio_recording: boolean;
  evaluation_status: string;
}

// Interview End Reasons
export type InterviewEndReason = 'natural_conclusion' | 'user_initiated' | 'timeout';

// Upload Status
export type UploadStatus = 'idle' | 'queuing' | 'syncing' | 'completed' | 'failed';

// IndexedDB Upload Queue Item
export interface UploadQueueItem {
  id: string;
  sessionId: string;
  audioBlob: Blob;
  transcript: Record<string, unknown>;
  reason: InterviewEndReason;
  durationSeconds: number;
  authToken: string;
  createdAt: number;
}

// Service Worker Message Types
export type ServiceWorkerMessageType = 'UPLOAD_SUCCESS' | 'UPLOAD_FAILED' | 'UPLOAD_PROGRESS';

export interface ServiceWorkerMessage {
  type: ServiceWorkerMessageType;
  sessionId: string;
  error?: string;
  progress?: number;
}
