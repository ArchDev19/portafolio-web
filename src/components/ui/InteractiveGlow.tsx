import React, { useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

interface InteractiveGlowProps {
  color?: string;       // El color de la linterna (Ej. 'rgba(129, 236, 255, 0.5)')
  radius?: string;      // El tamaño del foco (Para iluminar 1-2 tarjetas recomendamos 400px o 500px)
  intensity?: number;   // Opacidad/brillo de 0.0 a 1.0 (Open-Closed Principle: Fácil de extender)
}

// Single Responsibility: Su único trabajo es pintar un desenfoque radial en la posición X/Y.
export const InteractiveGlow: React.FC<InteractiveGlowProps> = ({ 
  color = 'rgba(129, 236, 255, 0.9)', 
  radius = '450px', 
  intensity = 1 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',   // Permite clickear tarjetas debajo del brillo
        zIndex: 0,               // Detrás de las tarjetas (deben tener z-index relativo)
        overflow: 'hidden',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width: radius,
          height: radius,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color} 0%, rgba(129,236,255,0.2) 30%, transparent 60%)`,
          opacity: intensity,
          filter: 'blur(30px)',  
          mixBlendMode: 'color-dodge', // Causa destellos en contraste absoluto contra fondos oscuros
        }}
      />
    </div>
  );
};
