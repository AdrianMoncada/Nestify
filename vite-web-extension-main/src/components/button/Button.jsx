import React from 'react';
import { buttonVariants } from './ButtonVariants';

export const Button = ({ 
  children, 
  variant = 'primary', 
  icon,
  selected,
  size,
  className = '',
  ...props 
}) => {
  const variantStyles = buttonVariants[variant];
  
  // Size presets
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-14 h-14",
    xl: "w-16 h-16",
    full: "w-full",
  };

  const buttonClasses = `
    ${variantStyles.base}
    ${variantStyles.hover}
    ${variantStyles.active}
    ${size ? sizeClasses[size] : ''}
    ${selected ? variantStyles.selectedClass : ''}
    ${className}
  `;

  return (
    <div className="relative">
      <button 
        className={`relative z-10 ${buttonClasses} ${variantStyles.withShadow ? 'mb-3' : ''}`}
        {...props}
      >
        {icon && icon}
        {children}
      </button>
      {variantStyles.withShadow && (
        <div 
          className={`absolute -z-10 border-2 border-[#784E2F] ${size ? sizeClasses[size] : 'w-full h-12'}`}
          style={{
            top: variantStyles.shadowHeight || 12,
            backgroundColor: variantStyles.shadowColor,
            borderRadius: buttonClasses.includes('rounded-3xl') ? '1.5rem' : 
                         buttonClasses.includes('rounded-2xl') ? '1rem' : 
                         buttonClasses.includes('rounded-full') ? '9999px' : '0'
          }}
        />
      )}
    </div>
  );
};

export default Button;