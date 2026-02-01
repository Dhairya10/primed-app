import type { DomainType, ProblemType, DashboardProblem, DashboardInterview } from '@/types/api';

export function formatDomain(domain: DomainType): string {
  const domainMap: Record<DomainType, string> = {
    social_media: 'Social Media',
    messaging: 'Messaging',
    marketplace: 'Marketplace',
    on_demand_delivery: 'On-demand Delivery',
    mobility: 'Mobility',
    entertainment: 'Entertainment',
    fintech: 'FinTech',
    healthcare: 'Healthcare',
    education: 'Education',
    productivity: 'Productivity',
  };
  return domainMap[domain] || domain;
}

export function formatProblemType(problemType: ProblemType): string {
  const problemTypeMap: Record<ProblemType, string> = {
    behavioral: 'Behavioral',
    guestimation: 'Guestimation',
    metrics: 'Metrics',
    problem_solving: 'Problem Solving',
    product_design: 'Product Design',
    product_improvement: 'Product Improvement',
    product_strategy: 'Product Strategy',
  };
  return problemTypeMap[problemType] || problemType;
}

/**
 * @deprecated Numeric scores have been removed from the dashboard API (MVP scope)
 * This function is kept for backward compatibility but should not be used
 */
export function formatScore(score: number | null): string {
  if (score === null) return '';

  // Display one decimal place if not a whole number
  return score % 1 === 0
    ? `${score}/10`
    : `${score.toFixed(1)}/10`;
}

/**
 * Filters out pending and failed attempts from dashboard problems
 * Only shows processing and completed attempts
 *
 * @deprecated Backend now filters these automatically and returns grouped data
 * This function is kept for backward compatibility with legacy API responses
 */
export function filterDisplayableAttempts(
  problems: DashboardProblem[]
): DashboardProblem[] {
  return problems
    .map(problem => {
      // Handle both old format (attempts array) and new format (latest_attempt + previous_attempts)
      if ('latest_attempt' in problem) {
        // New format - already filtered by backend
        return problem;
      }
      // Legacy format handling (should not occur with new API)
      return problem;
    })
    .filter(problem => {
      // Ensure we have at least a latest_attempt
      if ('latest_attempt' in problem) {
        return true;
      }
      return false;
    });
}

/**
 * Converts legacy session-based dashboard data to problem-grouped format
 *
 * @deprecated Backend now returns grouped data directly via DashboardResponse.problems
 * This function is kept for backward compatibility during migration
 */
export function groupSessionsByProblem(
  sessions: DashboardInterview[]
): DashboardProblem[] {
  const problemMap = new Map<string, DashboardProblem>();

  sessions.forEach(session => {
    // Use problem_title as problem_id for now (until we have actual problem_id in response)
    // This is a limitation of the current backend structure
    const problemKey = `${session.problem_title}|${session.domain}|${session.problem_type}`;

    const attempt = {
      session_id: session.id,
      completed_at: session.completed_at,
      evaluation_status: session.evaluation_status,
      feedback_summary: session.feedback_summary,
    };

    if (problemMap.has(problemKey)) {
      const existing = problemMap.get(problemKey)!;
      // For legacy format, we'll use latest_attempt and previous_attempts
      const allAttempts = [attempt, existing.latest_attempt, ...(existing.previous_attempts || [])];
      existing.latest_attempt = allAttempts[0];
      existing.previous_attempts = allAttempts.slice(1, 5); // Keep up to 4 previous
      existing.total_attempts = allAttempts.length;
    } else {
      problemMap.set(problemKey, {
        problem_id: problemKey, // Temporary: using composite key
        problem_title: session.problem_title,
        domain: session.domain,
        problem_type: session.problem_type,
        logo_url: null, // Legacy data doesn't have logo
        total_attempts: 1,
        can_retry: true, // Default to true for legacy data
        latest_attempt: attempt,
        previous_attempts: [],
      });
    }
  });

  // Convert map to array and sort attempts by date (most recent first)
  return Array.from(problemMap.values()).map(problem => ({
    ...problem,
    latest_attempt: problem.latest_attempt,
    previous_attempts: problem.previous_attempts.sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    ),
  }));
}

/**
 * Formats timestamp for attempt cards
 */
export function formatAttemptTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
  // Output: "Oct 24, 2025, 2:30 PM"
}
