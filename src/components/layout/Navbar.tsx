import React, { memo, useMemo, useState } from 'react';
import { useScroll } from '../../hooks/useScroll';
import { useActiveSection } from '../../hooks/useActiveSection';

const NavbarComponent = () => {
  const scrolled = useScroll(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lista de secciones a rastrear
  const sectionIds = useMemo(() => ['home', 'about', 'skills', 'projects'], []);
  const activeSection = useActiveSection(sectionIds);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
    transition: 'all 0.3s ease',
    padding: scrolled ? '1rem 0' : '1.5rem 0'
  };

  // Función para determinar si el link está activo (Si no hay ninguno, el home asume ser el por defecto hasta scrollear)
  const isLinkActive = (id: string) => {
    if (activeSection === id) return true;
    if (!activeSection && id === 'home') return true;
    return false;
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', zIndex: 2001 }}>
          Arch<span style={{ color: 'var(--text-primary)' }}>.Dev</span>
        </div>

        {/* Botón Menu Móvil */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#home" className={`nav-link ${isLinkActive('home') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Inicio</a></li>
          <li><a href="#about" className={`nav-link ${isLinkActive('about') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Sobre Mí</a></li>
          <li><a href="#skills" className={`nav-link ${isLinkActive('skills') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Skills</a></li>
          <li><a href="#projects" className={`nav-link ${isLinkActive('projects') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Proyectos</a></li>
        </ul>
      </div>
    </nav>
  );
};

export const Navbar = memo(NavbarComponent);
