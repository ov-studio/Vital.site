/**
 * Format a timestamp as a short locale date (e.g. "Oct 8, 2026").
 * Returns an em dash when ts is missing or invalid.
 */
export function fmt_date(ts?: number): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } 
  catch {
    return '—';
  }
}