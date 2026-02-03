import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            // Variants
            'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
            'text-primary-700 bg-white border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500': variant === 'secondary',
            'text-secondary-700 bg-transparent border-2 border-secondary-300 hover:border-secondary-400 hover:bg-secondary-50 focus:ring-secondary-500': variant === 'outline',
            'text-secondary-600 bg-transparent hover:bg-secondary-100 focus:ring-secondary-500': variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
