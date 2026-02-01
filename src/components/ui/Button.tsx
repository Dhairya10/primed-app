import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses =
    'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation';

  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200',
    secondary:
      'bg-transparent text-white border-2 border-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  };

  return (
    <button
      ref={ref}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
