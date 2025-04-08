import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const elevationStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
};

export const Card = ({
  children,
  className = '',
  elevation = 'md',
  onClick
}: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 
        ${elevationStyles[elevation]}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 