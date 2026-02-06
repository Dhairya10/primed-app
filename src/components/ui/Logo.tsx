interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} ${className}`}
    >
      {/* Vertical stem of P */}
      <rect x="0" y="0" width="10" height="48" fill="currentColor" />
      {/* Top connector of P */}
      <rect x="10" y="0" width="30" height="8" fill="currentColor" />
      {/* Right side of bump */}
      <rect x="32" y="8" width="8" height="16" fill="currentColor" />
      {/* Middle connector closing the bump */}
      <rect x="10" y="24" width="30" height="8" fill="currentColor" />
    </svg>
  );
}
