import { LogoMark } from '@/components/brand/LogoMark';
import type { Project } from '@/types/content';

/**
 * Flat generated placeholder when a project has no image yet: solid surface, brand icon at 8% opacity, the title.
 * Never a stock photo, never a gradient (Part 11.6). With a real image it renders a plain <img>.
 */
export function ProjectThumb({ project, size = 160, wide = false, priority = false }: { project: Project; size?: number; wide?: boolean; priority?: boolean }) {
  const img = project.thumb ?? project.cover;
  const style = wide ? { aspectRatio: '16 / 10', width: '100%' } : { width: size, height: size };
  if (img.src) {
    return (
      <img
        src={img.src} alt={img.alt} width={img.width} height={img.height} style={{ ...style, objectFit: 'cover' }}
        loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'}
      />
    );
  }
  return (
    <span className="thumb-ph" style={style} aria-hidden="true">
      <LogoMark variant="simple" className="thumb-ph__mark" />
    </span>
  );
}
