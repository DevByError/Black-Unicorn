import type { StackItem } from '@/types/content';

// Public technology names, not claims about BlackUnicorn.
const s = (name: string, category: StackItem['category'], blurb: string, url?: string): StackItem => ({ name, category, blurb, url });

export const stack: StackItem[] = [
  s('React', 'Frontend', 'Component UI library.', 'https://react.dev'),
  s('Next.js', 'Frontend', 'React framework for the web.', 'https://nextjs.org'),
  s('TypeScript', 'Frontend', 'Typed JavaScript.', 'https://www.typescriptlang.org'),
  s('GSAP', 'Frontend', 'Animation toolkit.', 'https://gsap.com'),
  s('Node.js', 'Backend', 'JavaScript runtime.', 'https://nodejs.org'),
  s('PostgreSQL', 'Backend', 'Relational database.', 'https://www.postgresql.org'),
  s('Redis', 'Backend', 'In-memory data store.', 'https://redis.io'),
  s('Flutter', 'Mobile', 'Cross-platform UI toolkit.', 'https://flutter.dev'),
  s('Dart', 'Mobile', 'Language behind Flutter.', 'https://dart.dev'),
  s('React Native', 'Mobile', 'React for native apps.', 'https://reactnative.dev'),
  s('Python', 'AI & Data', 'General-purpose language.', 'https://www.python.org'),
  s('PyTorch', 'AI & Data', 'Machine learning framework.', 'https://pytorch.org'),
  s('Pandas', 'AI & Data', 'Data analysis library.', 'https://pandas.pydata.org'),
  s('Figma', 'Design', 'Interface design tool.', 'https://www.figma.com'),
  s('Storybook', 'Design', 'Component workshop.', 'https://storybook.js.org'),
  s('Unity', 'Design', 'Real-time 3D and 2D engine.', 'https://unity.com'),
  s('Docker', 'DevOps', 'Containers.', 'https://www.docker.com'),
  s('GitHub Actions', 'DevOps', 'CI and automation.', 'https://github.com/features/actions'),
  s('Playwright', 'DevOps', 'Browser testing.', 'https://playwright.dev'),
  s('Vitest', 'DevOps', 'Unit testing.', 'https://vitest.dev'),
  s('Partner (placeholder) A', 'Partner', 'Replace with a real partner or remove.'),
  s('Partner (placeholder) B', 'Partner', 'Replace with a real partner or remove.'),
  s('Partner (placeholder) C', 'Partner', 'Replace with a real partner or remove.'),
  s('Partner (placeholder) D', 'Partner', 'Replace with a real partner or remove.'),
];
