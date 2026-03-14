import { InstantAccessAnimation } from '@/components/ui/InstantAccessAnimation';
import { FeedbackAnimation } from '@/components/ui/FeedbackAnimation';
import { VideoCallAnimation } from '@/components/ui/VideoCallAnimation';
import { SkillMapAnimation } from '@/components/ui/SkillMapAnimation';
import { PrepAnimation } from '@/components/ui/PrepAnimation';

type VisualizationType = 'feedback' | 'problems' | 'simulation' | 'instant' | 'skill-map';

interface FeatureVisualizationProps {
  type: VisualizationType;
}

export function FeatureVisualization({ type }: FeatureVisualizationProps) {
  if (type === 'feedback') {
    return <FeedbackAnimation />;
  }

  if (type === 'problems') {
    return <PrepAnimation />;
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
