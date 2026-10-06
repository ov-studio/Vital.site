/** Client-safe URL slug helper (no fumadocs / server-only imports). */
export function to_anchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
