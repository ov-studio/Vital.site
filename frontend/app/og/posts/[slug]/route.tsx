import * as fs              from 'fs';
import * as path            from 'path';
import * as lib_news        from '@/lib/news';
import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';
import * as next_og         from 'next/og';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

const MIME: Record<string, string> = {
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif'
};

function cover_data_uri(cover: string): string | null {
  const root = path.join(process.cwd(), 'public');
  const file = path.join(root, cover);
  const mime = MIME[path.extname(file).toLowerCase()];
  if (!mime || !file.startsWith(root) || !fs.existsSync(file)) return null;
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

/** Post cover, center-cropped (top/bottom equally) to the same size as the brand OG images. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cover = lib_news.news.getPage([slug])?.data.cover;
  const src = lib_news.has_og_cover(cover) ? cover_data_uri(cover) : null;
  if (!src) next_navigation.notFound();

  return new next_og.ImageResponse(
    <img
      src={src}
      width={lib_og_brand.OG_W}
      height={lib_og_brand.OG_H}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />,
    { width: lib_og_brand.OG_W, height: lib_og_brand.OG_H }
  );
}

export function generateStaticParams() {
  return lib_news.get_posts()
    .filter((page) => lib_news.has_og_cover(page.data.cover))
    .map((page) => ({ slug: page.slugs[0] }));
}
