import {
  type Problem,
  type PaginatedResponse,
  type SingleResponse,
  type ProblemsMetadata,
  type InterviewsMetadata,
  type InterviewSessionCreate,
  type InterviewSession,
  type DomainType,
  type ProblemType,
  type DisciplineType,
  type DashboardResponse,
  type FeedbackDetailResponse,
  type UserProfileRequest,
  type UserProfileResponse,
  type UserProfileUpdateResponse,
  type ProfileScreenResponse,
  type Drill,
  type SearchResult,
  type LibraryMetadata,
  type HomeScreenRecommendation,
  type UserSkillsResponse,
  type SkillDetailResponse,
  type CheckDrillEligibilityResponse,
  type DrillSessionStartResponse,
} from '@/types/api';
import type {
  SessionStartResponse,
  AbandonResponse,
  CheckEligibilityResponse,
} from '@/types/interview';
import { API_BASE_URL, DEFAULT_USER_ID, IS_API_ENABLED, IS_AUTH_ENABLED } from './constants';
import {
  filterDummyProblems,
  DUMMY_METADATA,
  getDummyDashboard,
  getDummyFeedbackDetail,
} from './dummy-data';
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

// Get all interviews with attempt status (authenticated endpoint)
export async function getInterviews(
  params: { limit?: number; offset?: number } = {}
): Promise<PaginatedResponse<import('@/types/api').Interview>> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Convert dummy problems to interviews format
    const dummyData = filterDummyProblems({});
    return {
      ...dummyData,
      data: dummyData.data.map(p => ({
        id: p.id,
        title: p.title,
        discipline: 'product' as DisciplineType,
        product_logo_url: p.product_logo_url ?? null,
        description: p.description,
        estimated_duration_minutes: p.estimated_duration_minutes ?? 45,
        is_attempted: p.is_attempted ?? false,
        last_attempted_at: p.last_attempted_at ?? null,
      })),
    };
  }

  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/interviews${query ? `?${query}` : ''}`);
}

// Legacy function - kept for backward compatibility
// @deprecated Use getInterviews() or searchInterviews() instead
export interface GetProblemsParams {
  search?: string;
  domain?: DomainType;
  problem_type?: ProblemType;
  limit?: number;
  offset?: number;
  user_id?: string;
}

export async function getProblems(
  params: GetProblemsParams = {}
): Promise<PaginatedResponse<Problem>> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return filterDummyProblems(params);
  }

  // For now, convert to use search if search query is provided
  if (params.search) {
    return searchInterviews({
      query: params.search,
      limit: params.limit,
      offset: params.offset,
    }) as any; // Type compatibility shim
  }

  // Otherwise use getInterviews
  return getInterviews({
    limit: params.limit,
    offset: params.offset
  }) as any; // Type compatibility shim
}

// Legacy function - kept for backward compatibility
// @deprecated Use getInterviewsMetadata() instead
export async function getProblemsMetadata(): Promise<ProblemsMetadata> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return DUMMY_METADATA;
  }

  // Return empty metadata since the interviews API doesn't filter by domain/problem_type
  return {
    domains: [],
    problem_types: [],
  };
}

export async function getInterviewsMetadata(): Promise<InterviewsMetadata> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      disciplines: ['product', 'design', 'engineering', 'marketing'] as DisciplineType[],
    };
  }

  const response = await fetchApi<{ data: InterviewsMetadata }>(
    '/api/v1/interviews/metadata'
  );
  return response.data;
}

export interface SearchInterviewsParams {
  query: string;
  limit?: number;
  offset?: number;
}

export async function searchInterviews(
  params: SearchInterviewsParams
): Promise<PaginatedResponse<SearchResult>> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Filter dummy problems by search query
    const filtered = filterDummyProblems({ search: params.query, limit: params.limit, offset: params.offset });

    // Convert Problem to SearchResult with 'interview' type
    const interviewResults: SearchResult[] = filtered.data.map(p => ({
      type: 'interview' as const,
      id: p.id,
      title: p.title,
      discipline: 'product' as DisciplineType,
      product_logo_url: p.product_logo_url ?? null,
      description: p.description,
      estimated_duration_minutes: p.estimated_duration_minutes ?? 45,
    }));

    // Add dummy drills that match the search query
    const allDrills: SearchResult[] = [
      {
        type: 'drill' as const,
        id: 'drill-1',
        title: 'Design a Health Tracking Feature',
        display_title: 'Design a Health Tracking Feature',
        discipline: 'product' as DisciplineType,
        problem_type: 'product_design' as ProblemType,
      },
      {
        type: 'drill' as const,
        id: 'drill-2',
        title: 'Improve User Engagement Metrics',
        display_title: 'Improve User Engagement Metrics',
        discipline: 'product' as DisciplineType,
        problem_type: 'metrics' as ProblemType,
      },
      {
        type: 'drill' as const,
        id: 'drill-4',
        title: 'Prioritize Feature Roadmap',
        display_title: 'Prioritize Feature Roadmap',
        discipline: 'product' as DisciplineType,
        problem_type: 'product_strategy' as ProblemType,
      },
      {
        type: 'drill' as const,
        id: 'drill-27',
        title: 'Improve Instagram Stories',
        display_title: 'Improve Instagram Stories',
        discipline: 'product' as DisciplineType,
        problem_type: 'product_improvement' as ProblemType,
      },
      {
        type: 'drill' as const,
        id: 'drill-5',
        title: 'Solve Payment Flow Issue',
        display_title: 'Solve Payment Flow Issue',
        discipline: 'product' as DisciplineType,
        problem_type: 'problem_solving' as ProblemType,
      },
      {
        type: 'drill' as const,
        id: 'drill-3',
        title: 'Estimate Market Size for New Product',
        display_title: 'Estimate Market Size for New Product',
        discipline: 'product' as DisciplineType,
        problem_type: 'guestimation' as ProblemType,
      },
    ];

    // Filter drills by search query
    const lowerQuery = params.query.toLowerCase();
    const drillResults = allDrills.filter(drill =>
      drill.title.toLowerCase().includes(lowerQuery)
    );

    // Mix interviews and drills together
    const mixedResults = [...interviewResults, ...drillResults];

    // Apply limit if specified
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = mixedResults.slice(offset, offset + limit);

    return {
      data: paginatedResults,
      count: paginatedResults.length,
      total: mixedResults.length,
      limit,
      offset,
      has_more: offset + limit < mixedResults.length,
    };
  }

  const searchParams = new URLSearchParams();
  searchParams.set('query', params.query);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/interviews/search${query ? `?${query}` : ''}`);
}

// Note: getNextInterviewProblem() removed - part of level/interview-mode system

// Legacy function - createInterviewSession is replaced by startInterviewSession
// @deprecated Use startInterviewSession() instead
export async function createInterviewSession(
  data: InterviewSessionCreate,
  userId: string
): Promise<InterviewSession> {
  // This function is deprecated - redirect to startInterviewSession
  const response = await startInterviewSession(data.problem_id);

  // Convert SessionStartResponse to InterviewSession for backward compatibility
  return {
    id: response.session_id,
    user_id: userId,
    problem_id: data.problem_id,
    status: response.status,
    started_at: response.started_at,
  };
}

export interface GetDashboardParams {
  user_id: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export async function getDashboard(
  params: GetDashboardParams
): Promise<DashboardResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getDummyDashboard(params);
  }

  const searchParams = new URLSearchParams();

  // Only add user_id when auth is disabled
  if (!IS_AUTH_ENABLED) {
    searchParams.set('user_id', params.user_id);
  }
  if (params.status) searchParams.set('status', params.status);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/dashboard?${query}`);
}

export async function getFeedbackDetail(
  sessionId: string
): Promise<FeedbackDetailResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getDummyFeedbackDetail(sessionId);
  }

  return fetchApi(`/api/v1/sessions/${sessionId}/feedback`);
}

// Note: regenerateFeedback() removed - feature not in OpenAPI spec

// Interview Session APIs (Backend handles ElevenLabs connection internally)

/**
 * Check if user is eligible to start a new interview.
 *
 * This lightweight endpoint checks user's num_interviews without creating a session.
 * Frontend should call this before navigating to interview UI.
 *
 * @returns Eligibility status with remaining interview count and message
 */
export async function checkInterviewEligibility(): Promise<CheckEligibilityResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      eligible: true,
      num_interviews: 5,
      message: 'You have 5 interviews remaining',
    };
  }

  // When auth is enabled, backend extracts user_id from JWT token
  const endpoint = '/api/v1/interviews/sessions/check-eligibility';

  return fetchApi<CheckEligibilityResponse>(endpoint);
}

export async function startInterviewSession(
  interviewId: string
): Promise<SessionStartResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      session_id: `session-${Date.now()}`,
      signed_url: 'wss://api.elevenlabs.io/v1/convai/conversation?agent_id=dummy',
      status: 'ready',
      message: 'Session started successfully',
      interview: {
        id: interviewId,
        title: 'Design a Health Tracking Feature',
        discipline: 'product',
        estimated_duration_minutes: 45,
      },
      started_at: new Date().toISOString(),
    };
  }

  // Note: When auth is enabled, user_id is extracted from JWT token
  // When auth is disabled, use default user_id for backward compatibility
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/interviews/sessions/start'
    : `/api/v1/interviews/sessions/start?user_id=${userId}`;

  try {
    const response = await fetchApi<SessionStartResponse>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify({ interview_id: interviewId }),
      }
    );
    return response;
  } catch (err) {
    // Handle 429 (attempt limit exceeded) error specially
    if (err instanceof ApiError && err.status === 429) {
      try {
        const errorData = JSON.parse(err.body);
        // Re-throw with parsed error data attached
        const error = new Error(errorData.message || 'You have reached the maximum number of attempts for this interview.');
        (error as any).status = 429;
        (error as any).error = errorData.error;
        (error as any).attempts_used = errorData.attempts_used;
        (error as any).max_attempts = errorData.max_attempts;
        throw error;
      } catch (parseErr) {
        // If we can't parse the error body, rethrow the original error
        throw err;
      }
    }
    throw err;
  }
}

// Interview Exit Feedback - sent with abandon
export interface InterviewExitFeedback {
  reasons?: string[];
  additional_feedback?: string;
}

export async function abandonInterviewSession(
  sessionId: string,
  feedback?: InterviewExitFeedback
): Promise<AbandonResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (feedback) {
      console.log('Exit feedback (dummy mode):', feedback);
    }
    return {
      session_id: sessionId,
      status: 'abandoned',
      abandoned_at: new Date().toISOString(),
    };
  }

  // Note: When auth is enabled, user_id is extracted from JWT token
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? `/api/v1/interviews/sessions/${sessionId}/abandon`
    : `/api/v1/interviews/sessions/${sessionId}/abandon?user_id=${userId}`;

  const body: any = {};
  if (feedback) {
    body.exit_feedback = feedback;
  }

  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Note: endInterviewSession() removed - replaced by ElevenLabs webhook flow
// Resume token API removed - backend handles Gemini reconnection internally

// Track when session status was first requested (for dummy data simulation)
const sessionStatusStartTimes: Record<string, number> = {};

export async function getSessionStatus(
  sessionId: string
): Promise<import('@/types/interview').SessionStatusResponse> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Simulate feedback generation taking time (15 seconds for demo purposes)
    if (!sessionStatusStartTimes[sessionId]) {
      sessionStatusStartTimes[sessionId] = Date.now();
    }

    const elapsedSeconds = (Date.now() - sessionStatusStartTimes[sessionId]) / 1000;
    const evaluationStatus = elapsedSeconds > 15 ? 'completed' : 'pending';

    return {
      session_id: sessionId,
      status: 'completed',
      started_at: new Date().toISOString(),
      has_transcript: true,
      has_audio_recording: true,
      evaluation_status: evaluationStatus,
    };
  }

  // Note: When auth is enabled, user_id is extracted from JWT token
  const userId = DEFAULT_USER_ID;
  const endpoint = IS_AUTH_ENABLED
    ? `/api/v1/interviews/sessions/${sessionId}/status`
    : `/api/v1/interviews/sessions/${sessionId}/status?user_id=${userId}`;

  return fetchApi(endpoint);
}

// Note: All Level System APIs removed - feature not in current OpenAPI spec
// Removed functions:
// - getLevelProgress()
// - getCurrentLevel()
// - getCurrentProblem()
// - substituteProblem()
// - completeProblem()
// - moveToNextProblem()
// - getInterviewModeStatus()

// Frameworks API
// Note: Frameworks are now handled directly in frontend via JSON data
// See: src/lib/frameworks/ for the new framework implementation

// Note: submitInterviewExitFeedback() removed - not in OpenAPI spec

// User Profile APIs
export async function updateUserProfile(
  userId: string,
  profileData: UserProfileRequest
): Promise<UserProfileUpdateResponse> {
  if (!IS_API_ENABLED) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('User profile updated (dummy):', profileData);

    // Store in localStorage for dummy mode
    localStorage.setItem(
      `profile-${userId}`,
      JSON.stringify({
        onboarding_completed: profileData.onboarding_completed ?? true,
        discipline: profileData.discipline,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        bio: profileData.bio,
        // Keep legacy fields for backward compatibility
        selected_domains: profileData.selected_domains,
        full_name: profileData.full_name,
      })
    );

    return {
      discipline: profileData.discipline,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      onboarding_completed: profileData.onboarding_completed ?? true,
      message: 'Profile updated successfully',
    };
  }

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
  if (!IS_API_ENABLED) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check localStorage for dummy mode
    const stored = localStorage.getItem(`profile-${userId}`);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        id: `profile-${userId}`,
        user_id: userId,
        discipline: data.discipline,
        first_name: data.first_name || '',
        last_name: data.last_name,
        onboarding_completed: data.onboarding_completed ?? false,
        bio: data.bio,
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Legacy fields
        selected_domains: data.selected_domains,
        full_name: data.full_name,
      };
    }

    // Return default profile if no data found
    return {
      id: `profile-${userId}`,
      user_id: userId,
      first_name: '',
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // When auth is enabled, backend extracts user_id from JWT token
  const endpoint = IS_AUTH_ENABLED
    ? '/api/v1/profile/me'
    : `/api/v1/profile/me?user_id=${userId}`;

  return fetchApi<UserProfileResponse>(endpoint);
}

export async function getProfileScreen(): Promise<ProfileScreenResponse> {
  if (!IS_API_ENABLED) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return dummy data for development
    return {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      num_interviews: 5,
      discipline: 'product',
    };
  }

  // When auth is enabled, backend extracts user_id from JWT token
  return fetchApi<ProfileScreenResponse>('/api/v1/profile/screen');
}

export async function getHomeScreenRecommendation(
  userId: string
): Promise<HomeScreenRecommendation> {
  return fetchApi<HomeScreenRecommendation>(`/api/v1/users/${userId}/home-screen`);
}

export async function getUserSkills(userId: string): Promise<UserSkillsResponse> {
  return fetchApi<UserSkillsResponse>(`/api/v1/users/${userId}/skills`);
}

export async function getSkillDetail(
  userId: string,
  skillName: string
): Promise<SkillDetailResponse> {
  return fetchApi<SkillDetailResponse>(
    `/api/v1/users/${userId}/skills/${encodeURIComponent(skillName)}/history`
  );
}
// Drills API

// GET /api/v1/drills - Get 5 recommended drills
export async function getRecommendedDrills(): Promise<PaginatedResponse<Drill>> {
  if (!IS_API_ENABLED) {
    // Simulate API call with dummy data - Return diverse set of drills
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: [
        {
          id: 'drill-1',
          display_title: 'Design a Health Tracking Feature',
          discipline: 'product',
          problem_type: 'product_design',
        },
        {
          id: 'drill-2',
          display_title: 'Improve User Engagement Metrics',
          discipline: 'product',
          problem_type: 'metrics',
        },
        {
          id: 'drill-4',
          display_title: 'Prioritize Feature Roadmap',
          discipline: 'product',
          problem_type: 'product_strategy',
        },
        {
          id: 'drill-27',
          display_title: 'Improve Instagram Stories',
          discipline: 'product',
          problem_type: 'product_improvement',
        },
        {
          id: 'drill-5',
          display_title: 'Solve Payment Flow Issue',
          discipline: 'product',
          problem_type: 'problem_solving',
        },
      ],
      count: 5,
      total: 5,
      limit: 5,
      offset: 0,
      has_more: false,
    };
  }

  return fetchApi('/api/v1/drills?limit=5');
}

// GET /api/v1/library/interviews - Browse/search interviews
export async function getLibraryInterviews(params: {
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<import('@/types/api').Interview>> {
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Filter dummy data by search query
    const filtered = filterDummyProblems({
      search: params.query,
      limit: params.limit,
      offset: params.offset
    });

    // Convert to Interview format
    return {
      ...filtered,
      data: filtered.data.map(p => ({
        id: p.id,
        title: p.title,
        discipline: 'product' as DisciplineType,
        product_logo_url: p.product_logo_url ?? null,
        description: p.description,
        estimated_duration_minutes: p.estimated_duration_minutes ?? 45,
        is_attempted: p.is_attempted ?? false,
        last_attempted_at: p.last_attempted_at ?? null,
      })),
    };
  }

  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/library/interviews${query ? `?${query}` : ''}`);
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
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate comprehensive dummy drills for testing pagination, filtering, and search
    const allDrills: Drill[] = [
      // Product Design (6 drills)
      {
        id: 'drill-1',
        display_title: 'Design a Health Tracking Feature',
        discipline: 'product',
        problem_type: 'product_design',
      },
      {
        id: 'drill-6',
        display_title: 'Design a Social Messaging Experience',
        discipline: 'product',
        problem_type: 'product_design',
      },
      {
        id: 'drill-11',
        display_title: 'Design an E-commerce Checkout Flow',
        discipline: 'product',
        problem_type: 'product_design',
      },
      {
        id: 'drill-16',
        display_title: 'Design a Video Streaming Platform',
        discipline: 'product',
        problem_type: 'product_design',
      },
      {
        id: 'drill-21',
        display_title: 'Design a Food Delivery App',
        discipline: 'product',
        problem_type: 'product_design',
      },
      {
        id: 'drill-26',
        display_title: 'Design a Fitness Tracking Dashboard',
        discipline: 'product',
        problem_type: 'product_design',
      },

      // Metrics (5 drills)
      {
        id: 'drill-2',
        display_title: 'Improve User Engagement Metrics',
        discipline: 'product',
        problem_type: 'metrics',
      },
      {
        id: 'drill-7',
        display_title: 'Analyze Subscription Churn Rate',
        discipline: 'product',
        problem_type: 'metrics',
      },
      {
        id: 'drill-12',
        display_title: 'Optimize Conversion Funnel Metrics',
        discipline: 'product',
        problem_type: 'metrics',
      },
      {
        id: 'drill-17',
        display_title: 'Define Success Metrics for New Feature',
        discipline: 'product',
        problem_type: 'metrics',
      },
      {
        id: 'drill-22',
        display_title: 'Measure Product-Market Fit',
        discipline: 'product',
        problem_type: 'metrics',
      },

      // Guestimation (5 drills)
      {
        id: 'drill-3',
        display_title: 'Estimate Market Size for New Product',
        discipline: 'product',
        problem_type: 'guestimation',
      },
      {
        id: 'drill-8',
        display_title: 'Calculate Revenue Potential',
        discipline: 'product',
        problem_type: 'guestimation',
      },
      {
        id: 'drill-13',
        display_title: 'Estimate Daily Active Users Growth',
        discipline: 'product',
        problem_type: 'guestimation',
      },
      {
        id: 'drill-18',
        display_title: 'Calculate Server Capacity Needs',
        discipline: 'product',
        problem_type: 'guestimation',
      },
      {
        id: 'drill-23',
        display_title: 'Estimate Customer Acquisition Cost',
        discipline: 'product',
        problem_type: 'guestimation',
      },

      // Product Strategy (5 drills)
      {
        id: 'drill-4',
        display_title: 'Prioritize Feature Roadmap',
        discipline: 'product',
        problem_type: 'product_strategy',
      },
      {
        id: 'drill-9',
        display_title: 'Develop Go-to-Market Strategy',
        discipline: 'product',
        problem_type: 'product_strategy',
      },
      {
        id: 'drill-14',
        display_title: 'Plan Product Expansion Strategy',
        discipline: 'product',
        problem_type: 'product_strategy',
      },
      {
        id: 'drill-19',
        display_title: 'Create Competitive Positioning Strategy',
        discipline: 'product',
        problem_type: 'product_strategy',
      },
      {
        id: 'drill-24',
        display_title: 'Define Product Vision and Strategy',
        discipline: 'product',
        problem_type: 'product_strategy',
      },

      // Problem Solving (5 drills)
      {
        id: 'drill-5',
        display_title: 'Solve Payment Flow Issue',
        discipline: 'product',
        problem_type: 'problem_solving',
      },
      {
        id: 'drill-10',
        display_title: 'Debug User Onboarding Drop-off',
        discipline: 'product',
        problem_type: 'problem_solving',
      },
      {
        id: 'drill-15',
        display_title: 'Fix Search Result Relevance',
        discipline: 'product',
        problem_type: 'problem_solving',
      },
      {
        id: 'drill-20',
        display_title: 'Resolve Performance Bottleneck',
        discipline: 'product',
        problem_type: 'problem_solving',
      },
      {
        id: 'drill-25',
        display_title: 'Address Security Vulnerability',
        discipline: 'product',
        problem_type: 'problem_solving',
      },

      // Product Improvement (4 drills)
      {
        id: 'drill-27',
        display_title: 'Improve Instagram Stories',
        discipline: 'product',
        problem_type: 'product_improvement',
      },
      {
        id: 'drill-28',
        display_title: 'Enhance Spotify Recommendations',
        discipline: 'product',
        problem_type: 'product_improvement',
      },
      {
        id: 'drill-29',
        display_title: 'Improve Uber Driver Experience',
        discipline: 'product',
        problem_type: 'product_improvement',
      },
      {
        id: 'drill-30',
        display_title: 'Enhance LinkedIn Job Search',
        discipline: 'product',
        problem_type: 'product_improvement',
      },

      // Behavioral (5 drills)
      {
        id: 'drill-31',
        display_title: 'Tell Me About a Time You Failed',
        discipline: 'product',
        problem_type: 'behavioral',
      },
      {
        id: 'drill-32',
        display_title: 'Describe a Conflict with a Team Member',
        discipline: 'product',
        problem_type: 'behavioral',
      },
      {
        id: 'drill-33',
        display_title: 'Share Your Greatest Professional Achievement',
        discipline: 'product',
        problem_type: 'behavioral',
      },
      {
        id: 'drill-34',
        display_title: 'Discuss a Time You Influenced Without Authority',
        discipline: 'product',
        problem_type: 'behavioral',
      },
      {
        id: 'drill-35',
        display_title: 'Describe How You Handle Ambiguity',
        discipline: 'product',
        problem_type: 'behavioral',
      },
    ];

    // Filter by problem type if specified
    let filtered = allDrills;
    if (params.problem_type) {
      filtered = allDrills.filter((d) => d.problem_type === params.problem_type);
    }

    // Filter by search query if specified
    if (params.query) {
      const lowerQuery = params.query.toLowerCase();
      filtered = filtered.filter((d) =>
        d.display_title.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply pagination
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedData = filtered.slice(offset, offset + limit);

    return {
      data: paginatedData,
      count: paginatedData.length,
      total: filtered.length,
      limit,
      offset,
      has_more: offset + limit < filtered.length,
    };
  }

  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.problem_type) searchParams.set('problem_type', params.problem_type);
  if (params.skill) searchParams.set('skill', params.skill);
  if (params.unattempted_only) searchParams.set('unattempted_only', 'true');
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return fetchApi(`/api/v1/library/drills${query ? `?${query}` : ''}`);
}

// GET /api/v1/library/metadata - Get filter metadata
export async function getLibraryMetadata(): Promise<SingleResponse<LibraryMetadata>> {
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      data: {
        problem_types: [
          'behavioral',
          'guestimation',
          'metrics',
          'problem_solving',
          'product_design',
          'product_improvement',
          'product_strategy',
        ],
        skills: [],
      },
    };
  }

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
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      session_id: `drill-session-${Date.now()}`,
      signed_url: 'wss://api.elevenlabs.io/v1/convai/conversation?agent_id=dummy-drill',
      status: 'ready',
      message: 'Drill session started successfully',
      problem: {
        id: problemId,
        title: 'Drill Practice',
        display_title: 'Design a Health Tracking Feature',
        description: 'Practice your product design skills',
        discipline: 'product',
        problem_type: 'product_design',
      },
      started_at: new Date().toISOString(),
    };
  }

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
}): Promise<import('@/types/api').DrillsDashboardResponse> {
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const { getDummyDashboardDrills } = await import('./dummy-data');
    return getDummyDashboardDrills(params);
  }

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
