import { useState, useEffect } from 'react';

export function VideoCallAnimation() {
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewerSpeaking((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-black/30 border border-white/10 overflow-hidden p-4 md:p-6">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Interviewer Video */}
        <div
          className={`relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 transition-all duration-300 overflow-hidden ${
            interviewerSpeaking
              ? 'border-green-500 shadow-lg shadow-green-500/20'
              : 'border-white/10'
          }`}
        >
          {/* Video placeholder with avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold" style={{ backgroundColor: '#4EAEB5' }}>
              P
            </div>
          </div>

          {/* Name tag */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5">
            <span className="text-white text-xs font-medium">Interviewer</span>
          </div>

          {/* Speaking indicator */}
          {interviewerSpeaking && (
            <div className="absolute top-3 right-3">
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${12 + i * 4}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Candidate Video */}
        <div
          className={`relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 transition-all duration-300 overflow-hidden ${
            !interviewerSpeaking
              ? 'border-green-500 shadow-lg shadow-green-500/20'
              : 'border-white/10'
          }`}
        >
          {/* Video placeholder with avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
              A
            </div>
          </div>

          {/* Name tag */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5">
            <span className="text-white text-xs font-medium">You</span>
          </div>

          {/* Speaking indicator */}
          {!interviewerSpeaking && (
            <div className="absolute top-3 right-3">
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${12 + i * 4}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
