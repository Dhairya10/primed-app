import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 bg-white/5 border-2 border-white/20
              text-white placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
              disabled:bg-white/5 disabled:cursor-not-allowed
              transition-colors duration-200
              min-h-[44px]
              backdrop-blur-sm
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-400/50 focus:ring-red-400/30 focus:border-red-400/50' : ''}
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-300 flex items-center mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
