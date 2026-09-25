import * as lib_source      from '@/lib/source';
import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';
import * as next_og         from 'next/og';

export const revalidate = false;
export const runtime = 'nodejs';

export async function GET() {
  const page = lib_source.source.getPage([]);
  if (!page) next_navigation.notFound();

  const route_path = page.url.startsWith('/') ? page.url : `/${page.url}`;
  const { label, font, placeholder, width, height } = lib_og_brand.brand_og_payload(route_path);

  return new next_og.ImageResponse(
    <lib_og_brand.BrandOgMarkup label={label} placeholderSrc={placeholder} />,
    {
      width,
      height,
      fonts: [{ name: 'Rajdhani', data: font, weight: 600, style: 'normal' }]
    }
  );
}
