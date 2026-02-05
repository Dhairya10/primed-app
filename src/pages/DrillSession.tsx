import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { VoiceAgent } from '@/components/drill/VoiceAgent';
import { EndScreen } from '@/components/drill/EndScreen';
import { ConfirmationDialog } from '@/components/drill/ConfirmationDialog';

type SessionStage = 'active' | 'completed';

export function DrillSession() {
  const params = useParams({ strict: false });
  const sessionId = params.sessionId as string;
  const navigate = useNavigate();
  const [stage, setStage] = useState<SessionStage>('active');
  const [showBackExitDialog, setShowBackExitDialog] = useState(false);

  const handleSessionEnd = () => {
    setStage('completed');
  };

  const handleNavigateToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  // Handle back exit confirmation
  const handleConfirmBackExit = useCallback(() => {
    setShowBackExitDialog(false);
    navigate({ to: '/home', replace: true });
  }, [navigate]);

  const handleCancelBackExit = useCallback(() => {
    setShowBackExitDialog(false);
    // Push state again so we can intercept next back press
    window.history.pushState({ fromDrill: true }, '');
  }, []);

  // Intercept back button during active session and show confirmation dialog
  useEffect(() => {
    if (stage !== 'active') return;

    // Push a dummy state so we can intercept back button
    window.history.pushState({ fromDrill: true }, '');

    const handlePopState = () => {
      // User pressed back - show confirmation dialog
      setShowBackExitDialog(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [stage]);

  // Prevent accidental page refresh during active session
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stage === 'active') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stage]);

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
        isOpen={showBackExitDialog}
        title="Leave Interview?"
        message="Are you sure you want to leave? Your progress will not be saved."
        onConfirm={handleConfirmBackExit}
        onCancel={handleCancelBackExit}
      />
    </>
  );
}
