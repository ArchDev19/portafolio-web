import { useState, useMemo, useEffect } from 'react';
import { MathEngine, type Operator } from './MathEngine';
import { SubscriptionManager, type SubscriptionTier } from './SubscriptionManager';

/**
 * Hook `useCalculator`: Centraliza la lógica de negocio, manejo de estados y orquestación
 * entre el MathEngine (cálculos) y el SubscriptionManager (niveles de acceso).
 * Extraer esta lógica en un Hook hace que el componente y su UI sean más limpios y escalables.
 */
export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  
  // Utiliza el Dependency Injection inicializando su manejador S.O.L.I.D.
  const subManager = useMemo(() => new SubscriptionManager(), []);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const [showPayment, setShowPayment] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // Instancia el motor inyectando dependencias
  const engine = useMemo(() => new MathEngine(subManager), [subManager]);

  useEffect(() => {
     setCurrentTier(subManager.getSubscription());
  }, [subManager]);

  /**
   * Maneja el click en números o el punto decimal.
   * Concatena o inicia un nuevo valor dependiendo de si venimos de un resultado (igual).
   */
  const handleNumClick = (numStr: string) => {
    if (waitingForNewValue) {
      if (history.includes('=')) setHistory(''); // Limpiar si es nueva operacion independiente
      setDisplay(numStr);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' && numStr !== '.' ? numStr : display + numStr);
    }
  };

  /**
   * Borra el último dígito tecleado (Backspace). Ignora retornos finalizados.
   */
  const handleBackspace = () => {
    if (waitingForNewValue) return; 
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  /**
   * Prepara y valida la operación matemática seleccionada (o ejecuta inmediatas como Raíz).
   * Despliega de inmediato la ventaja de pagos si el operador requiere Nivel Premium.
   */
  const handleOperatorClick = (op: Operator) => {
    // Validar en la interfaz reactiva si puede (aunque MathEngine bloquearía de todas formas atrás)
    if (['*', '/', '^', '√'].includes(op)) {
      if (!subManager.isPremium()) {
        setShowPayment(true);
        return;
      }
    }

    if (op === '√') {
      try {
        const result = engine.evaluate(parseFloat(display), null, '√');
        setHistory(`√(${display}) =`);
        let resultStr = String(result);
        if (resultStr.length > 10) resultStr = result.toPrecision(9);
        setDisplay(resultStr);
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(true);
      } catch (err) {
        setDisplay('Error');
      }
      return;
    }

    if (operator && !waitingForNewValue) {
      const current = parseFloat(display);
      let resultStr = '';
      try {
        const result = engine.evaluate(prevValue!, current, operator);
        resultStr = String(result);
        if (resultStr.length > 10) resultStr = result.toPrecision(9);
        setDisplay(resultStr);
        setPrevValue(result);
        setOperator(op);
        setHistory(`${resultStr} ${op}`);
        setWaitingForNewValue(true);
      } catch (e) {
        setDisplay('Error');
      }
      return;
    }

    setPrevValue(parseFloat(display));
    setOperator(op);
    setHistory(`${display} ${op}`);
    setWaitingForNewValue(true);
  };

  /**
   * Computa el resultado final (Equal/Igual). Coordina con MathEngine.
   */
  const handleEquals = () => {
    if (!operator || prevValue === null) return;
    try {
      const current = parseFloat(display);
      const result = engine.evaluate(prevValue, current, operator);
      let resultStr = String(result);
      if (resultStr.length > 10) resultStr = result.toPrecision(9);

      setHistory(`${prevValue} ${operator} ${current} =`);
      setDisplay(resultStr);
      setPrevValue(result);
      setOperator(null);
      setWaitingForNewValue(true);
    } catch (err: any) {
      if (err.message === 'PremiumRequired') setShowPayment(true);
      else setDisplay('Error');
    }
  };

  /**
   * Resetea el estado completo de la calculadora (Clear/C).
   */
  const handleClear = () => {
    setDisplay('0');
    setHistory('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  /**
   * Actualiza los permisos locales y reactivos del usuario tras pago comprobado.
   */
  const handlePaymentSuccess = (tier: SubscriptionTier) => {
    subManager.setSubscription(tier);
    setCurrentTier(tier);
    setShowPayment(false);
  };

  /**
   * Purga el status de Suscripción degradando a Free.
   */
  const handleCancelSubscription = () => {
    subManager.cancelSubscription();
    setCurrentTier('free');
  };

  return {
    display,
    history,
    currentTier,
    showPayment, setShowPayment,
    showPanel, setShowPanel,
    handleNumClick,
    handleBackspace,
    handleOperatorClick,
    handleEquals,
    handleClear,
    handlePaymentSuccess,
    handleCancelSubscription
  };
};
