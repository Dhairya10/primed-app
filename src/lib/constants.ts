// Feature flags
export const IS_API_ENABLED = false; // Set to true when backend is ready
export const IS_ONBOARDING_ENABLED = false; // Set to false to skip onboarding
export const IS_FILTER_ENABLED = true; // Toggle problem filtering experience
export const IS_SWIPE_ENABLED = true; // Enable swipe gestures on problem cards
export const IS_AUTH_ENABLED = false; // Set to true when auth is ready (requires Supabase config)
export const IS_END_SCREEN_TESTING_ENABLED = true; // Set to false to remove end screen test button

/**
 * Temporary user identifier until auth is enabled
 *
 * IMPORTANT: When IS_AUTH_ENABLED = true, this constant will no longer be used.
 * The user ID will be extracted from the JWT token by the backend.
 *
 * Migration steps:
 * 1. Set IS_AUTH_ENABLED = true in .env
 * 2. Ensure Supabase environment variables are set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * 3. Remove user_id query parameters from API calls (backend extracts from JWT)
 */
export const DEFAULT_USER_ID = '511e8f0f-1feb-419a-80d3-dd06b6fdf6ca';

// API endpoint for local testing (use localhost to avoid ad blocker issues)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import type { DomainType, ProblemType, DisciplineType } from '@/types/api';

export const DOMAIN_LABELS: Record<DomainType, string> = {
  social_media: 'Social Media',
  messaging: 'Messaging',
  marketplace: 'Marketplace',
  on_demand_delivery: 'On-demand Delivery',
  mobility: 'Mobility',
  entertainment: 'Entertainment',
  fintech: 'Fintech',
  healthcare: 'Healthcare',
  education: 'Education',
  productivity: 'Productivity',
};

export const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  product_design: 'Product Design',
  behavioral: 'Behavioral',
  product_strategy: 'Product Strategy',
  guestimation: 'Guestimation',
  metrics: 'Metrics',
  problem_solving: 'Problem Solving',
  product_improvement: 'Product Improvement',
};

// Type-safe helper functions with fallbacks
export function getDomainLabel(domain: DomainType): string {
  return DOMAIN_LABELS[domain];
}

export function getProblemTypeLabel(problemType: ProblemType): string {
  return PROBLEM_TYPE_LABELS[problemType];
}

export const DEBOUNCE_DELAY = 300;
export const PROBLEMS_PER_PAGE = 20;
export const PREFETCH_THRESHOLD = 0.8;

// Onboarding domain categories
export interface DomainCategory {
  id: string;
  name: string;
  description: string;
}

export const ONBOARDING_DOMAINS: DomainCategory[] = [
  { id: 'social_media', name: 'Social Media', description: 'Platforms for social networking and content sharing' },
  { id: 'messaging', name: 'Messaging', description: 'Instant messaging and chat applications' },
  { id: 'marketplace', name: 'Marketplace', description: 'Online marketplace and trading platforms' },
  { id: 'on_demand_delivery', name: 'On-demand Delivery', description: 'Fast delivery and instant commerce services' },
  { id: 'mobility', name: 'Mobility', description: 'Transportation and ride-sharing services' },
  { id: 'entertainment', name: 'Entertainment', description: 'Streaming, gaming, and media platforms' },
  { id: 'fintech', name: 'FinTech', description: 'Financial services and payment solutions' },
  { id: 'healthcare', name: 'Healthcare', description: 'Digital health and telemedicine platforms' },
  { id: 'education', name: 'Education', description: 'E-learning and educational technology' },
  { id: 'productivity', name: 'Productivity', description: 'Workplace and personal productivity tools' },
];

// Onboarding disciplines
export const ONBOARDING_DISCIPLINES: DisciplineType[] = [
  'product',
  'design',
  'engineering',
  'marketing',
];

export const DISCIPLINE_LABELS: Record<DisciplineType, string> = {
  product: 'Product',
  design: 'Design',
  engineering: 'Engineering',
  marketing: 'Marketing',
};
