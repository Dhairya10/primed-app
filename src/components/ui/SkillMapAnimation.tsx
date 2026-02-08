import { useEffect, useState } from 'react';

export function SkillMapAnimation() {
    const [position, setPosition] = useState<'yellow' | 'green'>('yellow');
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Start moving to green
            setPosition('green');

            // 2. After it stays in green, reset to yellow invisibly
            setTimeout(() => {
                setIsResetting(true);
                setPosition('yellow');

                // 3. Make visible again after reset
                setTimeout(() => {
                    setIsResetting(false);
                }, 100);
            }, 4000);

        }, 5000);

        // Initial trigger
        setTimeout(() => {
            setPosition('green');
            setTimeout(() => {
                setIsResetting(true);
                setPosition('yellow');
                setTimeout(() => {
                    setIsResetting(false);
                }, 100);
            }, 4000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] bg-ink-950 border border-white/10 overflow-hidden flex flex-col">
            {/* Background Grid/Noise */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

            {/* Zones Container */}
            <div className="flex-1 flex relative">
                {/* Zone 1: Red */}
                <div className="flex-1 bg-red-500/5 h-full relative">
                </div>

                {/* Zone 2: Yellow */}
                <div className="flex-1 bg-yellow-500/5 h-full relative">
                </div>

                {/* Zone 3: Green */}
                <div className="flex-1 bg-green-500/5 h-full relative">
                </div>

                {/* Static Skills */}
                {/* Red Zone: Technical Awareness */}
                <div className="absolute top-[65%] left-[16.666%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-white/60 text-xs font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                            Technical Awareness
                        </span>
                        <div className="w-3 h-3 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                    </div>
                </div>

                {/* Yellow Zone: User Segmentation */}
                <div className="absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-white/60 text-xs font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                            User Segmentation
                        </span>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                    </div>
                </div>

                {/* Green Zone: Prioritization */}
                <div className="absolute top-[65%] left-[83.333%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-white/60 text-xs font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                            Prioritization
                        </span>
                        <div className="w-3 h-3 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                </div>

                {/* Moving Skill Dot */}
                <div
                    className="absolute z-20"
                    style={{
                        left: position === 'yellow' ? '50%' : '83.333%',
                        top: position === 'yellow' ? '50%' : '25%',
                        transform: 'translate(-50%, -50%)',
                        transition: isResetting ? 'none' : 'left 2s ease-in-out, top 2s ease-in-out',
                        opacity: isResetting ? 0 : 1
                    }}
                >
                    <div className="flex flex-col items-center gap-3">
                        {/* Text Label */}
                        <span className="text-white/90 text-sm font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                            Structured Thinking
                        </span>

                        {/* Dot */}
                        <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-colors duration-500 ${position === 'green' ? 'bg-green-500 shadow-green-500/50' : 'bg-yellow-500 shadow-yellow-500/50'
                            }`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
