// Feature flags
export const IS_API_ENABLED = true; // Set to true when backend is ready
export const IS_ONBOARDING_ENABLED = false; // Set to false to skip onboarding
export const IS_AUTH_ENABLED = true; // Set to true when auth is ready (requires Supabase config)
export const IS_BRAND_FONTS_ENABLED = false; // Set to false to use fallback system fonts
export const DEFAULT_USER_ID = '';

// Business rules
export const MIN_FEEDBACK_DURATION_MINUTES = 2; // Minimum session duration for feedback generation

// API endpoint for local testing (use localhost to avoid ad blocker issues)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import type { ProblemType, DisciplineType } from '@/types/api';

// Domain labels removed - not in OpenAPI spec

export const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  product_design: 'Product Design',
  behavioral: 'Behavioral',
  product_strategy: 'Product Strategy',
  guesstimation: 'Guesstimation',
  metrics: 'Metrics',
  problem_solving: 'Problem Solving',
  product_improvement: 'Product Improvement',
  design_approach: 'Design Approach',
  user_research: 'User Research',
  campaign_strategy: 'Campaign Strategy',
  channel_strategy: 'Channel Strategy',
  growth: 'Growth',
  market_analysis: 'Market Analysis',
};

// Type-safe helper function
export function getProblemTypeLabel(problemType: ProblemType): string {
  return PROBLEM_TYPE_LABELS[problemType];
}

export const DEBOUNCE_DELAY = 300;
export const PROBLEMS_PER_PAGE = 20;
export const PREFETCH_THRESHOLD = 0.8;

// COMMENTED OUT: Discipline selection removed from onboarding flow
// Onboarding disciplines (domain categories removed - not in OpenAPI spec)
// export const ONBOARDING_DISCIPLINES: DisciplineType[] = [
//   'product',
//   'design',
//   'engineering',
//   'marketing',
// ];

export const DISCIPLINE_LABELS: Record<DisciplineType, string> = {
  product: 'Product',
  design: 'Design',
  engineering: 'Engineering',
  marketing: 'Marketing',
};
