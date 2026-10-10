export type Discipline = 'web' | 'mobile' | 'ai' | 'games' | 'automation' | 'design' | (string & {});

export interface ImageAsset {
  /** Empty string means "no image yet": the UI draws a flat generated placeholder. */
  src: string;
  width: number;
  height: number;
  alt: string;
  focal?: [number, number];
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  year: number;
  /** ISO date used for the "New" badge (last 90 days). */
  published: string;
  disciplines: Discipline[];
  role: string[];
  summary: string;
  cover: ImageAsset;
  coverPortrait?: ImageAsset;
  thumb?: ImageAsset;
  gallery?: ImageAsset[];
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  links?: { label: string; href: string; kind: 'live' | 'repo' | 'video' | 'press' }[];
  metrics?: { label: string; value: string }[];
  testimonial?: { quote: string; name: string; role: string };
  featured?: boolean;
  heroOrder?: number;
  confidential?: boolean;
  placeholder?: boolean;
}

export interface Service {
  id: string;
  name: string;
  summary: string;
  bullets: string[];
  icon: string;
  placeholder?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: ImageAsset;
  interest?: string;
  links?: { label: string; href: string }[];
  placeholder?: boolean;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  tags: string[];
  cover?: ImageAsset;
  featured?: boolean;
  placeholder?: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  comparison?: string;
  placeholder?: boolean;
}

export interface StackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'AI & Data' | 'Design' | 'DevOps' | 'Partner';
  url?: string;
  blurb?: string;
}

export interface ProcessStage {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  deliverable: string;
}

export interface SiteConfig {
  name: 'BlackUnicorn';
  tagline: string;
  description: string;
  url: string;
  email?: string;
  phone?: string;
  location?: string;
  socials: { label: string; href: string }[];
  locales: ('en' | 'ms')[];
  analytics: { provider: 'none' | 'plausible' | 'umami'; id?: string };
  popularSearches: string[];
  /** Expected reply time. Leave undefined until the team commits to one. */
  responseTime?: string;
  placeholder?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}
export interface NavPanel {
  id: 'work' | 'services' | 'studio';
  label: string;
  href: string;
  links?: NavLink[];
  quote?: string;
}
