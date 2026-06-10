export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  projectUrl?: string;
  repoUrl?: string;
}
