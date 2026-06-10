export const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      padding: '4rem 0 2rem', 
      textAlign: 'center',
      borderTop: '1px solid var(--border-color)',
      marginTop: '4rem'
    }}>
      <div className="container">
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Gracias por visitar</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          ¿Tienes un proyecto en mente? Hablemos.
        </p>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Desarrollado con 💙 y React.
        </div>
      </div>
    </footer>
  );
};
