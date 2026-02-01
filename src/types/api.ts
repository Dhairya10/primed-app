export type DomainType =
  | 'social_media'
  | 'messaging'
  | 'marketplace'
  | 'on_demand_delivery'
  | 'mobility'
  | 'entertainment'
  | 'fintech'
  | 'healthcare'
  | 'education'
  | 'productivity';

export type ProblemType =
  | 'behavioral'
  | 'guestimation'
  | 'metrics'
  | 'problem_solving'
  | 'product_design'
  | 'product_improvement'
  | 'product_strategy';

export type DisciplineType = 'product' | 'design' | 'engineering' | 'marketing';

// Interview types (new API structure)
export interface Interview {
  id: string;
  title: string;
  discipline: DisciplineType;
  product_logo_url: string | null;
  description: string;
  estimated_duration_minutes: number;
  is_attempted: boolean;
  last_attempted_at: string | null;
}

export interface InterviewSearchResult {
  id: string;
  title: string;
  discipline: DisciplineType;
  product_logo_url: string | null;
  description: string;
  estimated_duration_minutes: number;
}

// Drill types
export interface Drill {
  id: string;
  display_title: string;
  discipline: DisciplineType;
  problem_type: ProblemType;
  skills_tested?: string[];
  product_logo_url?: string | null;
  is_attempted?: boolean;
}

export interface HomeScreenRecommendation {
  drill: {
    id: string;
    title: string;
    skills_tested: string[];
    reasoning: string;
    estimated_minutes: number;
    product_logo_url?: string;
  };
  session_count: number;
}

export type SkillZone = 'red' | 'yellow' | 'green' | 'untested';

export interface UserSkill {
  skill_name: string;
  skill_description: string;
  score: number;
  zone: SkillZone;
  tested: boolean;
}

export interface UserSkillsResponse {
  skills: UserSkill[];
  total_sessions: number;
  last_updated: string | null;
}

export type SkillStatus = 'Demonstrated' | 'Partial' | 'Missed';

export interface SkillSession {
  session_id: string;
  drill_title: string;
  drill_logo_url?: string;
  completed_at: string;
  status: SkillStatus;
}

export interface SkillDetailResponse {
  skill_name: string;
  skill_description: string;
  times_tested: number;
  sessions: SkillSession[];
}

// Unified search result type (PROPER discriminated union for type safety)
export type SearchResult =
  | {
      type: 'interview';
      id: string;
      title: string;
      discipline: DisciplineType;
      product_logo_url: string | null;
      description: string;
      estimated_duration_minutes: number;
    }
  | {
      type: 'drill';
      id: string;
      title: string;
      discipline: DisciplineType;
      display_title: string;
      problem_type: ProblemType;
    };


export interface Problem {
  id: string;
  title: string;
  description: string;
  domain: DomainType;
  problem_type: ProblemType;
  difficulty_level?: string;
  estimated_duration_minutes?: number;
  product_logo_url?: string | null;
  // Backend doesn't return these fields in list view
  is_active?: boolean;
  created_at?: string;
  is_attempted?: boolean;
  last_attempted_at?: string | null;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  key_points?: string[];
}

export interface ProblemFrameworks {
  problem_id: string;
  frameworks: Framework[];
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Generic single response wrapper
export interface SingleResponse<T> {
  data: T;
}

export interface ProblemsMetadata {
  domains: DomainType[];
  problem_types: ProblemType[];
}

export interface InterviewsMetadata {
  disciplines: DisciplineType[];
}

export interface InterviewSessionCreate {
  problem_id: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  problem_id: string;
  status: string;
  started_at: string;
  problem?: Problem;
}

export interface NextInterviewProblem extends Problem {
  is_retry: boolean;
}

export type EvaluationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Legacy interface for backward compatibility (session-level data)
export interface DashboardInterview {
  id: string;
  problem_title: string;
  domain: DomainType;
  problem_type: ProblemType;
  completed_at: string;
  evaluation_status: EvaluationStatus;
  feedback_summary: string | null;
}

// New interfaces for grouped dashboard (problem-level grouping)
export interface AttemptSummary {
  session_id: string;
  completed_at: string;
  evaluation_status: EvaluationStatus;
  feedback_summary: string | null;
}

export interface DashboardProblem {
  problem_id: string;
  problem_title: string;
  domain: DomainType;
  problem_type: ProblemType;
  logo_url: string | null;
  total_attempts: number;
  can_retry: boolean;
  latest_attempt: AttemptSummary;
  previous_attempts: AttemptSummary[];
}

export interface DashboardPagination {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface DashboardResponse {
  problems: DashboardProblem[]; // Matches OpenAPI spec
  pagination: DashboardPagination;
}

// Drill Dashboard Types
export interface DrillAttemptSummary {
  session_id: string;
  completed_at: string;
  evaluation_status?: EvaluationStatus;
  feedback_summary?: string | null;
}

export interface DashboardDrill {
  problem_id: string;
  display_title: string;
  problem_type: ProblemType | null;
  total_attempts: number;
  can_retry: boolean;
  latest_attempt: DrillAttemptSummary;
  previous_attempts: DrillAttemptSummary[];
}

export interface DrillsDashboardResponse {
  drills: DashboardDrill[];
  pagination: DashboardPagination;
}

// Legacy interface for backward compatibility (may be removed when backend is confirmed)
export interface LegacyDashboardResponse {
  data: DashboardInterview[];
  count: number;
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface SkillFeedback {
  skill_name: string;
  status: SkillStatus;
  feedback: string;
  improvement_suggestion: string | null;
}

export interface FeedbackDetailResponse {
  session_id: string;
  title: string;
  completed_at: string;
  evaluation_status: EvaluationStatus;
  feedback_summary: string | null;
  skills_evaluated: SkillFeedback[];
}

export interface RegenerationErrorResponse {
  error: string;
  retries_remaining: number;
  max_retries: number;
}

// Level System Types
export type ProblemStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';

export interface LevelProgressDetail {
  level_number: number;
  total_problems: number;
  completed_problems: number;
}

export interface LevelProgress {
  total_levels: number;
  current_level_number: number;
  completed_levels: number[];
  overall_progress_percentage: number;
  interview_mode_unlocked: boolean;
  level_details?: LevelProgressDetail[];
}

export interface LevelProblem {
  problem_id: string;
  problem: Problem;
  status: ProblemStatus;
  attempt_count: number;
  is_current: boolean;
}

export interface LevelData {
  level_number: number;
  total_problems: number;
  completed_problems: number;
  problems: LevelProblem[];
  substitutions_remaining: number;
  level_completed: boolean;
}

export interface CurrentProblemData {
  level_number: number;
  problem: Problem;
  can_substitute: boolean;
  substitutions_remaining: number;
  attempts_made: number;
}

export interface SubstitutionResult {
  new_problem: Problem;
  substitutions_remaining: number;
  message: string;
}

export interface CompletionResult {
  problem_completed: boolean;
  level_completed: boolean;
  all_levels_completed: boolean;
  next_problem: Problem | null;
  next_level: number | null;
  interview_mode_unlocked: boolean;
}

export interface NextProblemData {
  problem: Problem;
  level_number: number;
  problem_index: number;
}

export interface InterviewModeStatus {
  is_unlocked: boolean;
  unlock_criteria_met: boolean;
  message: string;
}

// User Profile Types
export interface UserProfileRequest {
  discipline: DisciplineType;
  first_name: string;
  last_name?: string;
  onboarding_completed?: boolean;
  bio?: string;
  // Legacy fields - kept for backward compatibility during migration
  selected_domains?: DomainType[];
  full_name?: string;
}

export interface UserProfileResponse {
  id: string;
  user_id: string;
  discipline?: string;
  first_name: string;
  last_name?: string;
  onboarding_completed: boolean;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields - kept for backward compatibility
  selected_domains?: string[];
  full_name?: string;
}

export interface UserProfileUpdateResponse {
  discipline: string;
  first_name: string;
  last_name?: string;
  onboarding_completed: boolean;
  message: string;
}

export interface ProfileScreenResponse {
  first_name: string | null;
  last_name: string | null;
  email: string;
  num_interviews: number;
  discipline: string | null;
}

// Library metadata
export interface LibraryMetadata {
  problem_types: ProblemType[];
  skills: string[];
}

// Drill eligibility check
export interface CheckDrillEligibilityResponse {
  eligible: boolean;
  num_drills: number;
  message: string;
}

// Drill session start
export interface DrillSessionStartResponse {
  session_id: string;
  signed_url: string;
  status: string;
  message: string;
  problem: {
    id: string;
    title: string;
    display_title: string;
    description: string;
    discipline: DisciplineType;
    problem_type: ProblemType;
  };
  started_at: string;
}
