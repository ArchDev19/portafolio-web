import React from 'react';
import './Calculator.css';
import { PaymentModal } from './PaymentModal';
import { SubscriptionPanel } from './SubscriptionPanel';
import { useCalculator } from './useCalculator';
import { CalculatorKeypad } from './CalculatorKeypad';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorErrorBoundary } from './CalculatorErrorBoundary';

/**
 * Sub-componente `CalculatorInner`.
 * Representa la interfaz de la calculadora que se conecta internamente al Store y Motores
 * a través del hook escalable `useCalculator`. Se vale del patrón de composición
 * para renderizar hijos mucho más ligeros y legibles limitando el acoplamiento.
 */
const CalculatorInner: React.FC = () => {
  // Desestructuración y delegación de estado/lógica a nuestro Hook.
  const {
    display, history,
    currentTier,
    showPayment, setShowPayment,
    showPanel, setShowPanel,
    handleNumClick, handleBackspace, handleOperatorClick,
    handleEquals, handleClear,
    handlePaymentSuccess, handleCancelSubscription
  } = useCalculator();

  return (
    <div className="calculator-layout-wrapper">
      
      {/* Botón Flotante para Ajustes Panel Premium */}
      <button className="settings-btn external" onClick={() => setShowPanel(true)} title="Ajustes de suscripción">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Grid Principal */}
      <div className="layout-grid center-only">
        <h1 className="calc-saas-title-external">Calculadora Saas</h1>
        
        {/* Cuerpo Calculadora 3D */}
        <div className="iphone-calculator">
          {/* Componente Display Desacoplado */}
          <CalculatorDisplay display={display} history={history} />
          
          {/* Componente Teclado Abstracto */}
          <CalculatorKeypad 
            onNumClick={handleNumClick}
            onOperatorClick={handleOperatorClick}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onEquals={handleEquals}
          />
        </div>
      </div>

      {/* Paneles Flotantes On-Demand */}
      {showPanel && (
         <SubscriptionPanel 
          currentTier={currentTier}
          onOpenStore={() => { setShowPanel(false); setShowPayment(true); }}
          onCancel={handleCancelSubscription}
          onClose={() => setShowPanel(false)}
        />
      )}

      {showPayment && (
        <PaymentModal 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};

/**
 * Componente Principal/Wrapper `CalculatorApp`.
 * Está exportado por defecto con un Higher Order Pattern nativo.
 * Se encuentra envuelto con el ErrorBoundary asegurándonos el 100% que 
 * un render error no derrumbe todo el portal web en producción.
 */
const CalculatorApp = () => (
  <CalculatorErrorBoundary>
    <CalculatorInner />
  </CalculatorErrorBoundary>
);

export default CalculatorApp;
