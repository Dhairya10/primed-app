import { DisciplineFilter } from '@/components/ui/DisciplineFilter';
import { InstantAccessAnimation } from '@/components/ui/InstantAccessAnimation';
import { FeedbackAnimation } from '@/components/ui/FeedbackAnimation';
import { VideoCallAnimation } from '@/components/ui/VideoCallAnimation';
import { SkillMapAnimation } from '@/components/ui/SkillMapAnimation';

type VisualizationType = 'feedback' | 'problems' | 'simulation' | 'instant' | 'skill-map';

interface FeatureVisualizationProps {
  type: VisualizationType;
}

export function FeatureVisualization({ type }: FeatureVisualizationProps) {
  if (type === 'feedback') {
    return <FeedbackAnimation />;
  }

  if (type === 'problems') {
    return <DisciplineFilter />;
  }

  if (type === 'simulation') {
    return <VideoCallAnimation />;
  }

  if (type === 'instant') {
    return <InstantAccessAnimation />;
  }

  if (type === 'skill-map') {
    return <SkillMapAnimation />;
  }

  return null;
}
