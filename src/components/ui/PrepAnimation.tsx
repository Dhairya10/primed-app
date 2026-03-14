import { useEffect, useRef, useState } from 'react';
import airbnbLogo from '../../assets/company-logos/airbnb.png';
import netflixLogo from '../../assets/company-logos/netflix.png';
import stripeLogo from '../../assets/company-logos/stripe.png';

const SCENARIOS = [
  {
    company: 'Airbnb',
    logo: airbnbLogo,
    problem: 'Evaluate the tradeoffs of adding mandatory ID verification for all new guests',
  },
  {
    company: 'Netflix',
    logo: netflixLogo,
    problem: 'How would you redesign content discovery for non-English speaking markets?',
  },
  {
    company: 'Stripe',
    logo: stripeLogo,
    problem: 'How would you improve checkout conversion rates for merchants using Stripe Elements?',
  },
];

type AnimPhase = 'dot-travel' | 'typing' | 'exit';

export function PrepAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<AnimPhase>('dot-travel');
  const [typedText, setTypedText] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [mergeGlow, setMergeGlow] = useState(false);
  const [orbExiting, setOrbExiting] = useState(false);
  const [orbSnapMode, setOrbSnapMode] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS[activeIndex];

  const startTyping = (text: string, onDone: () => void) => {
    setTypedText('');
    let i = 0;
    const speed = 38;
    const tick = () => {
      i++;
      setTypedText(text.slice(0, i));
      if (i < text.length) {
        typingRef.current = setTimeout(tick, speed);
      } else {
        onDone();
      }
    };
    typingRef.current = setTimeout(tick, speed);
  };

  useEffect(() => {
    const clearAll = () => {
      if (typingRef.current) clearTimeout(typingRef.current);
      if (phaseRef.current) clearTimeout(phaseRef.current);
    };
    clearAll();

    if (phase === 'dot-travel') {
      setShowLogo(false);
      phaseRef.current = setTimeout(() => {
        // Dot has arrived at orb boundary — fire logo + glow simultaneously
        setShowLogo(true);
        setMergeGlow(true);
        setTimeout(() => setMergeGlow(false), 900);
        setPhase('typing');
      }, 800);
    } else if (phase === 'typing') {
      startTyping(scenario.problem, () => {
        phaseRef.current = setTimeout(() => setPhase('exit'), 2000);
      });
    } else if (phase === 'exit') {
      setTypedText('');
      setShowLogo(false);
      setOrbExiting(true);
      phaseRef.current = setTimeout(() => {
        // Snap orb back to center invisibly (no transition)
        setOrbSnapMode(true);
        setOrbExiting(false);
        setTimeout(() => {
          setOrbSnapMode(false);
          setActiveIndex(prev => (prev + 1) % SCENARIOS.length);
          setPhase('dot-travel');
        }, 50);
      }, 700);
    }

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeIndex]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-ink-950 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-8 font-sans gap-10">

      {/* Ambient glow behind orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-paper-50/3 blur-3xl rounded-full pointer-events-none" />

      {/* Row containing: travelling dot + animated orb */}
      <div className="relative w-full h-20 flex items-center justify-center">

        {/* Orb — transparent with subtle ring, absolutely positioned for x-animation */}
        <div
          className="absolute top-1/2 w-[72px] h-[72px] bg-transparent border border-white/15 flex items-center justify-center z-10 overflow-hidden"
          style={{
            left: orbExiting ? '85%' : '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: (orbExiting || orbSnapMode) ? 0 : 1,
            transition: orbSnapMode
              ? 'none'
              : orbExiting
                ? 'left 0.6s ease-in, opacity 0.5s ease'
                : 'opacity 0.3s ease',
            animation: mergeGlow ? 'orbPulse 0.9s ease-out forwards' : 'none',
          }}
        >
          <img
            src={scenario.logo}
            alt={scenario.company}
            className="w-14 h-14 object-contain"
            style={{ opacity: showLogo ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        </div>

      </div>

      {/* Problem text */}
      <div className="w-full max-w-sm min-h-[100px] flex flex-col justify-start">
        <p className="text-paper-100 text-base md:text-lg font-medium leading-relaxed text-center">
          {typedText}
          {phase === 'typing' && (
            <span className="inline-block w-0.5 h-4 bg-paper-50 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          35%  { box-shadow: 0 0 18px 6px rgba(255,255,255,0.18); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  );
}
