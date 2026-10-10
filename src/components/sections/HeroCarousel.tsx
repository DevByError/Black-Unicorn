'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ProjectThumb } from '@/components/work/ProjectThumb';
import { labelFor } from '@/content/projects';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { Project } from '@/types/content';

const INTERVAL_MS = 7000;
const SWIPE_PX = 40;

/**
 * Hero carousel ("Featured work and capabilities"). Accessibility contract (WCAG 2.2.2, 2.1.1):
 *  - role=region + aria-roledescription=carousel; slides are role=group "n of N"; inactive slides are aria-hidden + inert.
 *  - Autoplay starts only after the intro, pauses on hover, focus-within, hidden tab, off-screen and reduced motion,
 *    and always has a visible Pause/Play button. It announces nothing; only user-driven changes use a polite live region.
 *  - Autoplay is driven by the pager bar's CSS animation: pausing pauses the animation, and animationend advances.
 * Without JS all slides stack as a readable list.
 */
export function HeroCarousel({ slides }: { slides: Project[] }) {
  const count = slides.length;
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false); // intro finished
  const [revealed, setRevealed] = useState(false); // hero copy may animate in (fires mid-dock, before the intro ends)
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [visible, setVisible] = useState(true);
  const [docHidden, setDocHidden] = useState(false);
  const [byUser, setByUser] = useState(false);
  const touch = useRef<{ x: number; t: number } | null>(null);

  const go = useCallback((n: number, user: boolean) => { setIndex((n + count) % count); setByUser(user); }, [count]);

  useEffect(() => {
    const mode = document.documentElement.getAttribute('data-intro');
    if (mode === 'done' || mode === 'skip') { setReady(true); return; }
    const on = () => setReady(true);
    document.addEventListener('bu:intro:done', on, { once: true });
    return () => document.removeEventListener('bu:intro:done', on);
  }, []);
  useEffect(() => {
    const mode = document.documentElement.getAttribute('data-intro');
    if (mode === 'done' || mode === 'skip' || mode === 'reduced') { setRevealed(true); return; }
    const on = () => setRevealed(true);
    document.addEventListener('bu:hero:reveal', on, { once: true });
    return () => document.removeEventListener('bu:hero:reveal', on);
  }, []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const vis = () => setDocHidden(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const playing = ready && !reduced && !userPaused && !hover && !focusIn && visible && !docHidden;
  const autoplayEnabled = ready && !reduced && !userPaused;

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowRight') go(index + 1, true);
    else if (k === 'ArrowLeft') go(index - 1, true);
    else if (k === 'Home') go(0, true);
    else if (k === 'End') go(count - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <section
      ref={rootRef} className={`hero${revealed ? ' is-in' : ''}`} role="region" aria-roledescription="carousel" aria-label="Featured work" data-playing={playing}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)} onPointerLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false); }}
      onKeyDown={onKey}
    >
      <div
        className="hero__stage" aria-live={byUser ? 'polite' : 'off'}
        onPointerDown={(e) => { touch.current = { x: e.clientX, t: performance.now() }; }}
        onPointerUp={(e) => {
          const s = touch.current; touch.current = null;
          if (!s || e.pointerType === 'mouse') return;
          const dx = e.clientX - s.x; const v = Math.abs(dx) / Math.max(1, performance.now() - s.t);
          if (Math.abs(dx) > SWIPE_PX || v > 0.5) go(index + (dx < 0 ? 1 : -1), true);
        }}
      >
        {slides.map((p, i) => (
          <div
            key={p.slug} className={`hero__slide${i === index ? ' is-active' : ''}`} role="group" aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`} aria-hidden={i === index ? undefined : true} inert={i === index ? undefined : true}
          >
            <div className="hero__copy container container--wide">
              <div className="hero__text">
                <p className="eyebrow hero__item" style={{ ['--hi' as string]: 0 }}>{p.disciplines.map(labelFor).join(' / ')}</p>
                <h2 className="h1 hero__item" style={{ ['--hi' as string]: 1 }}>{p.title}</h2>
                <p className="lead hero__item" style={{ ['--hi' as string]: 2 }}>{p.summary}</p>
                <div className="hero__actions hero__item" style={{ ['--hi' as string]: 3 }}>
                  <Link href={`/work/${p.slug}`} className="btn btn--primary" data-track={`home.hero.${i + 1}a`}>See the case study<Icon name="arrow-right" className="icon btn__arrow" /></Link>
                  <Link href="/work" className="btn btn--secondary" data-track={`home.hero.${i + 1}b`}>All work</Link>
                </div>
              </div>
              <div className="hero__art"><ProjectThumb project={p} wide priority={i === 0} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero__controls container container--wide">
        <ol className="hero__pager">
          {slides.map((p, i) => (
            <li key={p.slug}>
              <button
                type="button" className="hero__pager-btn" aria-current={i === index ? 'true' : undefined}
                aria-label={`Go to slide ${i + 1}: ${p.title}`} onClick={() => go(i, true)}
              >
                <span className="hero__bar" aria-hidden="true">
                  <span
                    key={i === index ? `a${index}-${autoplayEnabled}` : `i${i}`}
                    className={`hero__bar-fill${i === index && autoplayEnabled ? ' is-running' : ''}${i < index || (i === index && !autoplayEnabled) ? ' is-full' : ''}`}
                    style={{ animationDuration: `${INTERVAL_MS}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                    onAnimationEnd={() => i === index && autoplayEnabled && go(index + 1, false)}
                  />
                </span>
                <span className="hero__pager-num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="hero__pager-title">{p.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="hero__tools">
          <span className="hero__counter mono" aria-hidden="true">{index + 1} / {count}</span>
          <button type="button" className="icon-btn" onClick={() => go(index - 1, true)}><Icon name="arrow-left" /><span className="visually-hidden">Previous slide</span></button>
          <button type="button" className="icon-btn" onClick={() => go(index + 1, true)}><Icon name="arrow-right" /><span className="visually-hidden">Next slide</span></button>
          <button type="button" className="icon-btn" aria-pressed={userPaused} onClick={() => setUserPaused(!userPaused)}>
            <Icon name={userPaused ? 'play' : 'pause'} /><span className="visually-hidden">{userPaused ? 'Play slideshow' : 'Pause slideshow'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
