/**
 * Format a unix timestamp (seconds) as YYYY-MM-DD.
 * Returns an empty string when ts is missing or invalid.
 */
export function fmt_date(ts?: number): string {
  if (!ts) return '';
  return new Date(ts * 1000).toISOString().slice(0, 10);
}
