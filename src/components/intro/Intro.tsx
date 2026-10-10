import { DOT, GAUGE_ARC, HORN_LEFT, HORN_RIGHT, MANES, RING_A, RING_B, RING_CENTER, tickSegments, VIEWBOX } from '@/lib/logo-geometry';

/**
 * Server-rendered intro overlay (Part 13.4). It paints in the first frame, needs no network request, and is
 * hidden by CSS unless the pre-paint script chose an intro mode. Decorative: aria-hidden. The skip button is
 * a sibling of the overlay, never inside it.
 *
 * Ring and mane paths use pathLength="1" so stroke-dash reveal needs no measured length.
 */
export function Intro() {
  const ticks = tickSegments();
  return (
    <>
      <div id="intro" className="intro" data-state="idle" aria-hidden="true">
        <div className="intro__curtain intro__curtain--left" />
        <div className="intro__curtain intro__curtain--right" />
        <div className="intro__stage" id="intro-stage">
          <div className="intro__mark-wrap" id="intro-mark-wrap">
            <svg id="intro-mark" viewBox={VIEWBOX} focusable="false">
              <g id="m-ring-group">
                <path id="m-ring-a" d={RING_A} pathLength={1} fill="none" stroke="currentColor" strokeWidth="14" />
                <path id="m-ring-b" d={RING_B} pathLength={1} fill="none" stroke="currentColor" strokeWidth="14" />
              </g>
              <path id="m-gauge-arc" d={GAUGE_ARC} pathLength={1} fill="none" stroke="currentColor" strokeWidth="3.5" />
              <g id="m-ticks">
                {ticks.map((t, i) => (
                  <line key={i} className="m-tick" data-angle={t.angle.toFixed(2)} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="3" />
                ))}
              </g>
              <line id="m-needle" x1={RING_CENTER.x} y1={RING_CENTER.y} x2={RING_CENTER.x + 122} y2={RING_CENTER.y} stroke="currentColor" strokeWidth="2" opacity="0" />
              {MANES.map((m, i) => (
                <path key={i} id={`m-mane-${i + 1}`} d={m.d} pathLength={1} fill="none" stroke="currentColor" strokeWidth={m.w} strokeLinecap="round" />
              ))}
              <circle id="m-dot" cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill="currentColor" />
              <clipPath id="m-horn-clip">
                <rect id="m-horn-clip-rect" x="100" y="0" width="200" height="420" />
              </clipPath>
              <g id="m-horn" clipPath="url(#m-horn-clip)">
                <polygon points={HORN_LEFT} fill="currentColor" />
                <polygon points={HORN_RIGHT} fill="currentColor" />
              </g>
              <circle id="m-spark" cx={RING_CENTER.x} cy={RING_CENTER.y} r="4" fill="currentColor" opacity="0" />
              <circle id="m-shock" cx="200" cy="16" r="20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0" />
            </svg>
          </div>
          <div className="intro__word-clip" id="intro-word-clip">
            <div className="intro__word font-display" id="intro-word">BlackUnicorn</div>
            <span className="intro__scan" id="intro-scan" />
          </div>
        </div>
        <canvas id="intro-sparks" className="intro__sparks" />
      </div>
      <button type="button" className="intro__skip" id="intro-skip">Skip intro</button>
    </>
  );
}
