import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
