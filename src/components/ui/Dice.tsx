const DICE_SIZE_DESKTOP = 300;
const DICE_SIZE_MOBILE = 180;
const DOT_SIZE_DESKTOP = 45;
const DOT_SIZE_MOBILE = 28;

const DiceFace = ({
  children,
  transform,
  size,
}: {
  children: React.ReactNode;
  transform: string;
  size: number;
}) => (
  <div
    className="absolute flex items-center justify-center"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      border: '3px solid rgba(255, 255, 255, 0.2)',
      boxShadow: `
        inset 0 0 40px rgba(0, 0, 0, 0.7),
        inset -8px -8px 20px rgba(0, 0, 0, 0.4),
        inset 8px 8px 15px rgba(255, 255, 255, 0.05)
      `,
      transform,
      borderRadius: '12px',
    }}
  >
    {children}
  </div>
);

const Dot = ({ size }: { size: number }) => (
  <div
    className="rounded-full"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      background: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0 60%, #c0c0c0)',
      boxShadow: `
        0 4px 12px rgba(255, 255, 255, 0.5),
        inset 0 2px 4px rgba(0, 0, 0, 0.3),
        inset 0 -2px 4px rgba(255, 255, 255, 0.4)
      `,
    }}
  />
);

export function Dice() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const DICE_SIZE = isMobile ? DICE_SIZE_MOBILE : DICE_SIZE_DESKTOP;
  const HALF_SIZE = DICE_SIZE / 2;
  const DOT_SIZE = isMobile ? DOT_SIZE_MOBILE : DOT_SIZE_DESKTOP;
  const PADDING = isMobile ? 28 : 45;
  const PERSPECTIVE = isMobile ? '1200px' : '1800px';

  return (
    <div
      className="relative w-full max-w-[180px] md:max-w-[300px] mx-auto"
      style={{
        aspectRatio: '1',
        perspective: PERSPECTIVE,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          animation: 'rotateDice 16s infinite ease-in-out',
        }}
      >
        {/* Front face - 1 dot */}
        <DiceFace transform={`translateZ(${HALF_SIZE}px)`} size={DICE_SIZE}>
          <Dot size={DOT_SIZE} />
        </DiceFace>

        {/* Back face - 6 dots */}
        <DiceFace
          transform={`rotateY(180deg) translateZ(${HALF_SIZE}px)`}
          size={DICE_SIZE}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full items-center justify-items-center"
            style={{ padding: `${PADDING}px` }}
          >
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
          </div>
        </DiceFace>

        {/* Right face - 3 dots */}
        <DiceFace
          transform={`rotateY(90deg) translateZ(${HALF_SIZE}px)`}
          size={DICE_SIZE}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full items-center justify-items-center"
            style={{ padding: `${PADDING}px` }}
          >
            <Dot size={DOT_SIZE} />
            <div />
            <div />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <div />
            <div />
            <Dot size={DOT_SIZE} />
          </div>
        </DiceFace>

        {/* Left face - 4 dots */}
        <DiceFace
          transform={`rotateY(-90deg) translateZ(${HALF_SIZE}px)`}
          size={DICE_SIZE}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full items-center justify-items-center"
            style={{ padding: `${PADDING}px` }}
          >
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <div />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
          </div>
        </DiceFace>

        {/* Top face - 5 dots */}
        <DiceFace
          transform={`rotateX(90deg) translateZ(${HALF_SIZE}px)`}
          size={DICE_SIZE}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full items-center justify-items-center"
            style={{ padding: `${PADDING}px` }}
          >
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
            <div />
            <Dot size={DOT_SIZE} />
          </div>
        </DiceFace>

        {/* Bottom face - 2 dots */}
        <DiceFace
          transform={`rotateX(-90deg) translateZ(${HALF_SIZE}px)`}
          size={DICE_SIZE}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full items-center justify-items-center"
            style={{ padding: `${PADDING}px` }}
          >
            <Dot size={DOT_SIZE} />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <Dot size={DOT_SIZE} />
          </div>
        </DiceFace>
      </div>
    </div>
  );
}
