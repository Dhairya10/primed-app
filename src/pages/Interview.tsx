import { useEffect, useState, useCallback } from 'react';
import { LoadingScreen } from './interview/LoadingScreen';
import { MainInterviewScreen } from './interview/MainInterviewScreen';
import { EndScreen } from './interview/EndScreen';
import { ErrorScreen } from './interview/ErrorScreen';
import { ConfirmationDialog } from '@/components/interview/ConfirmationDialog';
import { FeedbackModal, type FeedbackData } from '@/components/interview/FeedbackModal';

import { useInterviewStore } from '@/lib/interview-store';
import { abandonInterviewSession } from '@/lib/api';
import type { SessionStartResponse } from '@/types/interview';

type InterviewStage = 'loading' | 'main' | 'end' | 'error';

export function Interview() {
  const [sessionId, setSessionIdState] = useState<string>('');
  const [stage, setStage] = useState<InterviewStage>('loading');
  const [sessionData, setSessionData] = useState<SessionStartResponse | null>(null);
  
  const [problemId, setProblemIdState] = useState<string>('');
  const [problemTitle, setProblemTitle] = useState<string>('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const {
    setSessionId: setStoreSessionId,
    setProblemId,
    setEstimatedDurationMinutes,
    resetStore,
  } = useInterviewStore();

  // Initialize problem data on mount (only once!)
  useEffect(() => {
    console.log('Interview: Starting initialization...');

    // Reset store at the beginning of new session
    resetStore();
    console.log('Interview: Store reset');

    // Get interview_id and title from sessionStorage (set by Home page)
    let interviewIdFromStorage = sessionStorage.getItem('interview-problem-id');
    let problemTitleFromStorage = sessionStorage.getItem('interview-problem-title');

    // TEMPORARY: For testing, use default values if missing
    if (!interviewIdFromStorage) {
      console.warn('Missing sessionStorage data, using defaults for testing');
      interviewIdFromStorage = '2dd7890b-f308-4c13-8e47-10956a694d1d'; // Fitness App problem
      problemTitleFromStorage = 'Design a Health Tracking Feature';
    }

    setProblemIdState(interviewIdFromStorage);
    setProblemTitle(problemTitleFromStorage || 'Loading Problem...');

    console.log('Interview: Initialized with interviewId:', interviewIdFromStorage);

    // Cleanup function - only runs on actual unmount
    return () => {
      // Cleanup lock (only if sessionId is set)
      if (sessionId) {
        const lockKey = `interview-lock-${sessionId}`;
        localStorage.removeItem(lockKey);
      }

      // DON'T clean up sessionStorage here!
      // React Strict Mode will remount the component in dev,
      // and we need the sessionStorage data to persist.
      // sessionStorage will be cleared by the browser when the tab closes.
    };
  }, []); // Empty dependency array - only run once on mount!

  const handleCountdownComplete = (session: SessionStartResponse) => {
    console.log('Interview: Session created successfully, moving to main screen', session);

    setSessionData(session);

    // Update both component state and store with the real session ID from backend
    const realSessionId = session.session_id;
    setSessionIdState(realSessionId);
    setStoreSessionId(realSessionId);
    setProblemId(problemId);
    setEstimatedDurationMinutes(session.interview.estimated_duration_minutes);

    // Update lock with real session ID
    const realLockKey = `interview-lock-${realSessionId}`;
    localStorage.setItem(
      realLockKey,
      JSON.stringify({ tabId: Math.random().toString(36), timestamp: Date.now() })
    );

    // Update lock heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      const lock = localStorage.getItem(realLockKey);
      if (lock) {
        const lockData = JSON.parse(lock);
        localStorage.setItem(
          realLockKey,
          JSON.stringify({ ...lockData, timestamp: Date.now() })
        );
      }
    }, 30000);

    // Store interval ID for cleanup
    (window as any).__interviewHeartbeatInterval = heartbeatInterval;

    setStage('main');
  };

  const handleError = useCallback((errorMessage: string) => {
    console.error('Interview: handleError called from stage:', stage, 'Message:', errorMessage);
    console.trace('Error stack trace:');

    // Don't trigger error screen if we're already on the end screen
    if (stage === 'end') {
      console.log('Interview: Ignoring error because already on end screen');
      return;
    }

    setStage('error');
  }, [stage]);

  const handleInterviewEnd = async (reason?: string) => {
    console.log('Interview ended naturally:', reason);
    setStage('end');

    // ElevenLabs handles upload via webhook - no action needed
  };

  const handleEmergencyExit = async () => {
    try {
      // Clear lock
      localStorage.removeItem(`interview-lock-${sessionId}`);
      
      // Abandon session (no upload)
      await abandonInterviewSession(sessionId);
      
      // Reset store
      resetStore();
      
      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Failed to abandon session:', err);
      alert('Failed to exit interview. Please try again.');
    }
  };

  const handleCancel = async () => {
    try {
      // Clear lock
      localStorage.removeItem(`interview-lock-${sessionId}`);
      
      // Abandon session
      await abandonInterviewSession(sessionId);
      
      // Reset store
      resetStore();
      
      // Navigate back to home
      window.location.href = '/home';
    } catch (err) {
      console.error('Failed to cancel interview:', err);
      window.location.href = '/home';
    }
  };

  const handleGoToEndScreen = () => {
    setStage('end');
  };

  const handleEndInterview = () => {
    // Show confirmation dialog first
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    // Close confirmation and show feedback modal
    setShowExitConfirmation(false);
    setShowFeedbackModal(true);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const handleSkipFeedback = async () => {
    try {
      // User skipped feedback but still abandoning the interview
      if (sessionId) {
        await abandonInterviewSession(sessionId);
      }

      setShowFeedbackModal(false);
      await finalizeExit();
    } catch (err) {
      console.error('Failed to abandon session:', err);
      // Still proceed to exit
      setShowFeedbackModal(false);
      await finalizeExit();
    }
  };

  const handleSubmitFeedback = async (feedbackData: FeedbackData) => {
    try {
      // Submit feedback with abandon call
      if (sessionId) {
        await abandonInterviewSession(sessionId, {
          reasons: feedbackData.reasons,
          additional_feedback: feedbackData.additionalFeedback,
        });
      }

      setShowFeedbackModal(false);
      await finalizeExit();
    } catch (err) {
      console.error('Failed to submit exit feedback:', err);
      // Still proceed to exit even if feedback submission fails
      setShowFeedbackModal(false);
      await finalizeExit();
    }
  };

  const finalizeExit = async () => {
    try {
      // Clear lock if session was created
      if (sessionId) {
        localStorage.removeItem(`interview-lock-${sessionId}`);
        // ✅ DO NOT call abandonInterviewSession here
        // Session is already completed via ElevenLabs webhook
        // Calling abandon would incorrectly mark a completed session as abandoned
      }

      // Clear heartbeat interval if it exists
      if ((window as any).__interviewHeartbeatInterval) {
        clearInterval((window as any).__interviewHeartbeatInterval);
        delete (window as any).__interviewHeartbeatInterval;
      }

      // Reset store
      resetStore();

      // Navigate back to home
      window.location.href = '/home';
    } catch (err) {
      console.error('Failed to finalize exit:', err);
      window.location.href = '/home';
    }
  };

  // Render current screen
  let currentScreen = null;

  if (stage === 'loading') {
    currentScreen = (
      <LoadingScreen
        problemId={problemId}
        problemTitle={problemTitle}
        onCountdownComplete={handleCountdownComplete}
        onCancel={handleCancel}
        onError={handleError}
      />
    );
  } else if (stage === 'error') {
    currentScreen = (
      <ErrorScreen
        onGoToEndScreen={handleGoToEndScreen}
        onEndInterview={handleEndInterview}
      />
    );
  } else if (stage === 'main') {
    if (!sessionData) {
      console.error('Interview: No session data available for main screen');
      currentScreen = null;
    } else {
      currentScreen = (
        <MainInterviewScreen
          problemTitle={sessionData.interview.title}
          estimatedDurationMinutes={sessionData.interview.estimated_duration_minutes}
          sessionId={sessionData.session_id}
          signedUrl={sessionData.signed_url}
          onNaturalEnd={handleInterviewEnd}
          onEmergencyExit={handleEmergencyExit}
          onError={handleError}
          onGoToEndScreen={handleGoToEndScreen}
        />
      );
    }
  } else if (stage === 'end') {
    const finalSessionId = sessionData?.session_id || sessionId || 'demo-session';
    currentScreen = (
      <EndScreen
        sessionId={finalSessionId}
        problemTitle={sessionData?.interview.title || problemTitle || 'Interview Problem'}
      />
    );
  }

  return (
    <>
      {currentScreen}

      {/* Confirmation Dialog - overlays current screen */}
      {showExitConfirmation && (
        <ConfirmationDialog
          title="End Interview?"
          message="Are you sure you want to end this interview?"
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
          variant="warning"
        />
      )}

      {/* Feedback Modal - overlays current screen */}
      {showFeedbackModal && (
        <FeedbackModal
          onClose={handleSkipFeedback}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </>
  );
}
