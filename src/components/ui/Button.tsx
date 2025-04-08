import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-[#3861FB] text-white hover:bg-[#2D52E0] focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-[#E63946] text-white hover:bg-[#D32F3D] focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
};

const sizeStyles = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-base px-4 py-2 rounded-lg',
  lg: 'text-lg px-6 py-3 rounded-lg'
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}; 