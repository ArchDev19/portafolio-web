import React, { useMemo } from 'react';
import './taskManager.css';

interface TypewriterPunchTextProps {
  text: string;
}

const TypewriterPunchText: React.FC<TypewriterPunchTextProps> = ({ text }) => {
  // We want to persist the random rotations for each character index
  // so they don't jump around when text changes
  const rotations = useMemo(() => {
    return Array.from({ length: 200 }).map(() => {
      // Random rotation between -15deg and +15deg
      return Math.random() * 30 - 15;
    });
  }, []);

  if (!text) return null;

  return (
    <div className="tm-punch-text-container">
      {text.split('').map((char, index) => {
        const rotation = rotations[index] || 0;
        return (
          <span
            key={`${index}-${char}`}
            className="tm-punch-char"
            style={{
              '--rot': `${rotation}deg`
            } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

export default TypewriterPunchText;
