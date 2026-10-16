/**
 * Developer news for the home page "Radar" section, read ONCE when the site is built (static export).
 *
 * Source: the public dev.to API (free, no key, no account): https://developers.forem.com/api/v1
 * Why build time: visitors' browsers never contact dev.to, so there is no third-party request, no cookie and no
 * tracking from this section. The cost is that the list is as fresh as the last build. Rebuild (or run a daily
 * scheduled deploy) to refresh it.
 *
 * Only text is used: title, author, a few tags, reading time and the link. No images are copied from dev.to.
 *
 * If the request fails (offline build, rate limit, API change) or is switched off, the section falls back to a short
 * hand-picked reading list of evergreen official docs, and says so on the page. It never shows invented articles.
 *
 * Switch it off with the environment variable  BU_FEED=off  (the fallback list is used instead).
 * Change the topic with  BU_FEED_TAG=webdev  (any dev.to tag, e.g. typescript, react, ai, a11y).
 */

export interface FeedItem {
  title: string;
  url: string;
  author?: string;
  tags: string[];
  minutes?: number;
  reactions?: number;
  /** ISO date when the source reports one. */
  date?: string;
}

export interface Feed {
  /** 'live' = fetched from dev.to during this build. 'curated' = the fallback list. */
  mode: 'live' | 'curated';
  source: string;
  sourceUrl: string;
  /** ISO timestamp of the build that produced this list. */
  fetchedAt: string;
  items: FeedItem[];
}

const CURATED: FeedItem[] = [
  { title: 'Core Web Vitals: what to measure and why', url: 'https://web.dev/articles/vitals', author: 'web.dev', tags: ['performance'] },
  { title: 'Interaction to Next Paint (INP)', url: 'https://web.dev/articles/inp', author: 'web.dev', tags: ['performance'] },
  { title: 'WCAG 2.2 quick reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/', author: 'W3C', tags: ['accessibility'] },
  { title: 'Learn React: the official guide', url: 'https://react.dev/learn', author: 'React team', tags: ['react'] },
  { title: 'TypeScript handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', author: 'TypeScript team', tags: ['typescript'] },
  { title: 'MDN: accessibility for developers', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility', author: 'MDN', tags: ['accessibility'] },
];

interface DevToArticle {
  title?: unknown; url?: unknown; published_at?: unknown; reading_time_minutes?: unknown;
  positive_reactions_count?: unknown; tag_list?: unknown; user?: { name?: unknown };
}

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

/** Accepts only https links to dev.to, so a surprise in the API response can never put another site on the page. */
function safeUrl(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  try { const u = new URL(s); return u.protocol === 'https:' && (u.hostname === 'dev.to' || u.hostname.endsWith('.dev.to')) ? u.href : undefined; } catch { return undefined; }
}

export function parseDevTo(json: unknown, limit = 6): FeedItem[] {
  if (!Array.isArray(json)) return [];
  const out: FeedItem[] = [];
  for (const raw of json as DevToArticle[]) {
    const title = str(raw?.title);
    const url = safeUrl(raw?.url);
    if (!title || !url) continue;
    const tags = Array.isArray(raw.tag_list) ? raw.tag_list.filter((t): t is string => typeof t === 'string').slice(0, 3) : [];
    out.push({ title, url, author: str(raw.user?.name), tags, minutes: num(raw.reading_time_minutes), reactions: num(raw.positive_reactions_count), date: str(raw.published_at) });
    if (out.length >= limit) break;
  }
  return out;
}

export async function getDevFeed(): Promise<Feed> {
  const fetchedAt = new Date().toISOString();
  const curated: Feed = { mode: 'curated', source: 'Official docs', sourceUrl: 'https://web.dev', fetchedAt, items: CURATED };
  if (process.env.BU_FEED === 'off') return curated;
  const tag = (process.env.BU_FEED_TAG ?? 'webdev').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'webdev';
  try {
    const res = await fetch(`https://dev.to/api/articles?tag=${tag}&top=7&per_page=6`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return curated;
    const items = parseDevTo(await res.json());
    if (items.length < 3) return curated;
    return { mode: 'live', source: 'dev.to', sourceUrl: `https://dev.to/t/${tag}`, fetchedAt, items };
  } catch {
    return curated;
  }
}
