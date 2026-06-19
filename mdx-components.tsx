import * as fumadocs_mdx from 'fumadocs-ui/mdx';
import * as mdx_types from 'mdx/types';

export function getMDXComponents(components?: mdx_types.MDXComponents): mdx_types.MDXComponents {
  return {
    ...fumadocs_mdx.defaultMdxComponents,
    ...components,
  };
}
