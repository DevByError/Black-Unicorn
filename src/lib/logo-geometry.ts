/**
 * Canonical flat 2D BlackUnicorn mark (viewBox 400 x 420). Source: brand brief Part 6.1.
 * Everything renders with currentColor so one geometry serves gold, white, black and any token.
 */
export const VIEWBOX = '0 0 400 420';
export const RING_CENTER = { x: 200, y: 235 } as const;

export const RING = 'M232.00,78.23 A160,160 0 1 1 168.00,78.23';
/** Two halves of the ring, both drawn from the top gap edges toward the bottom (intro only). */
export const RING_A = 'M232,78.23 A160,160 0 0 1 200,395';
export const RING_B = 'M168,78.23 A160,160 0 0 0 200,395';
export const GAUGE_ARC = 'M241.73,120.36 A122,122 0 0 1 189.37,356.54';
export const TICKS =
  'M255.87,129.93 L248.83,143.17 M264.81,135.20 L260.45,141.91 M273.26,141.23 L268.34,147.53 M281.16,147.97 L270.93,158.94 M288.43,155.37 L282.49,160.73 M295.04,163.38 L288.65,168.20 M300.92,171.94 L288.20,179.89 M306.03,180.98 L298.90,184.61 M310.33,190.42 L302.92,193.42 M313.80,200.21 L299.46,204.59 M316.40,210.26 L308.57,211.92 M318.11,220.50 L310.17,221.47 M318.93,230.85 L303.94,231.37 M318.84,241.23 L310.85,240.81 M317.84,251.56 L309.92,250.45 M315.95,261.77 L301.33,258.39 M313.18,271.77 L305.57,269.30 M309.54,281.50 L302.18,278.37 M305.07,290.87 L291.83,283.83 M299.80,299.81 L293.09,295.45 M293.77,308.26 L287.47,303.34 M287.03,316.16 L276.06,305.93 M279.63,323.43 L274.27,317.49 M271.62,330.04 L266.80,323.65 M263.06,335.92 L255.11,323.20 M254.02,341.03 L250.39,333.90 M244.58,345.33 L241.58,337.92 M234.79,348.80 L230.41,334.46 M224.74,351.40 L223.08,343.57 M214.50,353.11 L213.53,345.17 M204.15,353.93 L203.63,338.94';
export const HORN_LEFT = '197.5,16 150,262 197.5,281';
export const HORN_RIGHT = '202.5,16 250,262 202.5,281';
export const MANES = [
  { d: 'M142,168 C106,206 112,266 152,298 C182,322 224,320 252,300', w: 5.5 },
  { d: 'M96,236 C82,278 108,322 164,338', w: 5 },
  { d: 'M154,190 C142,212 144,234 152,250', w: 4.5 },
] as const;
export const DOT = { cx: 276, cy: 284, r: 12 } as const;

/** Radius of the scroll-progress ring that sits just outside the main ring (Part 15.2). */
export const PROGRESS_R = 178;

/** The same 31 ticks as the TICKS path, as line segments, so the intro can animate each one. */
export function tickSegments(): { x1: number; y1: number; x2: number; y2: number; angle: number }[] {
  const segs = TICKS.split('M').filter(Boolean).map((s) => {
    const n = s.replace('L', ' ').trim().split(/[\s,]+/).map(Number);
    return { x1: n[0] ?? 0, y1: n[1] ?? 0, x2: n[2] ?? 0, y2: n[3] ?? 0 };
  });
  return segs.map((s) => ({
    ...s,
    angle: (Math.atan2(s.y1 - RING_CENTER.y, s.x1 - RING_CENTER.x) * 180) / Math.PI,
  }));
}
