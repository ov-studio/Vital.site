/**
 * Case-insensitive substring filter across any fields of an item.
 * Returns the original list when the query is empty.
 */
export function search_filter<T>(
  list: T[],
  query: string,
  pick: (item: T) => Array<string | undefined | null>
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((item) => pick(item).some((v) => (v || '').toLowerCase().includes(q)));
}
