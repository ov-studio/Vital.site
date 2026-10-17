import * as config_site from '@/configs/site';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/vault.json`;

export interface VaultListing {
  id:           string;
  name:         string;
  tagline?:     string;
  description?: string;
  banner?:      string;
}

/** Look up one resource in vault.json (null if missing or GitHub is unreachable). */
export async function find_vault_resource(id: string): Promise<VaultListing | null> {
  try {
    const res = await fetch(RAW_URL, {
      next:    { revalidate: 300 },
      headers: config_site.info.api.github_headers
    });
    if (!res.ok) return null;

    const index = await res.json() as { resources?: VaultListing[] };
    return index.resources?.find((r) => r.id === id) ?? null;
  }
  catch {
    return null;
  }
}
