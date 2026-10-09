import * as config_site from '@/configs/site';

/** Resource tags live in the site config (single source of truth). */
export const ALL_TAGS: readonly string[] = config_site.info.vault.tags;

export type VaultTag = string;

export type VaultFiltersProps = {
  search?:     string;
  on_search?:  (v: string) => void;
  active_tag?: VaultTag | null;
  on_tag?:     (tag: VaultTag | null) => void;
  disabled?:   boolean;
};

export interface VaultResource {
  id:           string;
  name:         string;
  author:       string;
  author_url?:  string;
  version:      string;
  tagline:      string;
  description:  string;
  tags:         VaultTag[];
  banner?:      string;
  featured:     boolean;
  is_submodule: boolean;
  source_url?:  string;
  download_url: string | null;
}

export interface VaultIndex {
  generated_at: string;
  commit:       string;
  count:        number;
  resources:    VaultResource[];
}

export type LoadState = 'loading' | 'error' | 'done';
