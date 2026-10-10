import { DOT, GAUGE_ARC, HORN_LEFT, HORN_RIGHT, MANES, PROGRESS_R, RING, RING_CENTER, TICKS, VIEWBOX } from '@/lib/logo-geometry';

interface LogoMarkProps {
  /** `full` has the gauge and ticks; `simple` is the favicon-grade mark (ring, horn, dot). */
  variant?: 'full' | 'simple';
  /** Adds the scroll-progress ring overlay used by the header logo. */
  progress?: boolean;
  id?: string;
  className?: string;
  title?: string;
}

/**
 * The flat 2D BlackUnicorn mark. Colour comes from `currentColor`; never add fills, gradients or glow.
 * Accessibility: decorative unless `title` is supplied, in which case it is exposed as an image.
 */
export function LogoMark({ variant = 'full', progress = false, id, className, title }: LogoMarkProps) {
  const simple = variant === 'simple';
  return (
    <svg
      id={id}
      className={className}
      viewBox={VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      <path d={RING} fill="none" stroke="currentColor" strokeWidth={simple ? 22 : 14} />
      {!simple && (
        <>
          <path d={GAUGE_ARC} fill="none" stroke="currentColor" strokeWidth="3.5" />
          <path d={TICKS} fill="none" stroke="currentColor" strokeWidth="3" />
          {MANES.map((m) => (
            <path key={m.d} d={m.d} fill="none" stroke="currentColor" strokeWidth={m.w} strokeLinecap="round" />
          ))}
        </>
      )}
      <polygon points={HORN_LEFT} fill="currentColor" />
      <polygon points={HORN_RIGHT} fill="currentColor" />
      <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill="currentColor" />
      {progress && (
        <circle
          className="logo-progress"
          cx={RING_CENTER.x}
          cy={RING_CENTER.y}
          r={PROGRESS_R}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          opacity="0.55"
          transform={`rotate(-90 ${RING_CENTER.x} ${RING_CENTER.y})`}
          aria-hidden="true"
        />
      )}
    </svg>
  );
}
