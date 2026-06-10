import React, { useState } from 'react';
import './Calculator.css';
import type { SubscriptionTier } from './SubscriptionManager';

interface PaymentModalProps {
  onSuccess: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onSuccess, onClose }) => {
  const [step, setStep] = useState<'select' | 'pay'>('select');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;
    
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(selectedTier);
      }, 2000); 
    }, 3000);
  };

  const handleSelectPlan = (tier: SubscriptionTier) => {
     setSelectedTier(tier);
     setStep('pay');
  };

  return (
    <div className="payment-modal-overlay">
      <div className="glass-panel animate-fade-in" style={{ maxWidth: step === 'pay' ? '550px' : '500px' }}>
        <button className="payment-close-btn" onClick={onClose} disabled={loading || success}>&times;</button>
        
        {success ? (
          <div className="payment-success animate-fade-in">
            <div className="success-icon">✓</div>
            <h2>¡Pago Exitoso!</h2>
            <p>Bienvenido. Disfruta de tus nuevos beneficios.</p>
          </div>
        ) : step === 'select' ? (
          <div className="payment-select-step animate-fade-in">
            <div className="payment-header">
              <h2>Elige tu Nivel</h2>
              <p className="payment-subtitle">Exprime tu contabilidad al máximo.</p>
            </div>
            
            <div className="pricing-cards">
              <div 
                className="pricing-card"
                onClick={() => handleSelectPlan('1_month')}
              >
                <h4>1 Mes</h4>
                <p>$3.99</p>
                <small>Multiplicación</small>
              </div>

              <div 
                 className="pricing-card recommended"
                 onClick={() => handleSelectPlan('6_months')}
              >
                <span className="pop-badge">Popular</span>
                <h4>6 Meses</h4>
                <p>$19.99</p>
                <small>Todo lo básico</small>
              </div>

              <div 
                className="pricing-card"
                onClick={() => handleSelectPlan('1_year')}
              >
                <h4>1 Año</h4>
                <p>$34.99</p>
                <small>VIP + Funciones</small>
              </div>
            </div>
          </div>
        ) : (
          <form className="payment-form animate-fade-in" onSubmit={handleSimulatePayment}>
            <div className="payment-header">
              <h2>Pasarela Protegida</h2>
              <p className="payment-subtitle">Ingresa tus datos para continuar.</p>
            </div>
            
            {/* 3D MASTERCARD FLIP CARD */}
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p className="heading_8264">MASTERCARD</p>
                  <svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={36} height={36} viewBox="0 0 48 48">
                    <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" /><path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" /><path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
                  </svg>
                  <svg version="1.1" className="chip" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 50 50" xmlSpace="preserve">  <image id="image0" width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
                  </svg>
                  <svg version="1.1" className="contactless" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50" xmlSpace="preserve">  <image id="image0" width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsecstRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII=" />
                  </svg>
                  <p className="number">9759 2484 5269 6576</p>
                  <p className="valid_thru">VALID THRU</p>
                  <p className="date_8264">1 2 / 2 4</p>
                  <p className="name">BRUCE WAYNE</p>
                </div>
                <div className="flip-card-back">
                  <div className="strip" />
                  <div className="mstrip" />
                  <div className="sstrip">
                    <p className="code">***</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className={`payment-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : 'Aprobar Pago'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#a5a5a5', cursor: 'pointer', textDecoration: 'underline'}} 
                onClick={() => { setStep('select'); setSelectedTier(null); }}
              >
                Elegir otro plan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
