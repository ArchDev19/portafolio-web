import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TypewriterRevealProps {
  text: string;
  speed?: number; // ms per letter
  style?: React.CSSProperties;
}

// Single Responsibility Principle: Solo muestra texto tipo consola de sistema una vez cuando entra a la vista. No lo borra.
export const TypewriterReveal: React.FC<TypewriterRevealProps> = ({ text, speed = 15, style }) => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeout: number;

    if (isIntersecting && displayedText.length < text.length) {
      timeout = window.setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
    }

    return () => window.clearTimeout(timeout);
  }, [displayedText, isIntersecting, text, speed]);

  return (
    <p ref={ref} style={style}>
      {displayedText}
      {isIntersecting && displayedText.length < text.length && (
        <span className="animate-pulse-slow text-primary">|</span>
      )}
    </p>
  );
};
