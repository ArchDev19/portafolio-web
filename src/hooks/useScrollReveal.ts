import { useEffect, useRef } from 'react';

export const useScrollReveal = (className = 'reveal') => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll(`.${className}`);
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [className]);

  return containerRef;
};
