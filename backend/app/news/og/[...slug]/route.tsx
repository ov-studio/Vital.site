import * as lib_api_url    from '@/lib/api_url';
import * as lib_news_index from '@/lib/news_index';
import * as lib_og_sizes   from '@/lib/og_sizes';
import * as next_og        from 'next/og';

/** Post cover, center-cropped (top/bottom equally) to the same size as the brand OG images. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join('/');
  const post     = await lib_news_index.find_news_post(slug);
  const fallback = lib_api_url.get_page_url('/og/news');
  if (!lib_news_index.has_og_cover(post?.cover)) return Response.redirect(fallback, 302);

  try {
    return new next_og.ImageResponse(
      <img
        src={post!.cover!}
        width={lib_og_sizes.OG_W}
        height={lib_og_sizes.OG_H}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />,
      {
        width:   lib_og_sizes.OG_W,
        height:  lib_og_sizes.OG_H,
        headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' }
      }
    );
  }
  catch {
    return Response.redirect(fallback, 302);
  }
}
