import { useRef, MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';

export function CTASection() {
  const primedRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (primedRef.current) {
      const rect = primedRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      primedRef.current.style.setProperty('--spotlight-x', `${x}px`);
      primedRef.current.style.setProperty('--spotlight-y', `${y}px`);
    }
  };

  const handleMouseEnter = () => {
    if (primedRef.current) {
      primedRef.current.style.setProperty('--spotlight-opacity', '1');
    }
  };

  const handleMouseLeave = () => {
    if (primedRef.current) {
      primedRef.current.style.setProperty('--spotlight-opacity', '0');
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-full mx-auto text-center px-4 md:px-6">
        <h2 className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8">
          You ARE qualified. Now let's make sure you sound like it
        </h2>

        <div className="mb-12 md:mb-16">
          <Link
            to="/signup"
            className="group inline-block bg-white text-black px-9 py-[18px] md:px-12 md:py-6 text-lg md:text-xl font-semibold relative overflow-hidden min-h-[66px] touch-manipulation transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.8),0_0_80px_rgba(255,255,255,0.4)] active:scale-[1.02]"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 animate-shimmer" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}></div>
            </div>
          </Link>
        </div>

        <div
          ref={primedRef}
          className="relative inline-block select-none cursor-default"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            fontSize: 'min(25vw, 400px)',
            fontWeight: 'bold',
            lineHeight: '0.8',
          }}
        >
          <div
            className="relative"
            style={{
              color: 'rgba(255,255,255,0.03)',
            }}
          >
            PRIMED
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              color: 'rgba(255,255,255,0.9)',
              opacity: 'var(--spotlight-opacity, 0)',
              transition: 'opacity 300ms ease',
              maskImage: 'radial-gradient(circle 150px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle 150px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
            }}
          >
            PRIMED
          </div>
        </div>
      </div>
    </section>
  );
}
