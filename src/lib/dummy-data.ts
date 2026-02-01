import type {
  FeedbackDetailResponse,
} from '@/types/api';

// Dummy feedback detail for development
export function getDummyFeedbackDetail(
  sessionId: string
): FeedbackDetailResponse {
  return {
    session_id: sessionId,
    title: 'Design a Health Tracking Feature',
    completed_at: new Date(Date.now() - 3600000).toISOString(),
    evaluation_status: 'completed',
    feedback_summary:
      'Great job applying the CIRCLES framework. Your structured approach to understanding the problem space was thorough. Consider spending more time on competitive analysis in future sessions.',
    skills_evaluated: [
      {
        skill_name: 'Problem Scoping',
        status: 'Demonstrated',
        feedback:
          'Excellent work identifying the target user and their pain points. You clearly articulated the scope and constraints.',
        improvement_suggestion: null,
      },
      {
        skill_name: 'User Research',
        status: 'Partial',
        feedback:
          'You mentioned some user research insights but could have gone deeper into specific user behaviors and motivations.',
        improvement_suggestion:
          'Next time, try to incorporate more specific user personas and behavioral patterns in your analysis.',
      },
      {
        skill_name: 'Solution Design',
        status: 'Demonstrated',
        feedback:
          'Your proposed solution was well-thought-out with clear prioritization of features. Good use of the MoSCoW method.',
        improvement_suggestion: null,
      },
      {
        skill_name: 'Metrics & Success Criteria',
        status: 'Missed',
        feedback:
          'The session ended before you could define clear success metrics for the proposed solution.',
        improvement_suggestion:
          'Always allocate time to define 2-3 key metrics that would indicate success for your product.',
      },
    ],
  };
}

// Dummy dashboard drills for development
export function getDummyDashboardDrills(params: {
  user_id: string;
  limit?: number;
  offset?: number;
}): {
  data: Array<{
    session_id: string;
    drill_id: string;
    drill_title: string;
    product_logo_url: string | null;
    completed_at: string;
    problem_type: import('@/types/api').ProblemType | null;
  }>;
  total: number;
} {
  const allDrills = [
    {
      session_id: 'session-1',
      drill_id: 'drill-1',
      drill_title: 'Design a Health Tracking Feature',
      product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=FT',
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      problem_type: 'product_design' as import('@/types/api').ProblemType,
    },
    {
      session_id: 'session-2',
      drill_id: 'drill-2',
      drill_title: 'Improve User Engagement Metrics',
      product_logo_url: null,
      completed_at: new Date(Date.now() - 172800000).toISOString(),
      problem_type: 'metrics' as import('@/types/api').ProblemType,
    },
    {
      session_id: 'session-3',
      drill_id: 'drill-3',
      drill_title: 'Estimate Market Size',
      product_logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
      completed_at: new Date(Date.now() - 259200000).toISOString(),
      problem_type: 'guesstimation' as import('@/types/api').ProblemType,
    },
  ];

  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const paginatedDrills = allDrills.slice(offset, offset + limit);

  return {
    data: paginatedDrills,
    total: allDrills.length,
  };
}
