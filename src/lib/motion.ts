/** Motion tokens mirrored from tokens.css so GSAP and CSS stay in step (Part 12.2). */
export const EASE = {
  standard: 'power3.out',
  exit: 'power2.in',
  emphasis: 'expo.out',
  inOut: 'expo.inOut',
  snap: 'back.out(2.4)',
  draw: 'power3.inOut',
} as const;

export const DUR = { instant: 0.09, fast: 0.16, base: 0.26, slow: 0.48, slower: 0.72, cinematic: 1.1 } as const;
export const STAGGER = { tight: 0.02, base: 0.045, loose: 0.09 } as const;
