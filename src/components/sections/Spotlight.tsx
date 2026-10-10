'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ProjectThumb } from '@/components/work/ProjectThumb';
import { labelFor } from '@/content/projects';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { Project } from '@/types/content';

/**
 * Spotlight banner: one flagship case study, full bleed. Text sits on a flat translucent panel (no gradient scrim).
 * On enter the brand seam draws and the two halves of the image part 8px and settle (once). Parallax is fine-pointer
 * only and off under reduced motion. No video is supplied in v1, so there is no media to pause.
 */
export function Spotlight({ project: p }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);

    const fine = matchMedia('(pointer: fine)').matches;
    let raf = 0;
    const onScroll = () => {
      if (raf || !art.current || isMotionReduced() || !fine) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
        if (art.current) art.current.style.transform = `translate3d(0, ${(progress * -6).toFixed(2)}%, 0) scale(1.08)`; // 6% slower than scroll
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={root} id="spotlight" className="spot defer-render" aria-labelledby="spot-h">
      <div className="spot__art" aria-hidden="true">
        <div ref={art} className="spot__art-inner">
          <div className="spot__half spot__half--l"><ProjectThumb project={p} wide /></div>
          <div className="spot__half spot__half--r"><ProjectThumb project={p} wide /></div>
        </div>
      </div>
      <span className="spot__seam" aria-hidden="true" />
      <div className="spot__panel container">
        <div className="spot__text">
          <p className="eyebrow">Spotlight / {p.disciplines.map(labelFor).join(' / ')}</p>
          <h2 id="spot-h" className="h2">{p.title}</h2>
          <p className="lead">{p.summary}</p>
          <Link href={`/work/${p.slug}`} className="btn btn--primary" data-track="home.spotlight.1">Read the story<Icon name="arrow-right" className="icon btn__arrow" /></Link>
        </div>
      </div>
    </section>
  );
}
