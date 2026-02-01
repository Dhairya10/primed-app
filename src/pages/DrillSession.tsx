import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { VoiceAgent } from '@/components/drill/VoiceAgent';
import { EndScreen } from '@/components/drill/EndScreen';

type SessionStage = 'active' | 'completed';

export function DrillSession() {
  const params = useParams({ strict: false });
  const sessionId = params.sessionId as string;
  const navigate = useNavigate();
  const [stage, setStage] = useState<SessionStage>('active');

  const handleSessionEnd = () => {
    setStage('completed');
  };

  const handleNavigateToFeedback = () => {
    navigate({ to: `/feedback/${sessionId}` });
  };

  const handleNavigateToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  if (stage === 'completed') {
    return (
      <EndScreen
        sessionId={sessionId}
        onNavigateToFeedback={handleNavigateToFeedback}
        onNavigateToDashboard={handleNavigateToDashboard}
      />
    );
  }

  return (
    <VoiceAgent
      sessionId={sessionId}
      onSessionEnd={handleSessionEnd}
    />
  );
}
