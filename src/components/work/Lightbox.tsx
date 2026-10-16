'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import type { ImageAsset } from '@/types/content';

const SWIPE_PX = 40;

/**
 * Gallery grid + lightbox. Native <dialog>: focus is trapped, Escape closes, focus returns to the thumbnail.
 * Arrow keys navigate, touch swipes navigate, and the visible close button is always present.
 */
export function Gallery({ images, title }: { images: ImageAsset[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const x0 = useRef<number | null>(null);
  const count = images.length;
  const go = useCallback((n: number) => setOpen((n + count) % count), [count]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(open + 1); else if (e.key === 'ArrowLeft') go(open - 1); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go]);

  const img = open === null ? null : images[open];
  return (
    <>
      <ul className="gallery">
        {images.map((im, i) => (
          <li key={im.src + i}>
            <button type="button" className="gallery__thumb" onClick={() => setOpen(i)} aria-label={`Open image ${i + 1} of ${count}: ${im.alt}`}>
              <img src={im.src} alt="" width={im.width} height={im.height} loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={open !== null} onClose={() => setOpen(null)} label={`${title} gallery`} className="lightbox">
        {img && (
          <div className="lightbox__inner" onPointerDown={(e) => { x0.current = e.clientX; }} onPointerUp={(e) => {
            const s = x0.current; x0.current = null;
            if (s !== null && e.pointerType !== 'mouse' && Math.abs(e.clientX - s) > SWIPE_PX && open !== null) go(open + (e.clientX < s ? 1 : -1));
          }}>
            <button type="button" className="icon-btn lightbox__close" onClick={() => setOpen(null)} aria-label="Close gallery"><Icon name="close" /></button>
            <img src={img.src} alt={img.alt} width={img.width} height={img.height} />
            <p className="mono muted" aria-live="polite">{(open ?? 0) + 1} / {count}</p>
            <div className="lightbox__nav">
              <button type="button" className="step-btn" onClick={() => go((open ?? 0) - 1)}>Prev<span className="visually-hidden"> image</span></button>
              <button type="button" className="step-btn" onClick={() => go((open ?? 0) + 1)}>Next<span className="visually-hidden"> image</span></button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
