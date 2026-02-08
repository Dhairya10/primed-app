import {
  type PaginatedResponse,
  type SingleResponse,
  type ProblemType,
  type DisciplineType,
  type FeedbackDetailResponse,
  type SkillFeedback,
  type UserProfileRequest,
  type UserProfileResponse,
  type UserProfileUpdateResponse,
  type ProfileScreenResponse,
  type Drill,
  type LibraryMetadata,
  type HomeScreenRecommendation,
  type GreetingResponse,
  type DrillHomeResponse,
  type DrillResponse,
  type UserSkillsResponse,
  type SkillMapResponse,
  type SkillHistoryResponse,
  type SkillDetailResponse,
  type CheckDrillEligibilityResponse,
  type DrillSessionStartResponse,
} from '@/types/api';
import { API_BASE_URL, DEFAULT_USER_ID, IS_API_ENABLED, IS_AUTH_ENABLED } from './constants';

import { getAuthHeaders } from './auth-store';

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface SessionFeedbackResponse {
  data: {
    session_id: string;
    drill_title: string;
    completed_at?: string | null;
    feedback?: {
      summary: string;
      skills: SkillFeedback[];
    } | null;
  };
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get auth headers if auth is enabled
  const authHeaders = IS_AUTH_ENABLED ? await getAuthHeaders() : {};

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      body: errorText,
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401 && IS_AUTH_ENABLED) {
      window.location.href = '/login';
    }

    throw new ApiError(
      response.status,
      response.statusText,
      errorText,
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function getVoiceAgentWebSocketUrl(sessionId: string, token?: string): string {
  const trimmedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const wsUrl = trimmedBase.startsWith('ws')
    ? trimmedBase
    : trimmedBase.replace('http://', 'ws://').replace('https://', 'wss://');
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return `${wsUrl}/api/v1/ws/drill/${sessionId}${query}`;
}

export async function getFeedbackDetail(
  sessionId: string
): Promise<FeedbackDetailResponse> {
  const response = await fetchApi<SessionFeedbackResponse>(
    `/api/v1/drill-sessions/${sessionId}/feedback`
  );
  const feedback = response.data.feedback;

  return {
    session_id: response.data.session_id,
    title: response.data.drill_title,
    completed_at: response.data.completed_at ?? new Date().toISOString(),
    evaluation_status: feedback ? 'completed' : 'pending',
    feedback_summary: feedback?.summary ?? null,
    skills_evaluated: feedback?.skills ?? [],
  };
}




// Track when drill session status was first requested (for dummy data simulation)

export async function getDrillSessionStatus(
  sessionId: string
): Promise<{
  session_id: string;
  drill_title?: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  has_transcript: boolean;
  has_feedback_summary: boolean;
}> {

  // Note: When auth is enabled, user_id is extracted from JWT token
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? `/api/v1/drill-sessions/${sessionId}/status`
    : `/api/v1/drill-sessions/${sessionId}/status?user_id=${userId}`;

  const response = await fetchApi<{
    session_id: string;
    status: string;
    started_at: string;
    completed_at?: string | null;
    duration_minutes?: number | null;
    has_transcript: boolean;
    has_feedback_summary: boolean;
  }>(endpoint);

  return {
    session_id: response.session_id,
    drill_title: (response as any).drill_title, // Cast to any because the interface definition above isn't updated yet, but we expect it from backend or will add it
    status: response.status,
    started_at: response.started_at,
    completed_at: response.completed_at ?? undefined,
    duration_minutes: response.duration_minutes ?? undefined,
    has_transcript: response.has_transcript,
    has_feedback_summary: response.has_feedback_summary,
  };
}

// POST /api/v1/drill-sessions/{session_id}/abandon - Abandon drill session
export interface DrillExitFeedback {
  reasons?: string[];
  additional_feedback?: string;
}

export async function abandonDrillSession(
  sessionId: string,
  feedback?: DrillExitFeedback
): Promise<{
  session_id: string;
  status: string;
  abandoned_at: string;
}> {


  // Note: When auth is enabled, user_id is extracted from JWT token
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? `/api/v1/drill-sessions/${sessionId}/abandon`
    : `/api/v1/drill-sessions/${sessionId}/abandon?user_id=${userId}`;

  const body: any = {};
  if (feedback) {
    body.exit_feedback = feedback;
  }

  return fetchApi(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

// User Profile APIs
export async function updateUserProfile(
  userId: string,
  profileData: UserProfileRequest
): Promise<UserProfileUpdateResponse> {


  // When auth is enabled, backend extracts user_id from JWT token
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/profile/me'
    : `/api/v1/profile/me?user_id=${userId}`;

  return fetchApi<UserProfileUpdateResponse>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

export async function getUserProfile(
  userId: string
): Promise<UserProfileResponse> {


  // When auth is enabled, backend extracts user_id from JWT token
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/profile/me'
    : `/api/v1/profile/me?user_id=${userId}`;

  return fetchApi<UserProfileResponse>(endpoint);
}

export async function getProfileScreen(): Promise<ProfileScreenResponse> {


  // When auth is enabled, backend extracts user_id from JWT token
  return fetchApi<ProfileScreenResponse>('/api/v1/profile/screen');
}

export async function getHomeScreenRecommendation(
  userId: string
): Promise<HomeScreenRecommendation> {
  const greetingEndpoint = IS_AUTH_ENABLED
    ? '/api/v1/greeting'
    : `/api/v1/greeting?user_id=${encodeURIComponent(userId)}`;
  const drillEndpoint = IS_AUTH_ENABLED
    ? '/api/v1/drills'
    : `/api/v1/drills?user_id=${encodeURIComponent(userId)}`;

  const [greetingResponse, drillResponse] = await Promise.all([
    fetchApi<SingleResponse<GreetingResponse>>(greetingEndpoint),
    fetchApi<SingleResponse<DrillHomeResponse>>(drillEndpoint),
  ]);

  const drill = drillResponse.data;



  return {
    drill: {
      id: drill.id,
      title: drill.title,
      skills_tested: drill.skills?.map((skill) => skill.name) ?? [],
      reasoning: drill.recommendation_reasoning ?? '',
      estimated_minutes: 0,
      product_logo_url: drill.product_url ?? undefined,
    },
    session_count: greetingResponse.data.session_number,
    greeting: greetingResponse.data.greeting,
  };
}

export async function getUserSkills(userId: string): Promise<UserSkillsResponse> {
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/skills/me'
    : `/api/v1/skills/me?user_id=${encodeURIComponent(userId)}`;
  const response = await fetchApi<SkillMapResponse>(endpoint);

  return {
    skills: response.skills.map((skill) => ({
      id: skill.id,
      skill_name: skill.name,
      skill_description: '',
      score: skill.score,
      zone: skill.zone ?? 'untested',
      tested: skill.is_tested,
    })),
    total_sessions: response.total_completed_sessions,
    last_updated: null,
  };
}

export async function getSkillDetail(
  userId: string,
  skillId: string
): Promise<SkillDetailResponse> {
  const endpoint = IS_AUTH_ENABLED
    ? `/api/v1/skills/me/${encodeURIComponent(skillId)}/history`
    : `/api/v1/skills/me/${encodeURIComponent(skillId)}/history?user_id=${encodeURIComponent(userId)}`;
  const response = await fetchApi<SkillHistoryResponse>(endpoint);

  return {
    skill_name: response.skill.name,
    skill_description: response.skill.description ?? '',
    times_tested: response.total_tested,
    sessions: response.sessions.map((session) => ({
      session_id: session.session_id,
      drill_title: session.drill_title,
      drill_logo_url: session.product_logo_url ?? undefined,
      completed_at: session.completed_at,
      status: session.performance as SkillDetailResponse['sessions'][number]['status'],
    })),
  };
}
// Drills API

// GET /api/v1/library/drills - Get 5 drills for carousel
export async function getRecommendedDrills(): Promise<PaginatedResponse<Drill>> {
  return getLibraryDrills({ limit: 5 });
}

// GET /api/v1/library/drills - Browse/search drills with filtering
export async function getLibraryDrills(params: {
  query?: string;
  problem_type?: ProblemType;
  skill?: string;
  unattempted_only?: boolean;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<Drill>> {


  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.problem_type) searchParams.set('problem_type', params.problem_type);
  if (params.skill) searchParams.set('skills', params.skill);
  if (params.unattempted_only) searchParams.set('unattempted_only', 'true');
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  type LibraryDrillResponse = DrillResponse & {
    display_title?: string;
    discipline?: DisciplineType;
    product_logo_url?: string | null;
    skills_tested?: string[];
    is_attempted?: boolean;
  };

  const response = await fetchApi<PaginatedResponse<LibraryDrillResponse>>(
    `/api/v1/library/drills${query ? `?${query}` : ''}`
  );

  return {
    ...response,
    data: response.data.map((drill) => ({
      id: drill.id,
      display_title: drill.display_title ?? drill.title,
      discipline: drill.discipline ?? 'product',
      problem_type: (drill.problem_type ?? 'behavioral') as ProblemType,
      skills_tested: drill.skills_tested ?? drill.skills?.map((skill) => skill.name),
      product_logo_url: drill.product_logo_url ?? drill.product_url ?? null,
      is_attempted: drill.is_attempted ?? drill.is_completed ?? false,
    })),
  };
}

// GET /api/v1/library/metadata - Get filter metadata
export async function getLibraryMetadata(): Promise<SingleResponse<LibraryMetadata>> {


  return fetchApi('/api/v1/library/metadata');
}

// GET /api/v1/drill-sessions/check-eligibility - Check if user can start a drill
export async function checkDrillEligibility(): Promise<CheckDrillEligibilityResponse> {
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      eligible: true,
      num_drills: 10,
      message: 'You have 10 drills remaining',
    };
  }

  return fetchApi('/api/v1/drill-sessions/check-eligibility');
}

// POST /api/v1/drill-sessions/start - Start drill session
export async function startDrillSession(
  problemId: string
): Promise<DrillSessionStartResponse> {


  // When auth is enabled, backend extracts user_id from JWT token
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/drill-sessions/start'
    : `/api/v1/drill-sessions/start?user_id=${userId}`;

  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify({ problem_id: problemId }),
  });
}

// GET /api/v1/dashboard/drills - Get drill dashboard history
export async function getDashboardDrills(params: {
  user_id: string;
  limit?: number;
  offset?: number;
}): Promise<import('@/types/api').DashboardSessionsResponse> {


  const searchParams = new URLSearchParams();

  // Only add user_id when auth is disabled
  if (!IS_AUTH_ENABLED) {
    searchParams.set('user_id', params.user_id);
  }
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/dashboard/drills${query ? `?${query}` : ''}`);
}
