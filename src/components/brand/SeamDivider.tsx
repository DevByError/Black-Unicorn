/** Brand seam: a 2px rule with a 6px gap at its centre (Part 6.3). Decorative. */
export function SeamDivider({ vertical = false }: { vertical?: boolean }) {
  return <div className={vertical ? 'seam-v' : 'seam-h'} aria-hidden="true" />;
}
