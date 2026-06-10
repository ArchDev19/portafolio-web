import React from 'react';
import type { Operator } from './MathEngine';
import './Calculator.css';

interface CalculatorKeypadProps {
  onNumClick: (num: string) => void;
  onOperatorClick: (op: Operator) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
}

/**
 * Componente visual: `CalculatorKeypad`
 * Engloba la botonera del iPhone. Desacoplar este componente nos permite el día de mañana
 * re-escribir el layout de botones enteros (Ej. cambiar de iPhone a estandar Android)
 * independientemente del lógica MathEngine.
 */
export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onNumClick, onOperatorClick, onClear, onBackspace, onEquals
}) => {
  return (
    <div className="iphone-keypad">
      {/* Botones de Control y Superiores */}
      <button className="btn-iphone btn-top" onClick={onClear}>C</button>
      <button className="btn-iphone btn-top" onClick={onBackspace}>⌫</button>
      <button className="btn-iphone btn-top" onClick={() => onOperatorClick('√')}>√</button>
      <button className="btn-iphone btn-operator" onClick={() => onOperatorClick('/')}>÷</button>

      {/* Clúster 7-9 */}
      <button className="btn-iphone btn-num" onClick={() => onNumClick('7')}>7</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('8')}>8</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('9')}>9</button>
      <button className="btn-iphone btn-operator" onClick={() => onOperatorClick('*')}>×</button>

      {/* Clúster 4-6 */}
      <button className="btn-iphone btn-num" onClick={() => onNumClick('4')}>4</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('5')}>5</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('6')}>6</button>
      <button className="btn-iphone btn-operator" onClick={() => onOperatorClick('-')}>-</button>

      {/* Clúster 1-3 */}
      <button className="btn-iphone btn-num" onClick={() => onNumClick('1')}>1</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('2')}>2</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('3')}>3</button>
      <button className="btn-iphone btn-operator" onClick={() => onOperatorClick('+')}>+</button>

      {/* Clúster Base y Zero */}
      <button className="btn-iphone btn-num btn-zero" onClick={() => onNumClick('0')}>0</button>
      <button className="btn-iphone btn-num" onClick={() => onNumClick('.')}>.</button>
      <button className="btn-iphone btn-operator" onClick={onEquals}>=</button>
    </div>
  );
};
