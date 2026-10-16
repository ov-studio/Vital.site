import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';
import * as next_og         from 'next/og';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const allowed = new Set(lib_og_brand.site_og_sections());
  if (!allowed.has(section)) next_navigation.notFound();

  const { host, path, font, placeholder, width, height } = lib_og_brand.brand_og_payload(
    `/${section}`
  );

  return new next_og.ImageResponse(
    <lib_og_brand.BrandOgMarkup host={host} path={path} placeholderSrc={placeholder}/>,
    {
      width,
      height,
      fonts: [{ name: 'Rajdhani', data: font, weight: 600, style: 'normal' }],
    }
  );
}

export function generateStaticParams() {
  return lib_og_brand.site_og_sections().map((section) => ({ section }));
}
