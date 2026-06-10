
import { projects } from '../../data/projects';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedTitle } from '../ui/AnimatedTitle';

export const Projects = () => {
  return (
    <section id="projects" className="section">
      <div className="container">
        <AnimatedTitle text="Proyectos Destacados" className="section-title" />
        
        <div className="projects-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {projects.map((project) => {
            return (
            <Card key={project.id} className="project-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, minHeight: '100%', transition: 'all 0.3s ease', background: 'rgba(12, 19, 34, 0.4)' }}>
              
              <div style={{ padding: '1.25rem 1.25rem 0 1.25rem' }}>
                <div className="project-card-img" style={{ height: '220px', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className="project-img-hover"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }}></div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>{project.title}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {project.technologies.map(tech => (
                    <span key={tech} style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: 'rgba(166, 140, 255, 0.1)', 
                      color: 'var(--secondary)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(166, 140, 255, 0.2)'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {project.description}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                      <Button variant="outline" style={{ fontSize: '0.9rem', padding: '0.6rem 1rem', width: '100%' }}>GitHub</Button>
                    </a>
                  )}
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                      <Button style={{ fontSize: '0.9rem', padding: '0.6rem 1rem', width: '100%' }}>Demo</Button>
                    </a>
                  )}
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
