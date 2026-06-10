import React from 'react';
import './Calculator.css';
import type { SubscriptionTier } from './SubscriptionManager';

interface SubscriptionPanelProps {
  currentTier: SubscriptionTier;
  onOpenStore: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ currentTier, onOpenStore, onCancel, onClose }) => {
  
  const renderContent = () => {
    switch (currentTier) {
      case 'free':
        return (
          <>
            <div className="panel-status free">Nivel: Free</div>
            <div className="benefits-list">
              <p>Funciones habilitadas:</p>
              <ul>
                <li>✔ Sumar</li>
                <li>✔ Restar</li>
                <li className="locked-benefit">✖ Multiplicar</li>
                <li className="locked-benefit">✖ Dividir</li>
                <li className="locked-benefit">✖ Raíces</li>
              </ul>
            </div>
            <div className="upsell-box">
              <h4>¿Necesitas más poder?</h4>
              <p>Desbloquea multiplicaciones y operaciones complejas.</p>
              <button className="upsell-btn" onClick={onOpenStore}>Ver Planes VIP</button>
            </div>
          </>
        );
      case '1_month':
        return (
          <>
            <div className="panel-status active">Nivel: Mes Básico</div>
            <div className="benefits-list">
              <p>Funciones habilitadas:</p>
              <ul>
                <li>✔ Sumar</li>
                <li>✔ Restar</li>
                <li>✔ Multiplicar</li>
                <li className="locked-benefit">✖ Dividir</li>
                <li className="locked-benefit">✖ Raíces</li>
              </ul>
            </div>
            <div className="upsell-box">
              <h4>Ahorra a largo plazo</h4>
              <p>Adquiere 6 Meses o 1 Año y domina todas las disciplinas.</p>
              <button className="upsell-btn" onClick={onOpenStore}>Mejorar Plan</button>
            </div>
            <button className="cancel-btn" onClick={onCancel}>Cancelar Suscripción</button>
          </>
        );
      case '6_months':
         return (
          <>
            <div className="panel-status active">Nivel: 6 Meses Pro</div>
            <div className="benefits-list">
              <p>Funciones habilitadas:</p>
              <ul>
                 <li>✔ Sumar</li>
                 <li>✔ Restar</li>
                 <li>✔ Multiplicar</li>
                 <li>✔ Dividir</li>
                 <li>✔ Raíces</li>
              </ul>
            </div>
            <div className="upsell-box">
              <h4>Conviértete en VIP</h4>
              <p>Obten el estatus máximo permanentemente.</p>
              <button className="upsell-btn" onClick={onOpenStore}>Mejorar Plan Anual</button>
            </div>
            <button className="cancel-btn" onClick={onCancel}>Cancelar Suscripción</button>
          </>
        );
      case '1_year':
        return (
          <>
            <div className="panel-status vip">Nivel: Anual Ultra VIP</div>
            <div className="benefits-list">
              <p>Todo el Catálogo Abierto:</p>
              <ul>
                 <li>✔ Sumar</li>
                 <li>✔ Restar</li>
                 <li>✔ Multiplicar</li>
                 <li>✔ Dividir</li>
                 <li>✔ Raíces</li>
                 <li>✔ Status Privilegiado VIP</li>
              </ul>
            </div>
            <div className="congrats-box">
                <h3>¡Felicidades! 🎉</h3>
                <p>Posees el grado máximo en nuestra plataforma. Disfruta de todo sin límites.</p>
            </div>
            <button className="cancel-btn" onClick={onCancel}>Cancelar Suscripción</button>
          </>
        );
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="subscription-modal-container glass-panel animate-fade-in">
        <button className="payment-close-btn" onClick={onClose}>&times;</button>
        <h2 style={{marginTop: '0', color: '#fff'}}>Ajustes de Cuenta</h2>
        {renderContent()}
      </div>
    </div>
  );
};
