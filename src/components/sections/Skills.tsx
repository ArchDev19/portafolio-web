
import { skills } from '../../data/skills';
import { Card } from '../ui/Card';
import { InteractiveGlow } from '../ui/InteractiveGlow';
import { AnimatedTitle } from '../ui/AnimatedTitle';

export const Skills = () => {
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="section">
      <div className="container" style={{ position: 'relative' }}>
        <InteractiveGlow color="rgba(166, 140, 255, 0.3)" radius="500px" intensity={1} />
        
        <AnimatedTitle text="Mis Habilidades" className="section-title" style={{ position: 'relative', zIndex: 10 }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {categories.map(category => (
            <Card key={category} className="skill-category-card" style={{ background: 'rgba(12, 19, 34, 0.8)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {skills.filter(s => s.category === category).map((skill) => (
                  <div key={skill.id} className="skill-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: 'background 0.3s ease, transform 0.2s ease', cursor: 'default' }}
                       onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(129, 236, 255, 0.1)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }}>{skill.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
