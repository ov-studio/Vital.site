import * as lib_og_brand    from '@/lib/og_brand';
import * as next_navigation from 'next/navigation';
import * as next_og         from 'next/og';

export const revalidate = false;
export const dynamicParams = false;
export const runtime = 'nodejs';

const SECTIONS = new Set([
  'roadmap',
  'vault',
  'studio',
  'workspace',
  'tos',
  'benchmarks',
]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!SECTIONS.has(section)) next_navigation.notFound();

  const { label, font, placeholder, width, height } = lib_og_brand.brand_og_payload(
    `/${section}`
  );

  return new next_og.ImageResponse(
    <lib_og_brand.BrandOgMarkup label={label} placeholderSrc={placeholder} />,
    {
      width,
      height,
      fonts: [{ name: 'Rajdhani', data: font, weight: 600, style: 'normal' }],
    }
  );
}

export function generateStaticParams() {
  return [
    { section: 'roadmap' },
    { section: 'vault' },
    { section: 'studio' },
    { section: 'workspace' },
    { section: 'tos' },
    { section: 'benchmarks' }
  ];
}
