import { useState } from 'react';
import { useBlocker, useNavigate, useParams } from '@tanstack/react-router';
import { VoiceAgent } from '@/components/drill/VoiceAgent';
import { EndScreen } from '@/components/drill/EndScreen';
import { ConfirmationDialog } from '@/components/drill/ConfirmationDialog';

type SessionStage = 'active' | 'completed';

export function DrillSession() {
  const params = useParams({ strict: false });
  const sessionId = params.sessionId as string;
  const navigate = useNavigate();
  const [stage, setStage] = useState<SessionStage>('active');

  const handleSessionEnd = () => {
    setStage('completed');
  };

  const handleNavigateToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      stage === 'active' && current.pathname !== next.pathname,
    withResolver: true,
    enableBeforeUnload: stage === 'active',
    disabled: stage !== 'active',
  });

  if (stage === 'completed') {
    return (
      <EndScreen
        sessionId={sessionId}
        onNavigateToDashboard={handleNavigateToDashboard}
      />
    );
  }

  return (
    <>
      <VoiceAgent
        sessionId={sessionId}
        onSessionEnd={handleSessionEnd}
      />

      <ConfirmationDialog
        isOpen={blocker.status === 'blocked'}
        title="End Interview?"
        message="Are you sure you want to end this interview? Your progress will be saved."
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </>
  );
}
