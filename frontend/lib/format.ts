export function fmt_date(ts?: number): string {
  if (!ts) return '—';
  try { return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return '—'; }
}
