import React from 'react';
import { designTokens } from '../../utils/designTokens';
import { cn } from '../../utils/cn';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-md border border-gray-200';
  
  const variants = {
    default: 'border-gray-200',
    primary: 'border-red-800',
    success: 'border-green-600',
    warning: 'border-yellow-500',
    error: 'border-red-600'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const hoverStles = hover ? 'transition-shadow hover:shadow-lg' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
