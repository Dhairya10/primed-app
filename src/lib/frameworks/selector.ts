import { useMemo } from 'react';
import type { Problem, Framework } from '@/types/api';
import { FRAMEWORK_REGISTRY } from './data';
import { toFramework, type FrameworkDefinition } from './registry';

// Specialized frameworks for specific domain-problem combinations
const SPECIALIZED_FRAMEWORKS: Record<string, FrameworkDefinition> = {
  // Add specialized frameworks as needed
  // Example: 'healthcare_product_design': { id: 'special-healthcare-design', ... }
};

/**
 * Get frameworks for a specific problem based on its type and domain
 */
export function getFrameworksForProblem(problem: Problem): Framework[] {
  const baseFrameworks = FRAMEWORK_REGISTRY[problem.problem_type] || [];
  
  // Filter by domain if applicable
  const domainFiltered = baseFrameworks.filter(framework => 
    !framework.applicable_domains || framework.applicable_domains.includes(problem.domain)
  );
  
  // Sort by priority
  return domainFiltered
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .map(toFramework);
}

/**
 * Get specialized frameworks for specific domain-problem combinations
 */
export function getSpecializedFramework(problem: Problem): Framework | null {
  const specializedKey = `${problem.domain}_${problem.problem_type}`;
  const specialized = SPECIALIZED_FRAMEWORKS[specializedKey];
  
  return specialized ? toFramework(specialized) : null;
}

/**
 * Hook to get frameworks for a problem (for use in components)
 */
export function useFrameworksForProblem(problem: Problem): Framework[] {
  return useMemo(() => {
    const baseFrameworks = getFrameworksForProblem(problem);
    const specialized = getSpecializedFramework(problem);
    
    return specialized 
      ? [specialized, ...baseFrameworks.filter(f => f.id !== specialized.id)]
      : baseFrameworks;
  }, [problem.id]); // Only re-compute when problem ID changes
}

/**
 * Check if a problem has any frameworks available
 */
export function hasFrameworksForProblem(problem: Problem): boolean {
  return FRAMEWORK_REGISTRY[problem.problem_type]?.length > 0 || 
         getSpecializedFramework(problem) !== null;
}

/**
 * Get all problem types that have frameworks available
 */
export function getFrameworkProblemTypes(): string[] {
  return Object.keys(FRAMEWORK_REGISTRY);
}
