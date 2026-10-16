'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { isMotionReduced } from '@/lib/useReducedMotion';

const WORDS = ['web apps', 'mobile apps', 'AI features', 'automations', 'games'];

/** A release, simplified: every line is something this studio checks on every change. Illustration, not live data. */
const SCRIPT: { kind: 'cmd' | 'ok' | 'info'; text: string }[] = [
  { kind: 'cmd', text: 'npm run build' },
  { kind: 'ok', text: 'compiled, 0 type errors' },
  { kind: 'ok', text: 'accessibility checks: 0 violations' },
  { kind: 'ok', text: 'performance budget: passing' },
  { kind: 'cmd', text: 'git push origin main' },
  { kind: 'info', text: 'deploying to production...' },
  { kind: 'ok', text: 'live. rollback ready.' },
];

const CHIPS = ['<Button />', 'git commit', 'async / await', '{ fast: true }', '200 OK', 'npm run build', 'useEffect()', '// ship it'];

/** Types the rotating word and the terminal. Everything is plain text; with reduced motion the final state is shown still. */
function useTerminal(paused: boolean) {
  // SSR and reduced motion show the complete log; the effect below restarts it from empty only when motion is allowed.
  const [lines, setLines] = useState(SCRIPT.length);
  const [typed, setTyped] = useState(999);
  const [still, setStill] = useState(true);

  useEffect(() => {
    if (isMotionReduced()) return;
    setStill(false);
    setLines(0);
    setTyped(0);
  }, []);

  useEffect(() => {
    if (still || paused) return;
    let id = 0;
    const cur = SCRIPT[lines];
    if (lines >= SCRIPT.length) {
      id = window.setTimeout(() => { setLines(0); setTyped(0); }, 4200);
    } else if (cur?.kind === 'cmd') {
      id = typed < cur.text.length
        ? window.setTimeout(() => setTyped(typed + 1), typed === 0 ? 500 : 38)
        : window.setTimeout(() => { setLines(lines + 1); setTyped(0); }, 380);
    } else {
      id = window.setTimeout(() => setLines(lines + 1), cur?.kind === 'info' ? 900 : 420);
    }
    return () => window.clearTimeout(id);
  }, [lines, typed, still, paused]);

  return { lines, typed, still };
}

function useRotatingWord(paused: boolean) {
  const [i, setI] = useState(0);
  const [n, setN] = useState((WORDS[0] ?? '').length);
  const [del, setDel] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(!isMotionReduced()); }, []);
  useEffect(() => {
    if (!on || paused) return;
    const word = WORDS[i] ?? '';
    let id = 0;
    if (!del && n < word.length) id = window.setTimeout(() => setN(n + 1), 70);
    else if (!del) id = window.setTimeout(() => setDel(true), 1700);
    else if (n > 0) id = window.setTimeout(() => setN(n - 1), 35);
    else { setDel(false); setI((i + 1) % WORDS.length); }
    return () => window.clearTimeout(id);
  }, [on, paused, i, n, del]);
  return (WORDS[i] ?? '').slice(0, n);
}

export function HomeHero({ tagline, description }: { tagline: string; description: string }) {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const paused = !visible;
  const { lines, typed } = useTerminal(paused || hover);
  const word = useRotatingWord(paused);

  const shown = SCRIPT.slice(0, lines);
  const typing = SCRIPT[lines];

  return (
    <section ref={root} className="hero2" aria-labelledby="hero-h">
      <div className="hero2__chips" aria-hidden="true">
        {CHIPS.map((c, i) => (<span key={c} className="hero2__chip mono" style={{ ['--i' as string]: i }}>{c}</span>))}
      </div>
      <div className="container hero2__grid">
        <div className="hero2__copy">
          <p className="eyebrow hero2__eyebrow"><span className="hero2__blip" aria-hidden="true" />software studio</p>
          <h1 id="hero-h" className="hero2__title font-display">{tagline}</h1>
          <p className="hero2__sub">
            Specialising in <span className="hero2__word" aria-hidden="true">{word}<span className="hero2__caret" /></span>
            <span className="visually-hidden">web apps, mobile apps, AI features, automations and games</span>.
          </p>
          <p className="lead hero2__lead">{description}</p>
          <div className="hero2__actions">
            <Link href="/contact" className="btn btn--primary" data-track="home.hero.start">Start a project</Link>
            <Link href="/work" className="btn btn--secondary" data-track="home.hero.work">See our work</Link>
          </div>
        </div>
        <figure
          className="term" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
          aria-label="Illustration: a terminal running a build, accessibility checks and a deploy"
        >
          <div className="term__bar" aria-hidden="true"><span className="term__dot" /><span className="term__dot" /><span className="term__dot" /><span className="term__title mono">studio / release</span></div>
          <div className="term__body mono" aria-hidden="true">
            {shown.map((l, i) => (
              <p key={i} className={`term__line term__line--${l.kind}`}>
                {l.kind === 'cmd' && <span className="term__prompt">$</span>}
                {l.kind === 'ok' && <span className="term__ok">ok</span>}
                {l.kind === 'info' && <span className="term__info">..</span>}
                {l.text}
              </p>
            ))}
            {typing?.kind === 'cmd' && (
              <p className="term__line term__line--cmd"><span className="term__prompt">$</span>{typing.text.slice(0, typed)}<span className="hero2__caret" /></p>
            )}
            {lines >= SCRIPT.length && <p className="term__line"><span className="term__prompt">$</span><span className="hero2__caret" /></p>}
          </div>
          <figcaption className="term__cap mono">A typical release, simplified.</figcaption>
        </figure>
      </div>
      <p className="hero2__scroll mono" aria-hidden="true"><span className="hero2__scroll-line" />scroll</p>
    </section>
  );
}
