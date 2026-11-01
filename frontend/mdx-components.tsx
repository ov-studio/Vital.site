import * as fumadocs_mdx      from 'fumadocs-ui/mdx';
import * as mdx_types         from 'mdx/types';
import * as config_site       from '@/configs/site';
import * as config_vault      from '@/configs/vault';
import * as config_masterlist from '@/configs/masterlist';

/** Bullet list of every valid server tag, straight from the site config so the docs can never drift from what the masterlist accepts. */
function MasterlistTags() {
  return <>{config_masterlist.info.tags.map((tag) => <span key={tag}>• <code>{tag}</code><br/></span>)}</>;
}

/** Bullet list of every valid resource tag, straight from the site config so the docs can never drift from what the Vault accepts. */
function VaultTags() {
  return <>{config_vault.info.tags.map((tag) => <span key={tag}>• <code>{tag}</code><br/></span>)}</>;
}

function join_and(items: string[]) {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Sentence describing platform support, generated from site config so the docs can never drift from the hero / roadmap. */
function PlatformSupport() {
  const names = (...s: config_site.PlatformStatus[]) => config_site.get_platforms(...s).map((p) => p.label);
  const supported = names('completed');
  const partial   = names('partial');
  const planned   = names('pending');

  const parts: string[] = [];
  if (supported.length) parts.push(`${join_and(supported)} ${supported.length > 1 ? 'are' : 'is'} supported today`);
  if (partial.length)   parts.push(`${join_and(partial)} ${partial.length > 1 ? 'have' : 'has'} early support`);

  let text = parts.join(', ');
  if (planned.length) text = text ? `${text}, with ${join_and(planned)} planned` : `${join_and(planned)} ${planned.length > 1 ? 'are' : 'is'} planned`;
  return <>{text ? `${text}.` : ''}</>;
}

export function getMDXComponents(components?: mdx_types.MDXComponents): mdx_types.MDXComponents {
  return {
    ...fumadocs_mdx.default,
    MasterlistTags,
    VaultTags,
    PlatformSupport,
    ...components
  };
}