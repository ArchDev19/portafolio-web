import type { Project } from '../models/Project';

export const projects: Project[] = [
  {
    id: 'calculator-premium',
    title: 'SaaS: Calculadora Premium',
    description: 'Calculadora Freemium con pasarela de pago simulada. Lógica de negocio restringida con encriptación visual dark mode.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    technologies: ['React', 'TypeScript', 'CSS Vanilla'],
    projectUrl: '#/calculator',
    repoUrl: '#'
  },
  {
    id: '3',
    title: 'Task Manager App',
    description: 'Aplicación de gestión de tareas con funcionalidades interactivas animadas y diseño espacial.',
    imageUrl: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80',
    technologies: ['React', 'CSS Vanilla', 'TypeScript'],
    projectUrl: '#/task-manager'
  }
];
