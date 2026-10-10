export function formatDate(iso: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}
export function isRecent(iso: string, days = 90, now = Date.now()): boolean {
  return now - new Date(iso).getTime() < days * 86_400_000 && new Date(iso).getTime() <= now;
}
export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
