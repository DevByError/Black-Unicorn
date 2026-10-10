import type { Service } from '@/types/content';

export const services: Service[] = [
  { id: 'web-engineering', name: 'Web engineering', icon: 'globe', summary: 'Fast, accessible websites and web apps.', bullets: ['Design systems', 'Performance budgets', 'Accessibility to WCAG 2.2 AA'], placeholder: true },
  { id: 'mobile-apps', name: 'Mobile apps', icon: 'phone', summary: 'Apps for iOS and Android from one codebase.', bullets: ['Cross-platform builds', 'Offline-first design', 'Store release support'], placeholder: true },
  { id: 'ai-integration', name: 'AI integration', icon: 'spark', summary: 'Practical machine learning, measured and explained.', bullets: ['Use-case scoping', 'Evaluation before launch', 'Cost and latency tracking'], placeholder: true },
  { id: 'automation', name: 'Automation', icon: 'flow', summary: 'Workflows that remove repeated manual work.', bullets: ['Process mapping', 'Integrations', 'Monitoring and alerts'], placeholder: true },
  { id: 'product-design', name: 'Product design', icon: 'pen', summary: 'Interfaces that are clear before they are clever.', bullets: ['Research and prototypes', 'Interaction design', 'Handover to engineering'], placeholder: true },
];
