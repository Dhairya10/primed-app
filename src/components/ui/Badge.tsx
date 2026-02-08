import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-white/15 text-white border border-white/20',
    outline: 'bg-white/[0.03] border border-white/15 text-white',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
