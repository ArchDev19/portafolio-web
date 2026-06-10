import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card = ({ 
  children, 
  className = '',
  hoverEffect = true,
  style,
  ...props
}: CardProps) => {

  return (
    <div 
      className={`glass-panel rounded-xl p-8 border border-white/10 ${hoverEffect ? 'glow-card neon-border' : ''} ${className}`}
      style={{ ...style, borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {children}
    </div>
  );
};
