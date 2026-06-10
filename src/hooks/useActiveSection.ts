import { useState, useEffect } from 'react';

export const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Configuramos el IntersectionObserver para detectar qué sección está visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Cuando una sección intercepta con el centro superior de la pantalla...
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, {
      // Ajustamos el margen para que la intersección ocurra cerca del tope de la pantalla (compensando por el navbar)
      rootMargin: '-20% 0px -79% 0px', 
      threshold: 0
    });

    // Observamos todos los elementos correspondientes a los ids especificados
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};
