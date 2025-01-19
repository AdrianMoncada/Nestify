import React from 'react';
import { buttonVariants } from './ButtonVariants';

export const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '',
  ...props 
}) => {
  const variantStyles = buttonVariants[variant];
  
  return (
    <div className="relative">
      <button 
        className={`
          ${variantStyles.base}
          ${variantStyles.hover}
          ${variantStyles.active}
          relative z-10 mb-3
          ${className}
        `}
        {...props}
      >
        {icon === 'google' && (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
        )}
        {children}
      </button>
      {variantStyles.withShadow && (
        <div className="w-full h-12 absolute top-3 -z-10 bg-[#E6B449] rounded-3xl border-2 border-[#784E2F]"></div>
      )}
    </div>
  );
};