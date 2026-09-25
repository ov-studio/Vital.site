import * as lib_source      from '@/lib/source';
import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';
import * as next_og         from 'next/og';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page_slugs = slug.slice(0, -1);
  const page = lib_source.source.getPage(page_slugs);
  if (!page) next_navigation.notFound();

  const route_path = page.url.startsWith('/') ? page.url : `/${page.url}`;
  const label = lib_og_brand.og_label(route_path);
  const font = lib_og_brand.load_og_font();
  const placeholder = lib_og_brand.load_og_placeholder_data_uri();
  
  return new next_og.ImageResponse(
    <lib_og_brand.BrandOgMarkup label={label} placeholderSrc={placeholder} />,
    {
      width: lib_og_brand.OG_W,
      height: lib_og_brand.OG_H,
      fonts: [
        {
          name: 'Rajdhani',
          data: font,
          weight: 600,
          style: 'normal'
        }
      ]
    }
  );
}

export function generateStaticParams() {
  return lib_source.source.getPages().map((page) => ({
    lang: page.locale,
    slug: lib_source.getPageImage(page).segments
  }));
}
