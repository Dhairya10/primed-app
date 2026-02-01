import { DisciplineFilter } from '@/components/ui/DisciplineFilter';
import { InstantAccessAnimation } from '@/components/ui/InstantAccessAnimation';
import { FeedbackAnimation } from '@/components/ui/FeedbackAnimation';
import { VideoCallAnimation } from '@/components/ui/VideoCallAnimation';

type VisualizationType = 'feedback' | 'problems' | 'simulation' | 'instant';

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

  return null;
}
