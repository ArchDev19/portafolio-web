

import { AnimatedTitle } from '../ui/AnimatedTitle';
import { TypewriterReveal } from '../ui/TypewriterReveal';

export const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        
        <AnimatedTitle text="Sobre Mí" className="section-title" />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          
          <TypewriterReveal 
            text="Soy un apasionado desarrollador web enfocado en construir aplicaciones modernas y eficientes. Me encanta aprender nuevas tecnologías y aplicarlas para resolver problemas reales."
            speed={25}
            style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}
          />

          <TypewriterReveal 
            text="Con experiencia en el ecosistema de JavaScript, busco siempre las mejores prácticas (S.O.L.I.D, Clean Code) para entregar software de alta calidad. Cuando no estoy programando, me encontrarás explorando nuevas tendencias de diseño UX/UI."
            speed={15}
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}
          />
          
        </div>
      </div>
    </section>
  );
};
