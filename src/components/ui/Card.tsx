import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  padding?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Card({
  children,
  hover = false,
  padding = true,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CardProps) {
  return (
    <div
      className={`
        bg-white/[0.03] border-2 border-white/20
        ${hover ? 'hover:border-white/40 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer' : ''}
        ${padding ? 'p-4 md:p-6' : ''}
        ${className}
      `.trim()}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
