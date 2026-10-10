import type { SVGProps } from 'react';

/** One consistent stroke set: 24px grid, 1.5px stroke, round caps (Part 11.5). Decorative unless `title` is passed. */
const PATHS = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  chevron: 'M6 9l6 6 6-6',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  flow: 'M5 5h5v5H5zM14 14h5v5h-5zM10 7.5h4a2 2 0 0 1 2 2V14',
  pen: 'M4 20l4-1L19 8l-3-3L5 16l-1 4ZM14 7l3 3',
  play: 'M7 5l12 7-12 7V5Z',
  pause: 'M8 5v14M16 5v14',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a3 3 0 1 0-1-5.8M21 20c0-2.5-1.6-4.6-4-5.5',
  layers: 'M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5',
  note: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 3l10 18H2L12 3ZM12 10v5M12 18h.01',
  github: 'M9 19c-4 1.2-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C6.6 2.9 5.6 3.2 5.6 3.2a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.6c0 4.6 2.7 5.7 5.500 6-.6.6-.6 1.2-.5 2V21',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  title?: string;
}

export function Icon({ name, title, className = 'icon', ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
