import type { Project, ImageAsset } from '@/types/content';

const img = (alt: string): ImageAsset => ({ src: '', width: 1600, height: 1000, alt });

const shape = {
  challenge: 'Placeholder: describe the problem the client or team faced, in one to three short paragraphs.',
  approach: 'Placeholder: describe what BlackUnicorn did, and why those choices were made.',
  outcome: 'Placeholder: describe what changed. Use only real, verifiable results.',
};

/** Every entry is a placeholder. Replace them one by one; the build fails until none remain. */
export const projects: Project[] = [
  { slug: 'project-one', title: 'Project One', year: 2026, published: '2026-09-20', disciplines: ['web'], role: ['Design', 'Engineering'],
    summary: 'Placeholder summary for the first flagship project. Replace with one honest sentence.', cover: img('Project One cover (placeholder)'),
    ...shape, stack: ['Next.js', 'TypeScript'], featured: true, heroOrder: 1, placeholder: true },
  { slug: 'project-two', title: 'Project Two', year: 2026, published: '2026-08-02', disciplines: ['mobile'], role: ['Engineering'],
    summary: 'Placeholder summary for a mobile project. Replace with one honest sentence.', cover: img('Project Two cover (placeholder)'),
    ...shape, stack: ['Flutter', 'Dart'], featured: true, heroOrder: 2, placeholder: true },
  { slug: 'project-three', title: 'Project Three', year: 2025, published: '2025-11-14', disciplines: ['ai', 'web'], role: ['Research', 'Engineering'],
    summary: 'Placeholder summary for an AI project. Replace with one honest sentence.', cover: img('Project Three cover (placeholder)'),
    ...shape, stack: ['Python', 'TypeScript'], featured: true, heroOrder: 3, placeholder: true },
  { slug: 'project-four', title: 'Project Four', year: 2025, published: '2025-06-01', disciplines: ['automation'], role: ['Design', 'Engineering'],
    summary: 'Placeholder summary for an automation project. Replace with one honest sentence.', cover: img('Project Four cover (placeholder)'),
    ...shape, stack: ['Node.js', 'PostgreSQL'], featured: true, heroOrder: 4, placeholder: true },
  { slug: 'project-five', title: 'Project Five', year: 2024, published: '2024-10-10', disciplines: ['games'], role: ['Engineering'],
    summary: 'Placeholder summary for a games project. Replace with one honest sentence.', cover: img('Project Five cover (placeholder)'),
    ...shape, stack: ['Unity', 'C#'], featured: true, heroOrder: 5, placeholder: true },
  { slug: 'project-six', title: 'Project Six', year: 2024, published: '2024-03-03', disciplines: ['design', 'web'], role: ['Design'],
    summary: 'Placeholder summary for a design project. Replace with one honest sentence.', cover: img('Project Six cover (placeholder)'),
    ...shape, stack: ['Figma', 'React'], placeholder: true },
];

export const disciplineLabels: Record<string, string> = {
  web: 'Web', mobile: 'Mobile', ai: 'AI', games: 'Games', automation: 'Automation', design: 'Design',
};
export const labelFor = (d: string) => disciplineLabels[d] ?? d;
