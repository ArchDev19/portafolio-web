import React from 'react';
import './Calculator.css';

interface CalculatorDisplayProps {
  history: string;
  display: string;
}

/**
 * Componente abstracto: `CalculatorDisplay`
 * Renderiza la pantalla animada de estilo vidrio templado de la calculadora.
 * Muestra el historial de las operaciones así como el número procesado actual.
 */
export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ history, display }) => {
  return (
    <div className="display-screen">
       <div className="display-history-dual">{history}</div>
       <span className="display-text">{display}</span>
    </div>
  );
};
