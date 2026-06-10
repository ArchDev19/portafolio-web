export interface Skill {
  id: string;
  name: string;
  icon: string; // Puede ser una URL o un nombre de icono
  category: 'Frontend' | 'Backend' | 'Tools' | 'Soft Skills';
}
