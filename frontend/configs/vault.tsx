import * as config_site from '@/configs/site';

export type VaultTag = typeof ALL_TAGS[number];

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
