// DomainType removed - not in OpenAPI spec

export type ProblemType =
  | 'behavioral'
  | 'guesstimation'
  | 'metrics'
  | 'problem_solving'
  | 'product_design'
  | 'product_improvement'
  | 'product_strategy'
  | 'design_approach'
  | 'user_research'
  | 'campaign_strategy'
  | 'channel_strategy'
  | 'growth'
  | 'market_analysis';

export type DisciplineType = 'product' | 'design' | 'engineering' | 'marketing';

// Interview types removed - only drills remain

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
  greeting: string;
}

export interface SkillTestedInfo {
  id: string;
  name: string;
}

export interface DrillHomeResponse {
  id: string;
  title: string;
  problem_type?: ProblemType | null;
  skills?: SkillTestedInfo[];
  product_url?: string | null;
  recommendation_reasoning?: string | null;
}

export interface DrillResponse {
  id: string;
  title: string;
  problem_type?: ProblemType | null;
  skills?: SkillTestedInfo[];
  product_url?: string | null;
  is_completed?: boolean;
}

export interface GreetingResponse {
  greeting: string;
  user_first_name: string;
  session_number: number;
}

export type SkillZone = 'red' | 'yellow' | 'green' | 'untested';

export interface UserSkill {
  id: string;
  skill_name: string;
  skill_description: string;
  score: number;
  zone: SkillZone;
  tested: boolean;
}

export interface SkillScore {
  id: string;
  name: string;
  score: number;
  zone: SkillZone | null;
  is_tested: boolean;
  last_tested_at?: string | null;
}

export interface SkillMapResponse {
  skills: SkillScore[];
  total_completed_sessions: number;
  untested_skills_count: number;
}

export interface UserSkillsResponse {
  skills: UserSkill[];
  total_sessions: number;
  last_updated: string | null;
}

export type SkillStatus = 'Demonstrated' | 'Partial' | 'Missed';

export interface SkillInfo {
  id: string;
  name: string;
  description?: string | null;
  current_score: number;
  zone: SkillZone | null;
}

export interface SessionPerformance {
  session_id: string;
  drill_title: string;
  product_logo_url: string | null;
  completed_at: string;
  performance: SkillStatus | string;
  score_change: string;
  score_after: number;
}

export interface SkillHistoryResponse {
  skill: SkillInfo;
  sessions: SessionPerformance[];
  total_tested: number;
}

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

// Search and problem types removed - only drills remain

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

// Interview session types removed - only drill sessions remain

export type EvaluationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Interview dashboard types removed - only drill dashboard remains

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

// Level system and regeneration types removed - not in OpenAPI spec

// User Profile Types
export interface UserProfileRequest {
  discipline?: DisciplineType; // Optional - backend defaults to 'product'
  first_name: string;
  last_name?: string;
  onboarding_completed?: boolean;
  bio?: string;
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
  discipline?: string; // Optional - backend defaults to 'product'
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
  num_drills: number;
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
  signed_url?: string | null;
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

// Dashboard Sessions (flat list)
export interface DashboardSession {
  session_id: string;
  drill_id: string;
  drill_title: string;
  product_logo_url: string | null;
  completed_at: string;
  problem_type: ProblemType | null;
}

export interface DashboardSessionsResponse {
  data: DashboardSession[];
  total: number;
}
