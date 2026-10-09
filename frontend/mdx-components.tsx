import * as fumadocs_mdx      from 'fumadocs-ui/mdx';
import * as mdx_types         from 'mdx/types';
import * as config_masterlist from '@/configs/masterlist';
import * as config_vault      from '@/configs/vault';

/** Bullet list of every valid server tag, straight from the site config so the docs can never drift from what the masterlist accepts. */
function MasterlistTags() {
  return <>{config_masterlist.info.tags.map((tag) => <span key={tag}>• <code>{tag}</code><br/></span>)}</>;
}

/** Bullet list of every valid resource tag, straight from the site config so the docs can never drift from what the Vault accepts. */
function VaultTags() {
  return <>{config_vault.info.tags.map((tag) => <span key={tag}>• <code>{tag}</code><br/></span>)}</>;
}

export function getMDXComponents(components?: mdx_types.MDXComponents): mdx_types.MDXComponents {
  return {
    ...fumadocs_mdx.default,
    MasterlistTags,
    VaultTags,
    ...components
  };
}