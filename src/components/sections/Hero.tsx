
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import photoPerfil from '../../assets/photo_perfil.png';

import { TypewriterText } from '../ui/TypewriterText';

export const Hero = () => {
  return (
    <section id="home" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px' }}>
      <div className="container hero-flex-container" style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        textAlign: 'left'
      }}>

        <div style={{ flex: '1 1 500px', zIndex: 10 }}>
          <span style={{
            display: 'inline-block', color: 'var(--primary)', fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '0.3em', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase',
            marginBottom: '1.5rem', backgroundColor: 'rgba(129, 236, 255, 0.1)',
            padding: '0.375rem 1rem', borderRadius: '9999px', border: '1px solid rgba(129, 236, 255, 0.2)'
          }}>
            Available for Hire
          </span>
          <h1 className="font-headline" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.05em' }}>
            Hola, soy <span className="text-gradient">Archye</span>,
            <span style={{ display: 'block', minHeight: '1.2em', marginTop: '0.2em', paddingLeft: '0.5rem', borderLeft: '3px solid var(--primary)', minWidth: '320px' }}>
              <TypewriterText
                phrases={[
                  "Dev Fullstack",
                  "Creador de Experiencias Web",
                  "Ingeniero de Software",
                  "Entusiasta de React"
                ]}
                typingSpeed={120}
                deletingSpeed={60}
                pauseTime={2000}
              />
            </span>
          </h1>
          <p className="font-body" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', opacity: 0.8 }}>
            Especializado en crear experiencias digitales excepcionales. Transformo ideas en código limpio y escalable con React.
          </p>

          <div className="hero-buttons-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#projects"><Button>Ver Proyectos</Button></a>
            <a href="/Archye_Joel_Pena_Gomez_CV.pdf" download="Archye_Joel_Pena_Gomez_CV.pdf">
              <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Descargar CV
              </Button>
            </a>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem' }}>
            <a href="https://github.com/ArchDev19" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://linkedin.com/in/archdevelope-programing-undefined-59b4b8410/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        <div style={{ flex: '0 0 auto' }}>
          <Avatar
            src={photoPerfil}
            alt="Foto de perfil"
            numSize={450}
            className="animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
};
