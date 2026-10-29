import * as config_site     from '@/configs/site';
import * as lib_api_url     from '@/lib/api_url';
import * as lib_vault_index from '@/lib/vault_index';
import * as lib_og_sizes    from '@/lib/og_sizes';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Share page for a vault resource: serves OG/Twitter tags (title, tagline, cropped banner)
 * for link previews, then sends people on to /vault?modal=<id>.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vault_url = lib_api_url.get_page_url('/vault');

  const resource = await lib_vault_index.find_vault_resource(id);
  if (!resource) return Response.redirect(vault_url, 302);

  const target      = `${vault_url}?modal=${encodeURIComponent(id)}`;
  const share_url   = lib_api_url.get_page_url(`/vault/${encodeURIComponent(id)}`);
  const image       = resource.banner
    ? lib_api_url.get_api_url(`/vault/og/${encodeURIComponent(id)}`)
    : lib_api_url.get_page_url('/og/vault');
  const title       = `${resource.name} - ${config_site.info.name}`;
  const description = resource.tagline || config_site.info.seo.description;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(target)}">
<meta property="og:site_name" content="${esc(config_site.info.name)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(share_url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="${lib_og_sizes.OG_W}">
<meta property="og:image:height" content="${lib_og_sizes.OG_H}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
</head>
<body>
<script>location.replace(${JSON.stringify(target)});</script>
<a href="${esc(target)}">Continue to ${esc(resource.name)}</a>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type':  'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}
