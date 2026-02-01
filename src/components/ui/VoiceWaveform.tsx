export function VoiceWaveform() {
  return (
    <div className="relative h-[500px] md:h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Line graph trending upward */}
      <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden px-8">
        <svg
          className="graph-svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Grid lines for context */}
          <g className="grid-lines" opacity="0.03">
            <line x1="100" y1="200" x2="900" y2="200" stroke="white" strokeWidth="0.3" />
            <line x1="100" y1="400" x2="900" y2="400" stroke="white" strokeWidth="0.3" />
            <line x1="100" y1="600" x2="900" y2="600" stroke="white" strokeWidth="0.3" />
            <line x1="100" y1="800" x2="900" y2="800" stroke="white" strokeWidth="0.3" />
          </g>
          
          {/* Upward trending line graph */}
          <path
            className="graph-line"
            d="M100,850 L200,820 L300,780 L400,720 L500,640 L600,540 L700,420 L800,280 L900,150"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Arrow at the top of the graph */}
          <g className="graph-arrow" transform="translate(900, 150)">
            <path
              d="M0,-20 L0,0 M0,0 L-12,-12 M0,0 L12,-12"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Subtle circular glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-96 h-96 md:w-[600px] md:h-[600px] rounded-full bg-gradient-radial from-white/5 to-transparent animate-pulse-slow" />
      </div>
    </div>
  );
}
