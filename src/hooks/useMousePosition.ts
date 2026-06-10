import { useState, useEffect, type RefObject } from 'react';

// Single Responsibility Principle: Este hook SOLO calcula matemáticamente dónde está el puntero relativo a un bloque.
export const useMousePosition = (ref: RefObject<HTMLElement | null>) => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 }); // Fuera de pantalla al iniciar

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // Calculates relative position to the container top-left origin
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    // Tracking movement inside the section container for optimized rendering
    const target = ref.current;
    if (target) {
      target.addEventListener('mousemove', handleMouseMove as EventListener);
    }
    
    return () => {
      if (target) {
        target.removeEventListener('mousemove', handleMouseMove as EventListener);
      }
    };
  }, [ref]);

  return mousePosition;
};
