import React from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string; // Por ejemplo "section-title"
  style?: React.CSSProperties;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, className = '', style }) => {
  // Convertimos el string a un array para procesar cada letra individualmente.
  const letters = text.split('');

  return (
    <h2 
      className={`hover-wave-container ${className}`} 
      style={{ ...style, display: 'inline-block', whiteSpace: 'pre' }}
    >
      {letters.map((letter, index) => {
        // Los espacios los renderizamos vacíos
        if (letter === ' ') {
          return <span key={index}>&nbsp;</span>;
        }

        return (
          <span 
            key={index} 
            className="wave-span"
            style={{
              display: 'inline-block',
              transition: 'all 0.3s ease',
              // Cada letra tiene su retraso, por lo que el Hover lanzará la ola escalonada perfectamante
              animationDelay: `${index * 0.05}s`
            }}
          >
            {letter}
          </span>
        );
      })}
    </h2>
  );
};
