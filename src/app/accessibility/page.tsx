import { PageHead } from '@/components/ui/PageHead';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Accessibility', description: 'BlackUnicorn aims for WCAG 2.2 AA. Known limitations, keyboard shortcuts and how to report a problem.', path: '/accessibility' });

export default function AccessibilityPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Accessibility statement" lead="We aim for WCAG 2.2 level AA on every page." />
      <div className="container prose legal">
        <h2 className="h3">What we do</h2>
        <p>Every interactive element works with a mouse, a finger, a keyboard and a screen reader. Focus is always visible. Motion respects your system setting, and the footer has a Reduce motion switch that overrides it. The opening animation can be skipped at any time.</p>
        <h2 className="h3">Keyboard shortcuts</h2>
        <p><kbd>/</kbd> or <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> opens search. <kbd>Esc</kbd> closes menus, search and dialogs. Shortcuts never fire while you are typing in a field.</p>
        <h2 className="h3">Known limitations</h2>
        <p>Automated checks (axe) were run on key pages and states. Manual screen reader testing with VoiceOver and NVDA is still to be done and is not claimed here. [to be confirmed after testing]</p>
        <h2 className="h3">Report a problem</h2>
        <p>{site.email ? <>Email <a className="link-inline" href={`mailto:${site.email}`}>{site.email}</a> with the page address and what went wrong.</> : <>Contact point: [to be confirmed].</>}</p>
      </div>
    </>
  );
}
