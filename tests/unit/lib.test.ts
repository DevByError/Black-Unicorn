import { describe, expect, it } from 'vitest';
import { formatDate, isRecent, readingMinutes } from '../../src/lib/format';
import { DOT, RING_CENTER, tickSegments } from '../../src/lib/logo-geometry';
import { scoreDoc, search, type SearchDoc } from '../../src/lib/search';

const doc = (o: Partial<SearchDoc> = {}): SearchDoc => ({ type: 'Work', title: 'Alpha build', href: '/work/a', summary: 'A short summary', tags: ['web'], ...o });

describe('search', () => {
  it('returns 0 for an empty query', () => expect(scoreDoc(doc(), '  ')).toBe(0));
  it('ranks title substring above summary substring', () => {
    expect(scoreDoc(doc({ title: 'Gauge' }), 'gauge')).toBeGreaterThan(scoreDoc(doc({ summary: 'gauge' }), 'gauge'));
  });
  it('rewards a title that starts with the query', () => {
    expect(scoreDoc(doc({ title: 'Forge tools' }), 'forge')).toBeGreaterThan(scoreDoc(doc({ title: 'The forge' }), 'forge'));
  });
  it('allows loose subsequence matches only for 3+ characters', () => {
    expect(scoreDoc(doc({ title: 'Automation' }), 'atn')).toBeGreaterThan(0);
    expect(scoreDoc(doc({ title: 'Automation' }), 'ao')).toBe(0);
  });
  it('filters, sorts and limits', () => {
    const docs = [doc({ title: 'Zeta' }), doc({ title: 'Alpha forge', href: '/b' }), doc({ title: 'Forge first', href: '/c' })];
    expect(search(docs, 'forge').map((d) => d.href)).toEqual(['/c', '/b']);
    expect(search(docs, 'forge', 1)).toHaveLength(1);
    expect(search(docs, 'nothing-matches')).toEqual([]);
  });
});

describe('format', () => {
  it('formats dates in UTC regardless of host timezone', () => expect(formatDate('2026-03-05')).toBe('5 Mar 2026'));
  it('treats future dates as not recent', () => {
    const now = Date.parse('2026-06-01');
    expect(isRecent('2026-05-01', 90, now)).toBe(true);
    expect(isRecent('2025-01-01', 90, now)).toBe(false);
    expect(isRecent('2026-07-01', 90, now)).toBe(false);
  });
  it('reads at least one minute', () => {
    expect(readingMinutes('word')).toBe(1);
    expect(readingMinutes(Array(660).fill('w').join(' '))).toBe(3);
  });
});

describe('logo geometry', () => {
  const ticks = tickSegments();
  it('has 31 gauge ticks', () => expect(ticks).toHaveLength(31));
  it('every tick has finite coordinates and sits on the gauge side of the ring', () => {
    for (const t of ticks) {
      for (const v of [t.x1, t.y1, t.x2, t.y2, t.angle]) expect(Number.isFinite(v)).toBe(true);
      expect(t.x1).toBeGreaterThan(RING_CENTER.x - 5);
    }
  });
  it('keeps the ticks inside the 400x420 viewBox', () => {
    for (const t of ticks) { expect(t.x2).toBeLessThanOrEqual(400); expect(t.y2).toBeLessThanOrEqual(420); }
  });
  it('places the dot inside the ring', () => {
    expect(Math.hypot(DOT.cx - RING_CENTER.x, DOT.cy - RING_CENTER.y)).toBeLessThan(160);
  });
});
