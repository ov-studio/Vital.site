import * as lib_api_url     from '@/lib/api_url';
import * as lib_vault_index from '@/lib/vault_index';
import * as next_og         from 'next/og';

const OG_W = 2000;
const OG_H = 600;

/** Resource banner, center-cropped (top/bottom equally) to the same size as the brand OG images. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await lib_vault_index.find_vault_resource(id);
  const fallback = lib_api_url.get_page_url('/og/vault');
  if (!resource?.banner) return Response.redirect(fallback, 302);

  try {
    return new next_og.ImageResponse(
      <img
        src={resource.banner}
        width={OG_W}
        height={OG_H}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />,
      {
        width:   OG_W,
        height:  OG_H,
        headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' }
      }
    );
  }
  catch {
    return Response.redirect(fallback, 302);
  }
}
