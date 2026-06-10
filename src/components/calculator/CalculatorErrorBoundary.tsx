import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * React Error Boundary: `CalculatorErrorBoundary`
 * Previene que toda la aplicación y el portafolio se queden colgados/blancos en caso
 * de que algún elemento de la Calculadora falle al renderizar o se corrompa el Hook.
 * Esta capa aísla el error, mostrando un mensaje seguro mientras protege el entorno global.
 */
export class CalculatorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Renderiza la UI de degradado en el próximo ciclo
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aquí podríamos mandar el error a sentry/logs en un entorno real.
    // Por ahora lo enviamos a consola para debug sin panickear toda la app.
    console.error("Calculadora ErrorBoundary Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff9f0a', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Oops, la Calculadora ha fallado internamente.</h2>
          <p style={{ color: '#fff', marginBottom: '20px' }}>No te preocupes, el resto del portafolio sigue funcionando perfectamente.</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            style={{ padding: '12px 24px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#444'}
            onMouseOut={(e) => e.currentTarget.style.background = '#333'}
          >
            Intentar Recargar Módulo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
