import type { ProblemType } from '@/types/api';

export function formatProblemType(problemType: ProblemType): string {
  const problemTypeMap: Record<ProblemType, string> = {
    behavioral: 'Behavioral',
    guesstimation: 'Guesstimation',
    metrics: 'Metrics',
    problem_solving: 'Problem Solving',
    product_design: 'Product Design',
    product_improvement: 'Product Improvement',
    product_strategy: 'Product Strategy',
    design_approach: 'Design Approach',
    user_research: 'User Research',
    campaign_strategy: 'Campaign Strategy',
    channel_strategy: 'Channel Strategy',
    growth: 'Growth',
    market_analysis: 'Market Analysis',
  };
  return problemTypeMap[problemType] || problemType;
}

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
}

export function formatSkillName(skill: string): string {
  // Handle both underscore-separated (problem_scoping) and space-separated (problem scoping) formats
  return skill
    .split(/[_\s]+/) // Split on underscores or spaces
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}
