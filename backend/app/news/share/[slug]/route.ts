import * as config_site    from '@/configs/site';
import * as lib_api_url    from '@/lib/api_url';
import * as lib_news_index from '@/lib/news_index';

const OG_W = 2000;
const OG_H = 600;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Share page for a news post: serves OG/Twitter tags (title, description, cropped cover)
 * for link previews, then sends people on to /news?modal=<slug>.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news_url = lib_api_url.get_page_url('/news');

  const post = await lib_news_index.find_news_post(slug);
  if (!post) return Response.redirect(news_url, 302);

  const target      = `${news_url}?modal=${encodeURIComponent(slug)}`;
  const share_url   = lib_api_url.get_page_url(`/news/${encodeURIComponent(slug)}`);
  const image       = lib_news_index.has_og_cover(post.cover)
    ? lib_api_url.get_api_url(`/news/og/${encodeURIComponent(slug)}`)
    : lib_api_url.get_page_url('/og/news');
  const title       = `${post.title} - ${config_site.info.name}`;
  const description = post.description || config_site.info.description;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(target)}">
<meta property="og:site_name" content="${esc(config_site.info.name)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(share_url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
</head>
<body>
<script>location.replace(${JSON.stringify(target)});</script>
<a href="${esc(target)}">Continue to ${esc(post.title)}</a>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type':  'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}
