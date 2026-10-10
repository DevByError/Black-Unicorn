export interface SearchDoc {
  type: 'Work' | 'Notes' | 'Services';
  title: string;
  href: string;
  summary: string;
  tags: string[];
}

/** Score a document for a query. Substring hits beat in-order subsequence hits; title beats summary and tags. */
export function scoreDoc(doc: SearchDoc, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const fields: [string, number][] = [[doc.title, 10], [doc.tags.join(' '), 6], [doc.summary, 3]];
  let best = 0;
  for (const [text, weight] of fields) {
    const t = text.toLowerCase();
    if (t.includes(q)) best = Math.max(best, weight * 2 + (t.startsWith(q) ? 2 : 0));
    else if (isSubsequence(q, t) && q.length >= 3) best = Math.max(best, weight);
  }
  return best;
}

function isSubsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (const ch of hay) if (ch === needle[i]) i++;
  return i === needle.length;
}

export function search(docs: SearchDoc[], query: string, limit = 20): SearchDoc[] {
  return docs
    .map((d) => ({ d, s: scoreDoc(d, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.d);
}
