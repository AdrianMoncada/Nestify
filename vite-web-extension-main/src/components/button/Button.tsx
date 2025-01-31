import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'default';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  icon,
  className = '',
  ...props
}) => {
  const baseStyle = "rounded-xl flex items-center justify-center border-2 border-[#784E2F] transition-all text-thicker";
  const variantStyles = {
    primary: `${baseStyle} w-full py-3 bg-yellow text-brown hover:text-[#957F66] text-lg hover:border-lightBrown hover:shadow-[0_5px_0_#957F66] active:translate-y-[5px] active:shadow-[0_0_0_#784E2F] shadow-[0_5px_0_#784E2F]`,
    default: `${baseStyle} bg-white hover:border-lightBrown hover:shadow-[0_5px_0_#957F66] active:translate-y-[5px] active:shadow-[0_0_0_#784E2F] shadow-[0_5px_0_#784E2F]`
  };

  return (
    <button
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;