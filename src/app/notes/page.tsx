import { PageHead } from '@/components/ui/PageHead';
import { NotesIndex } from '@/components/sections/NotesIndex';
import { notes } from '@/content/notes';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Notes', description: 'Short studio notes from BlackUnicorn: how we build, what we learn, what we change.', path: '/notes' });

export default function NotesPage() {
  return (
    <>
      <PageHead eyebrow="Notes" title="Studio notes" lead="Short posts about how we build." />
      <NotesIndex notes={notes} />
    </>
  );
}
