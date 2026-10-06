/** Shared URL-safe slug helper — safe for client + server (no fumadocs imports). */
export function to_anchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
