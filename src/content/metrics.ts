import type { Metric } from '@/types/content';

/** Values are literal placeholders. The count-up skips non-numeric values by design. */
export const metrics: Metric[] = [
  { id: 'm1', label: 'Projects shipped', value: '[value]', comparison: '[comparison]', placeholder: true },
  { id: 'm2', label: 'Years building', value: '[value]', comparison: '[comparison]', placeholder: true },
  { id: 'm3', label: 'Disciplines covered', value: '[value]', comparison: '[comparison]', placeholder: true },
  { id: 'm4', label: 'Team members', value: '[value]', comparison: '[comparison]', placeholder: true },
];
