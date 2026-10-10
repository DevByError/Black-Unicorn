import type { Note } from '@/types/content';

const body = 'Placeholder body. Replace with the real note. Paragraphs are separated by a blank line.\n\nA second paragraph keeps the layout honest while the real text is written.';

export const notes: Note[] = [
  { slug: 'note-one', title: 'Note One', date: '2026-09-28', excerpt: 'Placeholder excerpt for the featured studio note.', body, tags: ['Process'], featured: true, placeholder: true },
  { slug: 'note-two', title: 'Note Two', date: '2026-08-15', excerpt: 'Placeholder excerpt for a studio note.', body, tags: ['Engineering'], placeholder: true },
  { slug: 'note-three', title: 'Note Three', date: '2026-06-30', excerpt: 'Placeholder excerpt for a studio note.', body, tags: ['Design'], placeholder: true },
  { slug: 'note-four', title: 'Note Four', date: '2026-04-09', excerpt: 'Placeholder excerpt for a studio note.', body, tags: ['Process', 'AI'], placeholder: true },
];
