import type { Framework } from '@/types/api';

export interface FrameworkDefinition {
  id: string;
  name: string;
  description: string;
  key_points: string[];
  priority?: number; // For ordering
}

export interface FrameworkMapping {
  [problemType: string]: FrameworkDefinition[];
}

// Helper function to convert FrameworkDefinition to Framework
export function toFramework(def: FrameworkDefinition): Framework {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    key_points: def.key_points,
  };
}
