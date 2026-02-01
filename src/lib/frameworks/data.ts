import frameworksData from '../../data/frameworks.json';
import type { FrameworkMapping, FrameworkDefinition } from './registry';

// Type assertion to ensure imported JSON matches our type interface
export const FRAMEWORK_REGISTRY: FrameworkMapping = frameworksData as FrameworkMapping;

// Helper function to safely get frameworks for a problem type
export function getFrameworksForProblemType(problemType: string): FrameworkDefinition[] {
  return FRAMEWORK_REGISTRY[problemType] || [];
}

// Get all available problem types that have frameworks
export function getAvailableProblemTypes(): string[] {
  return Object.keys(FRAMEWORK_REGISTRY);
}
