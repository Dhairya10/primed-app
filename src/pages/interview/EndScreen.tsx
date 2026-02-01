import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface EndScreenProps {
  sessionId: string;
  problemTitle: string;
}

type ScreenStage = 'celebration' | 'reflection';

export function EndScreen({
  sessionId,
  problemTitle: _problemTitle,
}: EndScreenProps) {
  const [stage, setStage] = useState<ScreenStage>('celebration');
  const [showConfetti, setShowConfetti] = useState(false);



  // Celebration animation sequence
  useEffect(() => {
    // Clear localStorage lock
    localStorage.removeItem(`interview-lock-${sessionId}`);

    // Show confetti after brief delay
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    // Transition to feedback info screen after celebration
    const feedbackInfoTimer = setTimeout(() => {
      setStage('reflection');
      setShowConfetti(false);
    }, 6000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(feedbackInfoTimer);
    };
  }, [sessionId]);

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Celebration Stage
  if (stage === 'celebration') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-radial opacity-30 animate-gradient-pulse" />

        {/* Particle Burst Animation */}
        {showConfetti && (
          <>
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(60)].map((_, i) => {
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#f38181', '#95e1d3'];
                const angle = (i / 60) * 360;
                return (
                  <div
                    key={`confetti-${i}`}
                    className="confetti-particle"
                    style={{
                      '--angle': `${angle}deg`,
                      '--distance': `${150 + Math.random() * 200}px`,
                      '--duration': `${1.5 + Math.random() * 1}s`,
                      '--delay': `${Math.random() * 0.3}s`,
                      background: colors[Math.floor(Math.random() * colors.length)],
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>

            {/* Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`sparkle-${i}`}
                  className="sparkle"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="max-w-lg w-full text-center space-y-8 relative z-10">
          {/* Animated Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Ripple effect */}
              <div className="absolute inset-0 w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ripple" />
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ripple-delay" />
              </div>

              {/* Check mark circle */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-pop-in shadow-2xl shadow-green-500/50">
                <svg
                  className="w-14 h-14 text-white animate-draw-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent animate-title-reveal">
              Congratulations!
            </h1>
            <p className="text-lg text-white/80 animate-subtitle-reveal">
              You've completed the interview
            </p>
          </div>
        </div>

        <style>{`
          @keyframes gradient-pulse {
            0%, 100% {
              background: radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
            }
            50% {
              background: radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 60%);
            }
          }

          @keyframes confetti-burst {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%)
                         translate(
                           calc(cos(var(--angle)) * var(--distance)),
                           calc(sin(var(--angle)) * var(--distance))
                         )
                         rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes sparkle-twinkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1) rotate(180deg);
            }
          }

          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }

          @keyframes pop-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes draw-check {
            0% {
              stroke-dasharray: 0, 100;
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              stroke-dasharray: 100, 100;
              opacity: 1;
            }
          }

          @keyframes title-reveal {
            0% {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
              filter: blur(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes subtitle-reveal {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-gradient-pulse {
            animation: gradient-pulse 3s ease-in-out infinite;
          }

          .confetti-particle {
            position: absolute;
            width: 12px;
            height: 12px;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            animation: confetti-burst var(--duration) ease-out var(--delay) forwards;
          }

          .sparkle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: sparkle-twinkle 2s ease-in-out infinite;
          }

          .animate-ripple {
            animation: ripple 2s ease-out infinite;
          }

          .animate-ripple-delay {
            animation: ripple 2s ease-out 1s infinite;
          }

          .animate-pop-in {
            animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
          }

          .animate-draw-check {
            animation: draw-check 0.8s ease-out 0.6s both;
          }

          .animate-title-reveal {
            animation: title-reveal 0.8s ease-out 1s both;
          }

          .animate-subtitle-reveal {
            animation: subtitle-reveal 0.6s ease-out 1.4s both;
          }
        `}</style>
      </div>
    );
  }

  // Feedback Info Stage (formerly Reflection Stage)
  if (stage === 'reflection') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8 animate-fade-in-smooth">
          {/* Main message */}
          <div className="animate-fade-in-delay-1">
            <p className="text-xl md:text-2xl text-white">
              Your feedback will be ready in ~2 minutes
            </p>
          </div>

          {/* Go to Dashboard Button */}
          <div className="animate-fade-in-delay-3">
            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="w-full md:w-auto"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        <style>{`
          @keyframes fade-in-smooth {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-smooth {
            animation: fade-in-smooth 0.8s ease-out;
          }

          .animate-fade-in-delay-1 {
            opacity: 0;
            animation: fade-in-up 0.6s ease-out 0.2s forwards;
          }

          .animate-fade-in-delay-2 {
            opacity: 0;
            animation: fade-in-up 0.6s ease-out 0.4s forwards;
          }

          .animate-fade-in-delay-3 {
            opacity: 0;
            animation: fade-in-up 0.6s ease-out 0.6s forwards;
          }
        `}</style>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}
