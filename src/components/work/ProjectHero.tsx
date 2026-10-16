'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { ImageAsset, Project } from '@/types/content';
import { ProjectThumb } from './ProjectThumb';

const asProject = (p: Project, image: ImageAsset): Project => ({ ...p, cover: image, thumb: undefined });

/**
 * Case-study hero. With one image it is the plain cover. With several (`heroImages` in projects.ts) it becomes a
 * swipeable, keyboard-operable image slider: scroll-snap track, previous/next buttons, a counter and a thumbnail strip.
 * No autoplay, so nothing moves unless the visitor asks it to.
 */
export function ProjectHero({ project }: { project: Project }) {
  const images = project.heroImages && project.heroImages.length > 0 ? project.heroImages : [project.cover];
  const count = images.length;
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + count) % count;
    el.scrollTo({ left: n * el.clientWidth, behavior: isMotionReduced() ? 'auto' : 'smooth' });
  }, [count]);

  useEffect(() => {
    const el = track.current;
    if (!el || count < 2) return;
    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
        indexRef.current = i;
        setIndex(i);
      });
    };
    // On resize the slide width changes: keep the current slide aligned instead of landing between two.
    const onResize = () => { el.scrollTo({ left: indexRef.current * el.clientWidth, behavior: 'auto' }); };
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('scroll', sync); window.removeEventListener('resize', onResize); };
  }, [count]);

  if (count < 2) {
    return <div className="cover"><ProjectThumb project={asProject(project, images[0] ?? project.cover)} wide priority /></div>;
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(count - 1); }
  };

  return (
    <div className="phero" role="region" aria-roledescription="carousel" aria-label={`${project.title} images`} onKeyDown={onKeyDown}>
      <div className="phero__track" role="group" ref={track} tabIndex={0} aria-label="Project images. Use the left and right arrow keys to move between them.">
        {images.map((im, i) => (
          <div key={`${im.src}-${i}`} className="phero__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index}>
            <ProjectThumb project={asProject(project, im)} wide priority={i === 0} sizes="(min-width: 1440px) 1280px, 100vw" />
          </div>
        ))}
      </div>
      <div className="phero__bar">
        <p className="mono phero__count" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
        <div className="phero__btns">
          <button type="button" className="step-btn" onClick={() => go(index - 1)}>Prev<span className="visually-hidden"> image</span></button>
          <button type="button" className="step-btn" onClick={() => go(index + 1)}>Next<span className="visually-hidden"> image</span></button>
        </div>
      </div>
      <ul className="phero__thumbs" aria-label="Choose an image">
        {images.map((im, i) => (
          <li key={`t-${im.src}-${i}`}>
            <button type="button" className="phero__thumb" aria-current={i === index ? 'true' : undefined} aria-label={`Show image ${i + 1}: ${im.alt}`} onClick={() => go(i)}>
              <ProjectThumb project={asProject(project, im)} wide sizes="160px" />
            </button>
          </li>
        ))}
      </ul>
      <p className="visually-hidden" role="status" aria-live="polite">Image {index + 1} of {count}: {images[index]?.alt}</p>
    </div>
  );
}
