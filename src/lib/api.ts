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
import { getDummyFeedbackDetail } from './dummy-data';
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
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getDummyFeedbackDetail(sessionId);
  }

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
const drillSessionStatusStartTimes: Record<string, number> = {};

export async function getDrillSessionStatus(
  sessionId: string
): Promise<{
  session_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  has_transcript: boolean;
  has_feedback_summary: boolean;
}> {
  // Use dummy data when API is disabled
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Simulate feedback generation taking time (15 seconds for demo purposes)
    if (!drillSessionStatusStartTimes[sessionId]) {
      drillSessionStatusStartTimes[sessionId] = Date.now();
    }

    const elapsedSeconds = (Date.now() - drillSessionStatusStartTimes[sessionId]) / 1000;
    const hasFeedbackSummary = elapsedSeconds > 15;

    return {
      session_id: sessionId,
      status: 'completed',
      started_at: new Date().toISOString(),
      has_transcript: true,
      has_feedback_summary: hasFeedbackSummary,
    };
  }

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
      num_drills: 5,
      discipline: 'product',
    };
  }

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
        problem_type: 'guesstimation',
      },
      {
        id: 'drill-8',
        display_title: 'Calculate Revenue Potential',
        discipline: 'product',
        problem_type: 'guesstimation',
      },
      {
        id: 'drill-13',
        display_title: 'Estimate Daily Active Users Growth',
        discipline: 'product',
        problem_type: 'guesstimation',
      },
      {
        id: 'drill-18',
        display_title: 'Calculate Server Capacity Needs',
        discipline: 'product',
        problem_type: 'guesstimation',
      },
      {
        id: 'drill-23',
        display_title: 'Estimate Customer Acquisition Cost',
        discipline: 'product',
        problem_type: 'guesstimation',
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
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      data: {
        problem_types: [
          'behavioral',
          'guesstimation',
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
}): Promise<import('@/types/api').DashboardSessionsResponse> {
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
