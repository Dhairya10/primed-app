import type {
  Problem,
  PaginatedResponse,
  ProblemsMetadata,
  DomainType,
  ProblemType,
  DashboardInterview,
  DashboardProblem,
  DashboardResponse,
  DashboardDrill,
  DrillsDashboardResponse,
  FeedbackDetailResponse,
  SkillFeedback,
  LevelProgress,
  LevelData,
  CurrentProblemData,
  SubstitutionResult,
  CompletionResult,
  NextProblemData,
  InterviewModeStatus,
} from '@/types/api';

export const DUMMY_PROBLEMS: Problem[] = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    title: 'Design a Fitness App for Seniors',
    description:
      'Create a fitness application tailored for senior citizens that encourages daily physical activity and tracks health metrics.',
    domain: 'healthcare',
    problem_type: 'product_design',
    is_attempted: true,
    last_attempted_at: '2024-10-17T10:00:00Z',
    difficulty_level: 'medium',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=FT',
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    title: 'Price a New Analytics App',
    description:
      'Determine the optimal pricing strategy for a new SaaS analytics platform targeting small to medium-sized businesses.',
    domain: 'fintech',
    problem_type: 'product_strategy',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-16T10:00:00Z',
    product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=AT',
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    title: 'Improving Onboarding for a Neobank App in South America',
    description:
      'Redesign the user onboarding experience for a digital-first banking application to reduce drop-off rates.',
    domain: 'fintech',
    problem_type: 'product_design',
    is_attempted: true,
    last_attempted_at: '2024-10-05T08:30:00Z',
    difficulty_level: 'medium',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-17T10:00:00Z',
    product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=NB',
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    title: 'Reduce Cart Abandonment Rate',
    description:
      'Analyze and propose solutions to reduce the shopping cart abandonment rate for an e-commerce platform.',
    domain: 'marketplace',
    problem_type: 'metrics',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'medium',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-18T10:00:00Z',
    product_logo_url: null,
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    title: 'Increase Engagement on a Social Platform',
    description:
      'Develop strategies to increase daily active users and engagement time on a social media platform.',
    domain: 'social_media',
    problem_type: 'product_strategy',
    is_attempted: true,
    last_attempted_at: '2024-09-28T15:45:00Z',
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-19T10:00:00Z',
    product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=SP',
  },
  {
    id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    title: 'Launch a New API for a Developer Platform',
    description:
      'Design the go-to-market strategy for launching a new REST API product for a developer platform.',
    domain: 'productivity',
    problem_type: 'problem_solving',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
    title: 'Tell Me About a Time You Failed',
    description:
      'Behavioral interview question exploring how you handle failure and what you learned from a challenging situation.',
    domain: 'entertainment',
    problem_type: 'behavioral',
    is_attempted: true,
    last_attempted_at: '2024-10-10T12:00:00Z',
    difficulty_level: 'medium',
    estimated_duration_minutes: 30,
    is_active: true,
    created_at: '2024-01-21T10:00:00Z',
  },
  {
    id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
    title: 'Estimate the Market Size for Electric Scooters',
    description:
      'Calculate the total addressable market for electric scooters in the United States.',
    domain: 'marketplace',
    problem_type: 'guestimation',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'medium',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-22T10:00:00Z',
  },
  {
    id: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
    title: 'Improve Retention for a Telemedicine App',
    description:
      'Identify key metrics and strategies to improve 30-day user retention for a telemedicine application.',
    domain: 'healthcare',
    problem_type: 'metrics',
    is_attempted: true,
    last_attempted_at: '2024-09-30T09:15:00Z',
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-23T10:00:00Z',
  },
  {
    id: '0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
    title: 'Design a Subscription Management Dashboard',
    description:
      'Create a user interface for customers to manage their SaaS subscriptions, billing, and usage.',
    domain: 'fintech',
    problem_type: 'product_design',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'medium',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-24T10:00:00Z',
  },
  {
    id: '1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
    title: 'Prioritize Features for Q1 Roadmap',
    description:
      'Given limited engineering resources, prioritize features for the Q1 product roadmap.',
    domain: 'entertainment',
    problem_type: 'product_strategy',
    is_attempted: true,
    last_attempted_at: '2024-10-01T18:20:00Z',
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-25T10:00:00Z',
  },
  {
    id: '2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
    title: 'Build Trust in a Peer-to-Peer Marketplace',
    description:
      'Design features and policies to build trust between buyers and sellers in a P2P marketplace.',
    domain: 'marketplace',
    problem_type: 'product_design',
    is_attempted: false,
    last_attempted_at: null,
    difficulty_level: 'hard',
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: '2024-01-26T10:00:00Z',
  },
];

export const DUMMY_METADATA: ProblemsMetadata = {
  domains: [
    'health_tech',
    'saas',
    'fintech',
    'ecommerce_retail',
    'social_media_community',
    'developer_platforms',
    'other',
  ] as DomainType[],
  problem_types: [
    'product_design',
    'behavioural',
    'product_strategy',
    'estimation',
    'analytics',
    'technical',
    'other',
  ] as ProblemType[],
};

export function filterDummyProblems(params: {
  search?: string;
  domain?: DomainType;
  problem_type?: ProblemType;
  limit?: number;
  offset?: number;
}): PaginatedResponse<Problem> {
  let filtered = [...DUMMY_PROBLEMS];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(searchLower)
    );
  }

  // Apply domain filter
  if (params.domain) {
    filtered = filtered.filter((p) => p.domain === params.domain);
  }

  // Apply problem_type filter
  if (params.problem_type) {
    filtered = filtered.filter((p) => p.problem_type === params.problem_type);
  }

  // Apply pagination
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const total = filtered.length;
  const paginatedData = filtered.slice(offset, offset + limit);

  return {
    data: paginatedData,
    count: paginatedData.length,
    total,
    limit,
    offset,
    has_more: offset + limit < total,
  };
}

export function getRandomDummyProblem(): Problem {
  const randomIndex = Math.floor(Math.random() * DUMMY_PROBLEMS.length);
  return DUMMY_PROBLEMS[randomIndex];
}

// Dashboard dummy data - includes multiple attempts for some problems
export const DUMMY_DASHBOARD_INTERVIEWS: DashboardInterview[] = [
  // First attempt - Design a Fitness App for Seniors
  {
    id: 'session-1',
    problem_title: 'Design a Fitness App for Seniors',
    domain: 'healthcare',
    problem_type: 'product_design',
    completed_at: '2024-10-01T14:30:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Strong performance overall. You demonstrated excellent problem structuring and user empathy. Your approach to understanding the target demographic was particularly impressive.\n\nYou identified key challenges seniors face with technology and proposed thoughtful solutions. The competitive analysis was thorough.\n\nAreas for improvement: Could have spent more time on success metrics and monetization strategy. Consider discussing technical constraints earlier in the discussion.',
  },
  // Second attempt - Design a Fitness App for Seniors (same problem, attempted again)
  {
    id: 'session-8',
    problem_title: 'Design a Fitness App for Seniors',
    domain: 'healthcare',
    problem_type: 'product_design',
    completed_at: '2024-10-15T10:00:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Excellent improvement! This attempt showed significant growth from your previous attempt. You incorporated the feedback well, especially around success metrics and monetization strategy.\n\nYour approach was more structured this time, and you proactively discussed technical constraints. The user research depth was impressive.\n\nKeep up the great work!',
  },
  // Third attempt - Design a Fitness App for Seniors (currently processing)
  {
    id: 'session-9',
    problem_title: 'Design a Fitness App for Seniors',
    domain: 'healthcare',
    problem_type: 'product_design',
    completed_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    evaluation_status: 'processing',
    feedback_summary: null,
  },
  {
    id: 'session-2',
    problem_title: 'Price a New Analytics Tool',
    domain: 'fintech',
    problem_type: 'product_strategy',
    completed_at: '2024-09-28T10:15:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Good strategic thinking demonstrated. You covered the key pricing considerations and showed understanding of the SaaS business model.\n\nYour analysis of competitor pricing was solid, and you made reasonable assumptions about customer segments.\n\nTo improve: Work on quantifying the value proposition more clearly. The discussion of pricing tiers could have been more detailed with specific feature differentiation.',
  },
  {
    id: 'session-3',
    problem_title: 'Improving Onboarding for a Neobank in South America',
    domain: 'fintech',
    problem_type: 'product_design',
    completed_at: '2024-09-25T16:45:00Z',
    evaluation_status: 'processing',
    feedback_summary: null,
  },
  // First attempt - Reduce Cart Abandonment Rate
  {
    id: 'session-4',
    problem_title: 'Reduce Cart Abandonment Rate',
    domain: 'marketplace',
    problem_type: 'metrics',
    completed_at: '2024-09-20T09:20:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Decent analytical approach. You identified several key metrics and potential causes of cart abandonment.\n\nYour framework for analyzing the problem was logical, and you showed good understanding of e-commerce metrics.\n\nImprovement areas: Could have dug deeper into data analysis techniques. The solutions proposed were somewhat generic - try to be more specific about implementation details and expected impact.',
  },
  // Second attempt - Reduce Cart Abandonment Rate
  {
    id: 'session-10',
    problem_title: 'Reduce Cart Abandonment Rate',
    domain: 'marketplace',
    problem_type: 'metrics',
    completed_at: '2024-10-05T14:00:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Great improvement! You addressed the feedback from your first attempt well. The data analysis approach was more rigorous, and your solutions were much more specific.\n\nYou clearly outlined implementation steps and quantified expected impact. The prioritization framework you used was excellent.\n\nNice progress on this problem!',
  },
  {
    id: 'session-5',
    problem_title: 'Tell Me About a Time You Failed',
    domain: 'entertainment',
    problem_type: 'behavioral',
    completed_at: '2024-09-15T11:00:00Z',
    evaluation_status: 'completed',
    feedback_summary:
      'Excellent response. You demonstrated strong self-awareness and learning orientation.\n\nYour story was well-structured using the STAR method. You took clear ownership of the failure and showed genuine reflection on lessons learned.\n\nThe example was relevant and showed vulnerability while maintaining professionalism. Well done!',
  },
  // These should be filtered out (failed/pending status)
  {
    id: 'session-6',
    problem_title: 'Estimate the Market Size for Electric Scooters',
    domain: 'marketplace',
    problem_type: 'guestimation',
    completed_at: '2024-09-10T13:30:00Z',
    evaluation_status: 'failed',
    feedback_summary: null,
  },
  {
    id: 'session-7',
    problem_title: 'Increase Engagement on a Social Platform',
    domain: 'social_media',
    problem_type: 'product_strategy',
    completed_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    evaluation_status: 'pending',
    feedback_summary: null,
  },
];

const DUMMY_FEEDBACK_DETAILS: Record<string, SkillFeedback[]> = {
  'session-1': [
    {
      skill_name: 'Problem Scoping',
      status: 'Demonstrated',
      feedback:
        'You clarified the prompt quickly and asked the right questions before jumping into solutions.',
      improvement_suggestion: null,
    },
    {
      skill_name: 'Metric Selection',
      status: 'Partial',
      feedback:
        'You mentioned engagement metrics but did not define leading vs. lagging indicators.',
      improvement_suggestion:
        'Call out one leading metric and explain why it predicts long-term success.',
    },
    {
      skill_name: 'Business Acumen',
      status: 'Missed',
      feedback:
        'The answer didn’t connect the solution to business constraints or trade-offs.',
      improvement_suggestion:
        'Explicitly state constraints (cost, time, risk) and how they shape your recommendation.',
    },
  ],
  'session-2': [
    {
      skill_name: 'User Segmentation',
      status: 'Demonstrated',
      feedback:
        'You identified distinct user groups and tailored the approach for each.',
      improvement_suggestion: null,
    },
    {
      skill_name: 'Prioritization',
      status: 'Partial',
      feedback:
        'You listed priorities but didn’t compare impact vs. effort clearly.',
      improvement_suggestion:
        'Use a simple impact/effort grid and rank the top two options explicitly.',
    },
  ],
  'session-4': [
    {
      skill_name: 'Structured Thinking',
      status: 'Demonstrated',
      feedback:
        'The response followed a clear structure and was easy to track.',
      improvement_suggestion: null,
    },
  ],
  'session-5': [
    {
      skill_name: 'Storytelling',
      status: 'Demonstrated',
      feedback:
        'Your story was clear, concise, and showed ownership of the outcome.',
      improvement_suggestion: null,
    },
  ],
};

export function getDummyDashboard(params: {
  user_id: string;
  status?: string;
  limit?: number;
  offset?: number;
}): DashboardResponse {
  // For dummy data, simulate the new problem-grouped format
  // This matches what the actual backend returns
  const mockProblems: DashboardProblem[] = [
    {
      problem_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      problem_title: 'Design a Fitness App for Seniors',
      domain: 'healthcare',
      problem_type: 'product_design',
      logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=FT',
      total_attempts: 3,
      can_retry: false,
      latest_attempt: {
        session_id: 'session-1',
        completed_at: '2024-10-20T14:30:00Z',
        evaluation_status: 'completed',
        feedback_summary: 'Strong problem structuring and clear solution approach'
      },
      previous_attempts: [
        {
          session_id: 'session-2',
          completed_at: '2024-10-18T16:45:00Z',
          evaluation_status: 'completed',
          feedback_summary: 'Good user empathy with some areas for improvement'
        },
        {
          session_id: 'session-3',
          completed_at: '2024-10-15T10:20:00Z',
          evaluation_status: 'completed',
          feedback_summary: 'Clear thinking process but needs more detail'
        }
      ]
    },
    {
      problem_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
      problem_title: 'Price a New Analytics Tool',
      domain: 'fintech',
      problem_type: 'product_strategy',
      logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=AT',
      total_attempts: 1,
      can_retry: true,
      latest_attempt: {
        session_id: 'session-4',
        completed_at: '2024-10-19T11:15:00Z',
        evaluation_status: 'completed',
        feedback_summary: 'Well-structured pricing analysis with good reasoning'
      },
      previous_attempts: []
    },
    {
      problem_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
      problem_title: 'Improve Retention for a Telemedicine App',
      domain: 'healthcare',
      problem_type: 'metrics',
      logo_url: null,
      total_attempts: 2,
      can_retry: true,
      latest_attempt: {
        session_id: 'session-5',
        completed_at: '2024-10-10T09:15:00Z',
        evaluation_status: 'processing',
        feedback_summary: null
      },
      previous_attempts: [
        {
          session_id: 'session-6',
          completed_at: '2024-10-05T14:20:00Z',
          evaluation_status: 'completed',
          feedback_summary: 'Good analytical thinking, focus more on specific metrics'
        }
      ]
    }
  ];

  const limit = params.limit || 20;
  const offset = params.offset || 0;

  return {
    problems: mockProblems,
    pagination: {
      total: mockProblems.length,
      limit,
      offset,
      has_more: false
    }
  };
}

export function getDummyFeedbackDetail(
  sessionId: string
): FeedbackDetailResponse {
  const feedback = DUMMY_FEEDBACK_DETAILS[sessionId] || DUMMY_FEEDBACK_DETAILS['session-1'];
  return {
    session_id: sessionId,
    title: 'Interview Feedback',
    completed_at: new Date().toISOString(),
    evaluation_status: 'completed',
    feedback_summary: 'Strong overall performance with good problem-solving skills.',
    skills_evaluated: feedback,
  };
}

// Drill Dashboard Dummy Data
export function getDummyDashboardDrills(params: {
  user_id: string;
  limit?: number;
  offset?: number;
}): DrillsDashboardResponse {
  const mockDrills: DashboardDrill[] = [
    {
      problem_id: 'drill-1',
      display_title: 'Design a Health Tracking Feature',
      problem_type: 'product_design',
      total_attempts: 4,
      can_retry: true,
      latest_attempt: {
        session_id: 'drill-session-1',
        completed_at: '2024-10-21T10:30:00Z',
        evaluation_status: 'pending',
      },
      previous_attempts: [
        {
          session_id: 'drill-session-2',
          completed_at: '2024-10-18T14:20:00Z',
        },
        {
          session_id: 'drill-session-3',
          completed_at: '2024-10-15T09:15:00Z',
        },
        {
          session_id: 'drill-session-4',
          completed_at: '2024-10-12T16:45:00Z',
        }
      ]
    },
    {
      problem_id: 'drill-2',
      display_title: 'Improve User Engagement Metrics',
      problem_type: 'metrics',
      total_attempts: 2,
      can_retry: true,
      latest_attempt: {
        session_id: 'drill-session-5',
        completed_at: '2024-10-19T11:00:00Z',
        evaluation_status: 'completed',
      },
      previous_attempts: [
        {
          session_id: 'drill-session-6',
          completed_at: '2024-10-16T13:30:00Z',
        }
      ]
    },
    {
      problem_id: 'drill-27',
      display_title: 'Improve Instagram Stories',
      problem_type: 'product_improvement',
      total_attempts: 1,
      can_retry: true,
      latest_attempt: {
        session_id: 'drill-session-7',
        completed_at: '2024-10-17T15:45:00Z',
        evaluation_status: 'completed',
      },
      previous_attempts: []
    },
    {
      problem_id: 'drill-3',
      display_title: 'Estimate Market Size for New Product',
      problem_type: 'guestimation',
      total_attempts: 3,
      can_retry: true,
      latest_attempt: {
        session_id: 'drill-session-8',
        completed_at: '2024-10-14T10:15:00Z',
        evaluation_status: 'completed',
      },
      previous_attempts: [
        {
          session_id: 'drill-session-9',
          completed_at: '2024-10-11T14:30:00Z',
        },
        {
          session_id: 'drill-session-10',
          completed_at: '2024-10-08T09:45:00Z',
        }
      ]
    }
  ];

  const limit = params.limit || 20;
  const offset = params.offset || 0;

  return {
    drills: mockDrills,
    pagination: {
      total: mockDrills.length,
      limit,
      offset,
      has_more: false
    }
  };
}

// Level System Dummy Data
export const DUMMY_LEVEL_PROGRESS: LevelProgress = {
  total_levels: 10,
  current_level_number: 1,
  completed_levels: [],
  overall_progress_percentage: 0,
  interview_mode_unlocked: false,
  level_details: [
    { level_number: 1, total_problems: 4, completed_problems: 1 },
    { level_number: 2, total_problems: 4, completed_problems: 0 },
    { level_number: 3, total_problems: 4, completed_problems: 0 },
    { level_number: 4, total_problems: 4, completed_problems: 0 },
    { level_number: 5, total_problems: 4, completed_problems: 0 },
    { level_number: 6, total_problems: 4, completed_problems: 0 },
    { level_number: 7, total_problems: 4, completed_problems: 0 },
    { level_number: 8, total_problems: 4, completed_problems: 0 },
    { level_number: 9, total_problems: 4, completed_problems: 0 },
    { level_number: 10, total_problems: 4, completed_problems: 0 },
  ],
};

export const DUMMY_LEVEL_DATA: LevelData = {
  level_number: 1,
  total_problems: 4,
  completed_problems: 0,
  problems: [
    {
      problem_id: DUMMY_PROBLEMS[0].id,
      problem: DUMMY_PROBLEMS[0],
      status: 'available',
      attempt_count: 0,
      is_current: true,
    },
    {
      problem_id: DUMMY_PROBLEMS[1].id,
      problem: DUMMY_PROBLEMS[1],
      status: 'locked',
      attempt_count: 0,
      is_current: false,
    },
    {
      problem_id: DUMMY_PROBLEMS[2].id,
      problem: DUMMY_PROBLEMS[2],
      status: 'locked',
      attempt_count: 0,
      is_current: false,
    },
    {
      problem_id: DUMMY_PROBLEMS[3].id,
      problem: DUMMY_PROBLEMS[3],
      status: 'locked',
      attempt_count: 0,
      is_current: false,
    },
  ],
  substitutions_remaining: 3,
  level_completed: false,
};

export const DUMMY_CURRENT_PROBLEM: CurrentProblemData = {
  level_number: 1,
  problem: DUMMY_PROBLEMS[0],
  can_substitute: true,
  substitutions_remaining: 3,
  attempts_made: 0,
};

export function getDummyLevelProgress(): LevelProgress {
  return { ...DUMMY_LEVEL_PROGRESS };
}

export function getDummyCurrentLevel(): LevelData {
  return JSON.parse(JSON.stringify(DUMMY_LEVEL_DATA));
}

export function getDummyCurrentProblem(): CurrentProblemData {
  return { ...DUMMY_CURRENT_PROBLEM, problem: { ...DUMMY_CURRENT_PROBLEM.problem } };
}

export function getDummySubstitutionResult(): SubstitutionResult {
  return {
    new_problem: DUMMY_PROBLEMS[4],
    substitutions_remaining: 2,
    message: 'Problem substituted successfully',
  };
}

export function getDummyCompletionResult(
  isLevelComplete: boolean = false,
  isAllComplete: boolean = false
): CompletionResult {
  return {
    problem_completed: true,
    level_completed: isLevelComplete,
    all_levels_completed: isAllComplete,
    next_problem: isLevelComplete ? null : DUMMY_PROBLEMS[1],
    next_level: isLevelComplete ? 2 : null,
    interview_mode_unlocked: isAllComplete,
  };
}

export function getDummyNextProblem(): NextProblemData {
  return {
    problem: DUMMY_PROBLEMS[1],
    level_number: 1,
    problem_index: 1,
  };
}

export function getDummyInterviewModeStatus(unlocked: boolean = false): InterviewModeStatus {
  return {
    is_unlocked: unlocked,
    unlock_criteria_met: unlocked,
    message: unlocked
      ? 'Congratulations! You have unlocked interview mode.'
      : 'Complete all levels to unlock interview mode.',
  };
}

// Framework Dummy Data
import type { ProblemFrameworks, Framework } from '@/types/api';

const DUMMY_FRAMEWORKS: Record<string, ProblemFrameworks> = {
  '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p': {
    problem_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    frameworks: [
      {
        id: 'framework-1',
        name: 'User-Centered Design Framework',
        description: 'Focus on understanding user needs, pain points, and behaviors throughout the design process.',
        key_points: [
          'Start with user research and empathy mapping',
          'Define clear user personas and their goals',
          'Create user journey maps to identify opportunities',
          'Iterate based on user feedback and testing',
        ],
      },
      {
        id: 'framework-2',
        name: 'Accessibility First Approach',
        description: 'Ensure the product is usable by people with diverse abilities, especially important for senior users.',
        key_points: [
          'Large, readable fonts and high contrast colors',
          'Simple navigation with minimal steps',
          'Voice commands and audio feedback options',
          'Error prevention and clear recovery paths',
        ],
      },
      {
        id: 'framework-3',
        name: 'Health Data Privacy Framework',
        description: 'Consider HIPAA compliance and user privacy when handling sensitive health information.',
        key_points: [
          'Transparent data collection and usage policies',
          'Secure storage and encryption of health data',
          'User control over data sharing preferences',
          'Regular security audits and compliance checks',
        ],
      },
    ],
  },
  '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q': {
    problem_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    frameworks: [
      {
        id: 'framework-4',
        name: 'Value-Based Pricing',
        description: 'Price based on the value delivered to customers rather than cost-plus or competitor-based pricing.',
        key_points: [
          'Quantify the ROI your product delivers',
          'Segment customers by willingness to pay',
          'Create pricing tiers aligned with value metrics',
          'Use value conversations in sales process',
        ],
      },
      {
        id: 'framework-5',
        name: 'SaaS Pricing Model Framework',
        description: 'Structure pricing to optimize for customer acquisition, expansion, and retention.',
        key_points: [
          'Consider usage-based vs. seat-based pricing',
          'Design upgrade paths between tiers',
          'Include enterprise plans with custom pricing',
          'Plan for annual vs. monthly billing options',
        ],
      },
    ],
  },
};

// Default frameworks for problems without specific data
const DEFAULT_FRAMEWORKS: Framework[] = [
  {
    id: 'framework-default-1',
    name: 'Problem Structuring Framework',
    description: 'Break down complex problems into manageable components for systematic analysis.',
    key_points: [
      'Define the problem clearly and scope appropriately',
      'Identify key stakeholders and their needs',
      'Break into sub-problems or phases',
      'Prioritize based on impact and feasibility',
    ],
  },
  {
    id: 'framework-default-2',
    name: 'CIRCLES Method',
    description: 'A structured approach for product design questions covering all key aspects.',
    key_points: [
      'Comprehend the situation and constraints',
      'Identify the customer and their needs',
      'Report customer needs and pain points',
      'Cut through prioritization of features',
      'List solutions and evaluate trade-offs',
      'Evaluate and summarize your recommendation',
      'Summarize your recommendation clearly',
    ],
  },
];

// Framework data is now handled via JSON files
// See: src/data/frameworks.json and src/lib/frameworks/
export function getDummyFrameworks(problemId: string): ProblemFrameworks {
  return DUMMY_FRAMEWORKS[problemId] || {
    problem_id: problemId,
    frameworks: DEFAULT_FRAMEWORKS,
  };
}
