import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spin' | 'pulse' | 'dots';
  color?: 'primary' | 'secondary' | 'gray';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spin', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-indigo-500',
    secondary: 'border-purple-500',
    gray: 'border-gray-500'
  };

  if (variant === 'spin') {
    return (
      <div 
        className={`animate-spin rounded-full border-2 border-transparent border-t-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      />
    );
  }

  if (variant === 'pulse') {
    return (
      <div 
        className={`animate-pulse rounded-full ${sizeClasses[size]} ${color === 'primary' ? 'bg-indigo-500' : color === 'secondary' ? 'bg-purple-500' : 'bg-gray-500'} ${className}`}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full animate-bounce ${
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            } ${
              color === 'primary' ? 'bg-indigo-500' : 
              color === 'secondary' ? 'bg-purple-500' : 'bg-gray-500'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  }

  return null;
} 